
import UniversalSDK from './github-db-sdk';

// SDK Configuration - replace with your actual GitHub repo details
const sdkConfig = {
  owner: 'your-username', // Replace with your GitHub username
  repo: 'minhaajulhudaa-data', // Replace with your GitHub repo name
  token: 'your-github-token', // Replace with your GitHub personal access token
  branch: 'main',
  basePath: 'db',
  mediaPath: 'media',
  schemas: {
    // School schemas
    students: {
      required: ['name', 'email', 'class'],
      types: {
        name: 'string',
        email: 'string',
        class: 'string',
        enrollmentDate: 'date',
        status: 'string'
      }
    },
    courses: {
      required: ['title', 'instructor'],
      types: {
        title: 'string',
        description: 'string',
        instructor: 'string',
        duration: 'number',
        level: 'string'
      }
    },
    blog_posts: {
      required: ['title', 'content', 'platform'],
      types: {
        title: 'string',
        content: 'string',
        platform: 'string',
        author: 'string',
        publishedAt: 'date',
        status: 'string'
      }
    },
    // Masjid schemas
    prayer_times: {
      required: ['date', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
      types: {
        date: 'date',
        fajr: 'string',
        dhuhr: 'string',
        asr: 'string',
        maghrib: 'string',
        isha: 'string'
      }
    },
    events: {
      required: ['title', 'date', 'platform'],
      types: {
        title: 'string',
        description: 'string',
        date: 'date',
        platform: 'string',
        location: 'string'
      }
    },
    // Charity schemas
    campaigns: {
      required: ['title', 'target', 'status'],
      types: {
        title: 'string',
        description: 'string',
        target: 'number',
        raised: 'number',
        status: 'string',
        createdAt: 'date'
      }
    },
    donations: {
      required: ['amount', 'campaign', 'donor'],
      types: {
        amount: 'number',
        campaign: 'string',
        donor: 'string',
        currency: 'string',
        createdAt: 'date'
      }
    },
    // Travels schemas
    packages: {
      required: ['title', 'price', 'type'],
      types: {
        title: 'string',
        description: 'string',
        price: 'number',
        type: 'string',
        duration: 'number',
        available: 'boolean'
      }
    },
    bookings: {
      required: ['package', 'customer', 'status'],
      types: {
        package: 'string',
        customer: 'string',
        status: 'string',
        totalAmount: 'number',
        bookingDate: 'date'
      }
    }
  }
};

// Create SDK instance
const db = new UniversalSDK(sdkConfig);

// Initialize the database
db.init().catch(console.error);

export default db;
