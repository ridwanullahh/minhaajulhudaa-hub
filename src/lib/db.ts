
import UniversalSDK from './github-db-sdk';

// SDK Configuration - using environment variables for security
const sdkConfig = {
  owner: 'ridwanullahh', // GitHub username
  repo: 'minhaajulhudaa-hub', // Current repository
  token: import.meta.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || 'ghp_placeholder_token', // GitHub token from env
  branch: 'main',
  basePath: 'data', // Platform-specific data folders (school/, masjid/, charity/, travels/)
  mediaPath: 'media',
  schemas: {
    // Universal schemas
    users: {
      required: ['email', 'platform'],
      types: {
        email: 'string',
        name: 'string',
        platform: 'string',
        role: 'string',
        verified: 'boolean',
        createdAt: 'date'
      }
    },
    blog_posts: {
      required: ['title', 'content', 'platform'],
      types: {
        title: 'string',
        content: 'string',
        excerpt: 'string',
        platform: 'string',
        author: 'string',
        publishedAt: 'date',
        status: 'string',
        featured: 'boolean',
        tags: 'array'
      }
    },
    pages: {
      required: ['title', 'content', 'platform'],
      types: {
        title: 'string',
        content: 'string',
        slug: 'string',
        platform: 'string',
        status: 'string',
        updatedAt: 'date'
      }
    },
    // School schemas
    students: {
      required: ['name', 'email', 'class'],
      types: {
        name: 'string',
        email: 'string',
        class: 'string',
        enrollmentDate: 'date',
        status: 'string',
        parentContact: 'string',
        address: 'string'
      }
    },
    courses: {
      required: ['title', 'instructor'],
      types: {
        title: 'string',
        description: 'string',
        instructor: 'string',
        duration: 'number',
        level: 'string',
        price: 'number',
        status: 'string'
      }
    },
    classes: {
      required: ['name', 'level'],
      types: {
        name: 'string',
        level: 'string',
        capacity: 'number',
        enrolled: 'number',
        teacher: 'string',
        schedule: 'string'
      }
    },
    programs: {
      required: ['title', 'type'],
      types: {
        title: 'string',
        description: 'string',
        type: 'string',
        duration: 'string',
        requirements: 'array',
        benefits: 'array'
      }
    },
    // Masjid schemas
    prayer_times: {
      required: ['date', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
      types: {
        date: 'date',
        fajr: 'string',
        fajrIqamah: 'string',
        dhuhr: 'string',
        dhuhrIqamah: 'string',
        asr: 'string',
        asrIqamah: 'string',
        maghrib: 'string',
        maghribIqamah: 'string',
        isha: 'string',
        ishaIqamah: 'string',
        jumah: 'string'
      }
    },
    events: {
      required: ['title', 'date', 'platform'],
      types: {
        title: 'string',
        description: 'string',
        date: 'date',
        endDate: 'date',
        platform: 'string',
        location: 'string',
        category: 'string',
        featured: 'boolean'
      }
    },
    audio_library: {
      required: ['title', 'speaker'],
      types: {
        title: 'string',
        speaker: 'string',
        description: 'string',
        audioUrl: 'string',
        duration: 'string',
        category: 'string',
        language: 'string',
        uploadDate: 'date'
      }
    },
    announcements: {
      required: ['title', 'content'],
      types: {
        title: 'string',
        content: 'string',
        priority: 'string',
        expiryDate: 'date',
        active: 'boolean',
        createdAt: 'date'
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
        category: 'string',
        endDate: 'date',
        featured: 'boolean',
        createdAt: 'date'
      }
    },
    donations: {
      required: ['amount', 'campaign', 'donor'],
      types: {
        amount: 'number',
        campaign: 'string',
        donor: 'string',
        donorEmail: 'string',
        currency: 'string',
        paymentMethod: 'string',
        anonymous: 'boolean',
        createdAt: 'date'
      }
    },
    projects: {
      required: ['title', 'description'],
      types: {
        title: 'string',
        description: 'string',
        location: 'string',
        beneficiaries: 'number',
        status: 'string',
        images: 'array',
        startDate: 'date'
      }
    },
    volunteers: {
      required: ['name', 'email', 'skills'],
      types: {
        name: 'string',
        email: 'string',
        phone: 'string',
        skills: 'array',
        availability: 'string',
        experience: 'string',
        status: 'string'
      }
    },
    testimonials: {
      required: ['name', 'content'],
      types: {
        name: 'string',
        content: 'string',
        location: 'string',
        image: 'string',
        rating: 'number',
        featured: 'boolean',
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
        maxPeople: 'number',
        available: 'boolean',
        features: 'array',
        itinerary: 'array',
        images: 'array'
      }
    },
    bookings: {
      required: ['package', 'customer', 'status'],
      types: {
        package: 'string',
        customer: 'string',
        customerEmail: 'string',
        status: 'string',
        totalAmount: 'number',
        paidAmount: 'number',
        travelers: 'number',
        specialRequests: 'string',
        bookingDate: 'date',
        travelDate: 'date'
      }
    },
    reviews: {
      required: ['package', 'customer', 'rating'],
      types: {
        package: 'string',
        customer: 'string',
        rating: 'number',
        comment: 'string',
        verified: 'boolean',
        createdAt: 'date'
      }
    },
    customers: {
      required: ['name', 'email'],
      types: {
        name: 'string',
        email: 'string',
        phone: 'string',
        address: 'string',
        passportNumber: 'string',
        emergencyContact: 'string',
        preferences: 'object',
        totalBookings: 'number'
      }
    }
  }
};

// Create SDK instance
const db = new UniversalSDK(sdkConfig);

// Initialize the database
db.init().catch(console.error);

export default db;
