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
    console.log(`Checking and seeding data for ${platform}...`);
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
    const now = new Date();
    // Seed Pages
    if ((await this.get('school', 'pages')).length === 0) {
      console.log('Seeding school pages...');
      await this.insert('school', 'pages', { slug: 'about', title: 'About Our School', content: 'Details about the school\'s mission, vision, and values.' });
      await this.insert('school', 'pages', { slug: 'admissions', title: 'Admissions Process', content: 'Information on how to enroll your child.' });
    }
    // Seed Blog Posts
    if ((await this.get('school', 'blog_posts')).length === 0) {
      console.log('Seeding school blog posts...');
      await this.insert('school', 'blog_posts', { title: 'Welcome to Minhaajulhudaa School', content: 'Bismillah. We are overjoyed to welcome you...', excerpt: 'Discover our unique approach...', author: 'Admin', publishedAt: now.toISOString(), tags: ['welcome'], featured: true });
      await this.insert('school', 'blog_posts', { title: 'The Importance of Tarbiyyah', content: 'Tarbiyyah, the Islamic concept of holistic development...', excerpt: 'Learn how we focus on character building...', author: 'Head of Islamic Studies', publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), tags: ['tarbiyyah'], featured: false });
    }
    // Seed Events
    if ((await this.get('school', 'events')).length === 0) {
      console.log('Seeding school events...');
      await this.insert('school', 'events', { title: 'Annual Quran Competition', description: 'Celebrating our students\' dedication to the Book of Allah.', date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), location: 'Main Hall' });
    }
    // Seed Programs
    if ((await this.get('school', 'programs')).length === 0) {
      console.log('Seeding school programs...');
      await this.insert('school', 'programs', { name: 'Full-Time Hifz Program', description: 'Memorize the Quran while continuing core academic subjects.', duration: '3-5 years', ageGroup: '8+' });
    }
    // Seed Classes
    if ((await this.get('school', 'classes')).length === 0) {
      console.log('Seeding school classes...');
      await this.insert('school', 'classes', { name: 'Grade 1', level: 'Elementary', capacity: 20, teacher: 'Mrs. Fatima' });
    }
    // Seed Courses
    if ((await this.get('school', 'courses')).length === 0) {
      console.log('Seeding school courses...');
      await this.insert('school', 'courses', { title: 'Advanced Arabic Grammar', instructor: 'Dr. Yusuf', level: 'Advanced' });
    }
  }

  private async seedMasjidData(): Promise<void> {
    const now = new Date();
    // Seed Prayer Times
    if ((await this.get('masjid', 'prayer_times')).length === 0) {
      console.log('Seeding masjid prayer times...');
      const today = now.toISOString().split('T')[0];
      await this.insert('masjid', 'prayer_times', { date: today, fajr: { adhan: '5:15 AM', iqamah: '5:30 AM' }, dhuhr: { adhan: '1:00 PM', iqamah: '1:15 PM' }, asr: { adhan: '4:45 PM', iqamah: '5:00 PM' }, maghrib: { adhan: '7:30 PM', iqamah: '7:35 PM' }, isha: { adhan: '9:00 PM', iqamah: '9:15 PM' }, jumah: { khutbah: '1:15 PM', iqamah: '1:45 PM' } });
    }
    // Seed Events
    if ((await this.get('masjid', 'events')).length === 0) {
        console.log('Seeding masjid events...');
        await this.insert('masjid', 'events', { title: 'Weekly Tafsir Circle: Surah Al-Kahf', description: 'A deep dive into the meanings and lessons of Surah Al-Kahf.', date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), location: 'Main Prayer Hall', type: 'lecture' });
    }
    // Seed Audio Library
    if ((await this.get('masjid', 'audio_library')).length === 0) {
        console.log('Seeding masjid audio library...');
        await this.insert('masjid', 'audio_library', { title: 'The Seeker\'s Path', speaker: 'Sheikh Hamza Yusuf', category: 'Spirituality', url: 'https://archive.org/download/some-lecture/lecture.mp3', duration: '1:15:30' });
    }
    // Seed Announcements
    if ((await this.get('masjid', 'announcements')).length === 0) {
        console.log('Seeding masjid announcements...');
        await this.insert('masjid', 'announcements', { title: 'Jumu\'ah Reminder', content: 'The Friday sermon will be delivered by Imam Abdullah on the topic of gratitude.', date: now.toISOString(), priority: 'high' });
    }
    // Seed Blog Posts
    if ((await this.get('masjid', 'blog_posts')).length === 0) {
      console.log('Seeding masjid blog posts...');
      await this.insert('masjid', 'blog_posts', { title: 'The Heart of the Community', content: 'The Masjid is more than a place of worship; it is the heart of our community...', excerpt: 'Discover the role of the Masjid...', author: 'Imam Abdullah', publishedAt: now.toISOString(), tags: ['community', 'masjid'], featured: true });
    }
  }

  private async seedCharityData(): Promise<void> {
    const now = new Date();
    // Seed Campaigns
    if ((await this.get('charity', 'campaigns')).length === 0) {
      console.log('Seeding charity campaigns...');
      await this.insert('charity', 'campaigns', { title: 'Ramadan Food Security Program', description: 'Help us provide essential food packages to families in need this Ramadan.', goal: 25000, raised: 7500, currency: 'USD', category: 'food-security', featured: true });
      await this.insert('charity', 'campaigns', { title: 'Orphan Sponsorship', description: 'Sponsor an orphan and provide them with education, healthcare, and a loving environment.', goal: 50000, raised: 12000, currency: 'USD', category: 'orphan-care', featured: true });
    }
    // Seed Projects
    if ((await this.get('charity', 'projects')).length === 0) {
        console.log('Seeding charity projects...');
        await this.insert('charity', 'projects', { title: 'Clean Water Well in Somalia', description: 'Building a new well to provide clean and safe drinking water to a village of 500 people.', status: 'In Progress', location: 'Somalia' });
    }
    // Seed Testimonials
    if ((await this.get('charity', 'testimonials')).length === 0) {
        console.log('Seeding charity testimonials...');
        await this.insert('charity', 'testimonials', { name: 'Aisha Rahman', content: 'The support I received from this foundation during a difficult time was a true blessing from Allah. I am forever grateful.', location: 'USA', featured: true });
    }
    // Seed Blog Posts
    if ((await this.get('charity', 'blog_posts')).length === 0) {
      console.log('Seeding charity blog posts...');
      await this.insert('charity', 'blog_posts', { title: 'The Power of Sadaqah Jariyah', content: 'Sadaqah Jariyah is a continuous charity that benefits one even after death...', excerpt: 'Learn about ongoing charity...', author: 'Foundation Director', publishedAt: now.toISOString(), tags: ['sadaqah', 'charity'], featured: true });
    }
  }

  private async seedTravelsData(): Promise<void> {
    // Seed Packages
    if ((await this.get('travels', 'packages')).length === 0) {
      console.log('Seeding travels packages...');
      await this.insert('travels', 'packages', { title: '14-Day Umrah Package - Spiritual Retreat', description: 'Embark on a transformative journey to the holy cities of Makkah and Madinah.', price: 2999, currency: 'USD', duration: '14 Days', category: 'umrah', featured: true });
      await this.insert('travels', 'packages', { title: 'Hajj 2025: The Journey of a Lifetime', description: 'Fulfill the fifth pillar of Islam with our comprehensive Hajj package.', price: 9999, currency: 'USD', duration: '21 Days', category: 'hajj', featured: false });
    }
    // Seed Reviews
    if ((await this.get('travels', 'reviews')).length === 0) {
      console.log('Seeding travels reviews...');
      await this.insert('travels', 'reviews', { customer: 'Yusuf Ahmed', rating: 5, comment: 'An unforgettable and spiritually uplifting experience. The guides were knowledgeable and caring.', package: '14-Day Umrah Package' });
    }
    // Seed Travel Guides
    if ((await this.get('travels', 'travel_guides')).length === 0) {
      console.log('Seeding travels guides...');
      await this.insert('travels', 'travel_guides', { title: 'Preparing for Umrah: A Checklist', content: 'A comprehensive guide to help you prepare physically and spiritually for your journey.', author: 'Travels Team' });
    }
    // Seed Blog Posts
    if ((await this.get('travels', 'blog_posts')).length === 0) {
      console.log('Seeding travels blog posts...');
      await this.insert('travels', 'blog_posts', { title: 'The History of the Kaaba', content: 'Explore the rich history of the holiest site in Islam...', excerpt: 'A brief look at the history of the Kaaba...', author: 'Cultural Guide', publishedAt: new Date().toISOString(), tags: ['hajj', 'history'], featured: true });
    }
  }
}

export default RealTimeGitHubDB;
