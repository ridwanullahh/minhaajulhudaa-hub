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
        await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path,
          message: `Auto-create ${platform}/${collection} collection`,
          content: Buffer.from(JSON.stringify([], null, 2)).toString('base64'),
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
        const content = Buffer.from(response.data.content, 'base64').toString();
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

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: `Update ${platform}/${collection} collection`,
        content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
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
    }
  }
}

export default RealTimeGitHubDB;
