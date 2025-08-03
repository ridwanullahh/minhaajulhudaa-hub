import RealTimeGitHubDB from './real-time-github-db';

// Initialize the real-time GitHub database
const githubDB = new RealTimeGitHubDB({
  owner: 'ridwanullahh',
  repo: 'minhaajulhudaa-hub',
  token: import.meta.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || 'ghp_placeholder_token',
  branch: 'main'
});

// Platform-specific database operations with real GitHub integration
export class PlatformDB {
  private platform: string;

  constructor(platform: string) {
    this.platform = platform;
  }

  // Generic CRUD operations with real GitHub integration
  async get<T = any>(collection: string): Promise<T[]> {
    return await githubDB.get<T>(this.platform, collection);
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; createdAt: string; updatedAt: string }> {
    return await githubDB.insert<T>(this.platform, collection, {
      ...item,
      platform: this.platform
    });
  }

  async update<T = any>(collection: string, id: string, updates: Partial<T>): Promise<T & { id: string; createdAt: string; updatedAt: string }> {
    return await githubDB.update<T>(this.platform, collection, id, updates);
  }

  async delete(collection: string, id: string): Promise<boolean> {
    return await githubDB.delete(this.platform, collection, id);
  }

  async find<T = any>(collection: string, query: Partial<T>): Promise<T[]> {
    return await githubDB.find<T>(this.platform, collection, query);
  }

  // Subscribe to real-time updates
  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    return githubDB.subscribe<T>(this.platform, collection, callback);
  }

  // Platform-specific methods
  async initializePlatform(): Promise<void> {
    await githubDB.initializePlatform(this.platform);
  }

  private getPlatformCollections(): string[] {
    const baseCollections = ['blog_posts', 'pages', 'media', 'settings', 'events'];
    
    switch (this.platform) {
      case 'school':
        return [
          ...baseCollections,
          'students', 'courses', 'classes', 'programs', 'admissions',
          'assignments', 'exams', 'grades', 'staff', 'announcements',
          'library', 'shop_products', 'shop_orders', 'payments'
        ];
      
      case 'masjid':
        return [
          ...baseCollections,
          'prayer_times', 'audio_library', 'donations', 'announcements',
          'quran_recitations', 'islamic_calendar', 'volunteers', 'programs'
        ];
      
      case 'charity':
        return [
          ...baseCollections,
          'campaigns', 'projects', 'donations', 'volunteers', 'beneficiaries',
          'testimonials', 'impact_reports', 'fundraisers'
        ];
      
      case 'travels':
        return [
          ...baseCollections,
          'packages', 'bookings', 'customers', 'reviews', 'itineraries',
          'travel_guides', 'visa_info', 'payments'
        ];
      
      default:
        return baseCollections;
    }
  }
}

// Create platform-specific instances
export const schoolDB = new PlatformDB('school');
export const masjidDB = new PlatformDB('masjid');
export const charityDB = new PlatformDB('charity');
export const travelsDB = new PlatformDB('travels');

// Initialize all platforms
export const initializeAllPlatforms = async () => {
  await githubDB.initializeAllPlatforms();
};

// Export platform getter
export const getPlatformDB = (platform: string): PlatformDB => {
  switch (platform) {
    case 'school': return schoolDB;
    case 'masjid': return masjidDB;
    case 'charity': return charityDB;
    case 'travels': return travelsDB;
    default: throw new Error(`Unknown platform: ${platform}`);
  }
};
