import { Octokit } from '@octokit/rest';

interface GitHubDBConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
}

interface CollectionData {
  [key: string]: any;
  id: string;
  createdAt: string;
  updatedAt: string;
}

class RealTimeGitHubDB {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;
  private cache: Map<string, any[]> = new Map();
  private subscribers: Map<string, Set<(data: any[]) => void>> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: GitHubDBConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.branch = config.branch || 'main';
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  private getFilePath(platform: string, collection: string): string {
    return `data/${platform}/${collection}.json`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async ensureCollectionExists(platform: string, collection: string): Promise<void> {
    const path = this.getFilePath(platform, collection);
    
    try {
      await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });
    } catch (error: any) {
      if (error.status === 404) {
        // Create empty collection
        const content = JSON.stringify([], null, 2);
        const base64Content = btoa(unescape(encodeURIComponent(content)));
        await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path,
          message: `Auto-create ${platform}/${collection} collection`,
          content: base64Content,
          branch: this.branch,
        });
        console.log(`Created collection: ${platform}/${collection}`);
      } else {
        throw error;
      }
    }
  }

  async get<T = CollectionData>(platform: string, collection: string): Promise<T[]> {
    await this.ensureCollectionExists(platform, collection);
    const path = this.getFilePath(platform, collection);
    const cacheKey = `${platform}/${collection}`;

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('content' in response.data) {
        const content = decodeURIComponent(escape(atob(response.data.content)));
        const data = JSON.parse(content) as T[];
        
        // Update cache
        this.cache.set(cacheKey, data);
        
        // Notify subscribers
        this.notifySubscribers(cacheKey, data);
        
        return data;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${cacheKey}:`, error);
      return this.cache.get(cacheKey) || [];
    }
  }

  async insert<T = CollectionData>(
    platform: string, 
    collection: string, 
    item: Partial<T>
  ): Promise<T & CollectionData> {
    const data = await this.get<T>(platform, collection);
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T & CollectionData;

    data.push(newItem);
    await this.saveCollection(platform, collection, data);
    return newItem;
  }

  async update<T = CollectionData>(
    platform: string,
    collection: string,
    id: string,
    updates: Partial<T>
  ): Promise<T & CollectionData> {
    const data = await this.get<T>(platform, collection);
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${platform}/${collection}`);
    }

    const updatedItem = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T & CollectionData;

    data[index] = updatedItem;
    await this.saveCollection(platform, collection, data);
    return updatedItem;
  }

  async delete(platform: string, collection: string, id: string): Promise<boolean> {
    const data = await this.get(platform, collection);
    const initialLength = data.length;
    const filteredData = data.filter((item: any) => item.id !== id);
    
    if (filteredData.length === initialLength) {
      return false; // Item not found
    }

    await this.saveCollection(platform, collection, filteredData);
    return true;
  }

  async find<T = CollectionData>(
    platform: string,
    collection: string,
    query: Partial<T>
  ): Promise<T[]> {
    const data = await this.get<T>(platform, collection);
    return data.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        return (item as any)[key] === value;
      });
    });
  }

  private async saveCollection(platform: string, collection: string, data: any[]): Promise<void> {
    const path = this.getFilePath(platform, collection);
    const cacheKey = `${platform}/${collection}`;

    try {
      // Get current file to get SHA
      const currentFile = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      const sha = 'sha' in currentFile.data ? currentFile.data.sha : undefined;

      const content = JSON.stringify(data, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(content)));
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: `Update ${platform}/${collection} collection`,
        content: base64Content,
        sha,
        branch: this.branch,
      });

      // Update cache
      this.cache.set(cacheKey, data);
      
      // Notify subscribers
      this.notifySubscribers(cacheKey, data);
    } catch (error) {
      console.error(`Error saving ${cacheKey}:`, error);
      throw error;
    }
  }

  subscribe<T = CollectionData>(
    platform: string,
    collection: string,
    callback: (data: T[]) => void
  ): () => void {
    const cacheKey = `${platform}/${collection}`;
    
    if (!this.subscribers.has(cacheKey)) {
      this.subscribers.set(cacheKey, new Set());
    }
    
    this.subscribers.get(cacheKey)!.add(callback);
    
    // Start polling for this collection
    this.startPolling(platform, collection);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(cacheKey)?.delete(callback);
      if (this.subscribers.get(cacheKey)?.size === 0) {
        this.stopPolling(cacheKey);
      }
    };
  }

  private startPolling(platform: string, collection: string): void {
    const cacheKey = `${platform}/${collection}`;
    
    if (this.pollingIntervals.has(cacheKey)) {
      return; // Already polling
    }

    const interval = setInterval(async () => {
      try {
        await this.get(platform, collection);
      } catch (error) {
        console.error(`Polling error for ${cacheKey}:`, error);
      }
    }, 30000); // Poll every 30 seconds

    this.pollingIntervals.set(cacheKey, interval);
  }

  private stopPolling(cacheKey: string): void {
    const interval = this.pollingIntervals.get(cacheKey);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(cacheKey);
    }
  }

  private notifySubscribers(cacheKey: string, data: any[]): void {
    const callbacks = this.subscribers.get(cacheKey);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  async initializePlatform(platform: string): Promise<void> {
    const collections = this.getPlatformCollections(platform);
    
    for (const collection of collections) {
      await this.ensureCollectionExists(platform, collection);
    }
  }

  private getPlatformCollections(platform: string): string[] {
    const baseCollections = ['blog_posts', 'pages', 'media', 'settings', 'events', 'users'];
    
    switch (platform) {
      case 'school':
        return [
          ...baseCollections,
          'students', 'courses', 'classes', 'programs', 'admissions',
          'assignments', 'exams', 'grades', 'staff', 'announcements',
          'library', 'wiki', 'shop_products', 'shop_orders', 'payments',
          'schedules', 'attendance', 'reports'
        ];
      
      case 'masjid':
        return [
          ...baseCollections,
          'prayer_times', 'audio_library', 'donations', 'announcements',
          'quran_recitations', 'islamic_calendar', 'volunteers', 'programs',
          'bookstore', 'live_streams'
        ];
      
      case 'charity':
        return [
          ...baseCollections,
          'campaigns', 'projects', 'donations', 'volunteers', 'beneficiaries',
          'testimonials', 'impact_reports', 'fundraisers', 'financial_reports',
          'success_stories', 'faq'
        ];
      
      case 'travels':
        return [
          ...baseCollections,
          'packages', 'bookings', 'customers', 'reviews', 'itineraries',
          'travel_guides', 'visa_info', 'payments', 'destinations',
          'travel_resources', 'customer_dashboard'
        ];
      
      default:
        return baseCollections;
    }
  }

  async initializeAllPlatforms(): Promise<void> {
    const platforms = ['school', 'masjid', 'charity', 'travels'];
    
    for (const platform of platforms) {
      await this.initializePlatform(platform);
      await this.seedPlatformData(platform);
    }
  }

  async seedPlatformData(platform: string): Promise<void> {
    try {
      switch (platform) {
        case 'school':
          await this.seedSchoolData();
          break;
        case 'masjid':
          await this.seedMasjidData();
          break;
        case 'charity':
          await this.seedCharityData();
          break;
        case 'travels':
          await this.seedTravelsData();
          break;
      }
    } catch (error) {
      console.error(`Error seeding ${platform} data:`, error);
    }
  }

  private async seedSchoolData(): Promise<void> {
    // Seed blog posts
    const blogPosts = await this.get('school', 'blog_posts');
    if (blogPosts.length === 0) {
      await this.insert('school', 'blog_posts', {
        title: 'Welcome to Minhaajulhudaa School',
        content: 'We are delighted to welcome you to our Islamic educational institution...',
        excerpt: 'Discover our comprehensive Islamic education programs',
        author: 'School Administration',
        publishedAt: new Date().toISOString(),
        tags: ['welcome', 'education', 'islam'],
        featured: true
      });
    }

    // Seed events
    const events = await this.get('school', 'events');
    if (events.length === 0) {
      await this.insert('school', 'events', {
        title: 'School Opening Ceremony',
        description: 'Join us for the grand opening of Minhaajulhudaa School',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'School Auditorium',
        type: 'ceremony'
      });
    }
  }

  private async seedMasjidData(): Promise<void> {
    // Seed prayer times
    const prayerTimes = await this.get('masjid', 'prayer_times');
    if (prayerTimes.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      await this.insert('masjid', 'prayer_times', {
        date: today,
        fajr: { adhan: '5:30 AM', iqamah: '5:45 AM' },
        dhuhr: { adhan: '12:45 PM', iqamah: '1:00 PM' },
        asr: { adhan: '4:15 PM', iqamah: '4:30 PM' },
        maghrib: { adhan: '6:30 PM', iqamah: '6:35 PM' },
        isha: { adhan: '8:00 PM', iqamah: '8:15 PM' },
        jumah: { adhan: '1:00 PM', iqamah: '1:15 PM' }
      });
    }

    // Seed events
    const events = await this.get('masjid', 'events');
    if (events.length === 0) {
      await this.insert('masjid', 'events', {
        title: 'Friday Prayer',
        description: 'Weekly Jumah prayer with khutbah',
        date: new Date().toISOString(),
        location: 'Main Prayer Hall',
        type: 'prayer'
      });
    }
  }

  private async seedCharityData(): Promise<void> {
    // Seed campaigns
    const campaigns = await this.get('charity', 'campaigns');
    if (campaigns.length === 0) {
      await this.insert('charity', 'campaigns', {
        title: 'Clean Water Initiative',
        description: 'Help us provide clean drinking water to communities in need',
        goal: 10000,
        raised: 2500,
        currency: 'USD',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'water',
        featured: true
      });
    }
  }

  private async seedTravelsData(): Promise<void> {
    // Seed packages
    const packages = await this.get('travels', 'packages');
    if (packages.length === 0) {
      await this.insert('travels', 'packages', {
        title: 'Umrah Package 2024',
        description: 'Experience the spiritual journey of Umrah with our comprehensive package',
        price: 2500,
        currency: 'USD',
        duration: '10 days',
        includes: ['Flights', 'Hotel', 'Visa', 'Transportation'],
        category: 'umrah',
        featured: true
      });
    }
  }
}

export default RealTimeGitHubDB;
