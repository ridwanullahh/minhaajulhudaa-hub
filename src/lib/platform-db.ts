import db from './db';

// Platform-specific database operations with folder structure
export class PlatformDB {
  private platform: string;
  
  constructor(platform: string) {
    this.platform = platform;
  }

  // Get collection with platform prefix
  private getCollectionName(collection: string): string {
    return `${this.platform}/${collection}`;
  }

  // Generic CRUD operations
  async get<T = any>(collection: string): Promise<T[]> {
    return await db.get<T>(this.getCollectionName(collection));
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    return await db.insert<T>(this.getCollectionName(collection), {
      ...item,
      platform: this.platform,
      createdAt: new Date().toISOString()
    });
  }

  async update<T = any>(collection: string, id: string, updates: Partial<T>): Promise<T> {
    return await db.update<T>(this.getCollectionName(collection), id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async delete(collection: string, id: string): Promise<boolean> {
    return await db.delete(this.getCollectionName(collection), id);
  }

  async find<T = any>(collection: string, query: Partial<T>): Promise<T[]> {
    return await db.find<T>(this.getCollectionName(collection), query);
  }

  // Subscribe to real-time updates
  subscribe<T = any>(collection: string, callback: (data: T[]) => void): void {
    db.subscribe(this.getCollectionName(collection), callback);
  }

  unsubscribe(collection: string, callback: (data: any[]) => void): void {
    db.unsubscribe(this.getCollectionName(collection), callback);
  }

  // Platform-specific methods
  async initializePlatform(): Promise<void> {
    const collections = this.getPlatformCollections();
    
    for (const collection of collections) {
      try {
        await this.get(collection);
      } catch (error) {
        console.log(`Auto-creating ${this.platform} collection: ${collection}`);
      }
    }
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
  await Promise.all([
    schoolDB.initializePlatform(),
    masjidDB.initializePlatform(),
    charityDB.initializePlatform(),
    travelsDB.initializePlatform()
  ]);
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
