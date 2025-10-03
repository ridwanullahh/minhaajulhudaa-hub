import UniversalSDK from './github-db-sdk';

const sdkConfig = {
  owner: import.meta.env.VITE_GITHUB_USER,
  repo: import.meta.env.VITE_GITHUB_REPO,
  token: import.meta.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || 'ghp_placeholder_token',
  branch: 'main',
  basePath: 'data',
  mediaPath: 'media',
  schemas: {
    users: {
      required: ['email', 'platform'],
      types: {
        email: 'string',
        name: 'string',
        platform: 'string',
        role: 'string',
        verified: 'boolean',
        createdAt: 'date',
        password: 'string',
        roles: 'array',
        permissions: 'array'
      }
    },
    otps: {
      required: ['email', 'otp', 'reason'],
      types: {
        email: 'string',
        otp: 'string',
        reason: 'string',
        expiresAt: 'number',
        createdAt: 'date'
      }
    },
    transactions: {
      required: ['reference', 'provider', 'amount', 'currency', 'status', 'platform', 'email'],
      types: {
        reference: 'string',
        provider: 'string',
        amount: 'number',
        currency: 'string',
        status: 'string',
        platform: 'string',
        userId: 'string',
        email: 'string',
        transactionId: 'string',
        metadata: 'object',
        createdAt: 'date',
        updatedAt: 'date',
        paidAt: 'date'
      }
    },
    media: {
      required: ['publicId', 'url', 'secureUrl', 'resourceType', 'format', 'platform'],
      types: {
        publicId: 'string',
        url: 'string',
        secureUrl: 'string',
        resourceType: 'string',
        format: 'string',
        width: 'number',
        height: 'number',
        size: 'number',
        folder: 'string',
        tags: 'array',
        platform: 'string',
        uploadedBy: 'string',
        createdAt: 'date',
        metadata: 'object'
      }
    },
    lms_courses: {
      required: ['title', 'platform'],
      types: {
        title: 'string',
        description: 'string',
        instructor: 'string',
        instructorId: 'string',
        duration: 'number',
        level: 'string',
        price: 'number',
        status: 'string',
        platform: 'string',
        thumbnail: 'string',
        syllabus: 'array',
        prerequisites: 'array',
        learningObjectives: 'array',
        createdAt: 'date',
        updatedAt: 'date'
      }
    },
    lms_lessons: {
      required: ['courseId', 'title', 'type'],
      types: {
        courseId: 'string',
        title: 'string',
        description: 'string',
        type: 'string',
        content: 'string',
        videoUrl: 'string',
        duration: 'number',
        order: 'number',
        published: 'boolean',
        createdAt: 'date'
      }
    },
    lms_assignments: {
      required: ['courseId', 'title', 'dueDate'],
      types: {
        courseId: 'string',
        lessonId: 'string',
        title: 'string',
        description: 'string',
        instructions: 'string',
        dueDate: 'date',
        maxPoints: 'number',
        type: 'string',
        attachments: 'array',
        createdAt: 'date'
      }
    },
    lms_submissions: {
      required: ['assignmentId', 'studentId'],
      types: {
        assignmentId: 'string',
        studentId: 'string',
        content: 'string',
        attachments: 'array',
        submittedAt: 'date',
        grade: 'number',
        feedback: 'string',
        gradedAt: 'date',
        gradedBy: 'string',
        status: 'string'
      }
    },
    lms_enrollments: {
      required: ['courseId', 'studentId'],
      types: {
        courseId: 'string',
        studentId: 'string',
        enrolledAt: 'date',
        status: 'string',
        progress: 'number',
        completedAt: 'date',
        certificateUrl: 'string'
      }
    },
    lms_progress: {
      required: ['courseId', 'studentId', 'lessonId'],
      types: {
        courseId: 'string',
        studentId: 'string',
        lessonId: 'string',
        completed: 'boolean',
        progress: 'number',
        timeSpent: 'number',
        lastAccessedAt: 'date'
      }
    },
    exams: {
      required: ['title', 'courseId', 'duration'],
      types: {
        title: 'string',
        description: 'string',
        courseId: 'string',
        duration: 'number',
        totalPoints: 'number',
        passingScore: 'number',
        type: 'string',
        instructions: 'string',
        startDate: 'date',
        endDate: 'date',
        published: 'boolean',
        createdAt: 'date'
      }
    },
    exam_questions: {
      required: ['examId', 'question', 'type'],
      types: {
        examId: 'string',
        question: 'string',
        type: 'string',
        options: 'array',
        correctAnswer: 'string',
        points: 'number',
        order: 'number',
        explanation: 'string'
      }
    },
    exam_attempts: {
      required: ['examId', 'studentId'],
      types: {
        examId: 'string',
        studentId: 'string',
        startedAt: 'date',
        submittedAt: 'date',
        timeSpent: 'number',
        score: 'number',
        percentage: 'number',
        status: 'string',
        answers: 'object'
      }
    },
    wiki_articles: {
      required: ['title', 'content', 'platform'],
      types: {
        title: 'string',
        content: 'string',
        excerpt: 'string',
        categoryId: 'string',
        platform: 'string',
        authorId: 'string',
        status: 'string',
        slug: 'string',
        tags: 'array',
        createdAt: 'date',
        updatedAt: 'date'
      }
    },
    wiki_categories: {
      required: ['name', 'platform'],
      types: {
        name: 'string',
        description: 'string',
        platform: 'string',
        parentId: 'string',
        order: 'number',
        icon: 'string'
      }
    },
    products: {
      required: ['name', 'price', 'platform'],
      types: {
        name: 'string',
        description: 'string',
        price: 'number',
        comparePrice: 'number',
        sku: 'string',
        platform: 'string',
        category: 'string',
        images: 'array',
        stock: 'number',
        status: 'string',
        featured: 'boolean',
        variants: 'array',
        createdAt: 'date'
      }
    },
    orders: {
      required: ['customerId', 'platform', 'total', 'status'],
      types: {
        customerId: 'string',
        platform: 'string',
        orderNumber: 'string',
        total: 'number',
        subtotal: 'number',
        tax: 'number',
        shipping: 'number',
        discount: 'number',
        status: 'string',
        paymentStatus: 'string',
        shippingAddress: 'object',
        billingAddress: 'object',
        items: 'array',
        createdAt: 'date'
      }
    },
    quran_bookmarks: {
      required: ['userId', 'surah', 'ayah'],
      types: {
        userId: 'string',
        surah: 'number',
        ayah: 'number',
        note: 'string',
        createdAt: 'date'
      }
    },
    audio_library: {
      required: ['title', 'speaker', 'platform'],
      types: {
        title: 'string',
        speaker: 'string',
        description: 'string',
        audioUrl: 'string',
        duration: 'string',
        category: 'string',
        language: 'string',
        platform: 'string',
        uploadDate: 'date',
        tags: 'array'
      }
    },
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
    library_books: {
      required: ['title', 'author', 'platform'],
      types: {
        title: 'string',
        author: 'string',
        description: 'string',
        platform: 'string',
        pdfUrl: 'string',
        coverImage: 'string',
        isbn: 'string',
        publisher: 'string',
        publishedDate: 'date',
        language: 'string',
        pages: 'number',
        categories: 'array',
        tags: 'array',
        downloads: 'number',
        createdAt: 'date'
      }
    },
    donations: {
      required: ['amount', 'platform', 'donor'],
      types: {
        amount: 'number',
        platform: 'string',
        campaignId: 'string',
        donor: 'string',
        donorEmail: 'string',
        currency: 'string',
        paymentMethod: 'string',
        anonymous: 'boolean',
        recurring: 'boolean',
        frequency: 'string',
        message: 'string',
        createdAt: 'date'
      }
    },
    campaigns: {
      required: ['title', 'target', 'status', 'platform'],
      types: {
        title: 'string',
        description: 'string',
        target: 'number',
        raised: 'number',
        status: 'string',
        platform: 'string',
        category: 'string',
        endDate: 'date',
        featured: 'boolean',
        images: 'array',
        createdAt: 'date'
      }
    },
    volunteers: {
      required: ['name', 'email', 'platform'],
      types: {
        name: 'string',
        email: 'string',
        phone: 'string',
        platform: 'string',
        skills: 'array',
        availability: 'string',
        experience: 'string',
        status: 'string',
        hoursLogged: 'number',
        createdAt: 'date'
      }
    },
    volunteer_opportunities: {
      required: ['title', 'platform'],
      types: {
        title: 'string',
        description: 'string',
        platform: 'string',
        requiredSkills: 'array',
        startDate: 'date',
        endDate: 'date',
        hoursRequired: 'number',
        spotsAvailable: 'number',
        status: 'string',
        createdAt: 'date'
      }
    },
    beneficiaries: {
      required: ['name', 'platform'],
      types: {
        name: 'string',
        email: 'string',
        phone: 'string',
        platform: 'string',
        address: 'string',
        needs: 'array',
        status: 'string',
        caseNotes: 'array',
        assignedTo: 'string',
        createdAt: 'date'
      }
    },
    packages: {
      required: ['title', 'price', 'type', 'platform'],
      types: {
        title: 'string',
        description: 'string',
        price: 'number',
        type: 'string',
        platform: 'string',
        duration: 'number',
        maxPeople: 'number',
        available: 'boolean',
        features: 'array',
        itinerary: 'array',
        images: 'array',
        startDate: 'date',
        endDate: 'date',
        createdAt: 'date'
      }
    },
    bookings: {
      required: ['packageId', 'customerId', 'status', 'platform'],
      types: {
        packageId: 'string',
        customerId: 'string',
        platform: 'string',
        status: 'string',
        totalAmount: 'number',
        paidAmount: 'number',
        travelers: 'array',
        specialRequests: 'string',
        bookingDate: 'date',
        travelDate: 'date',
        paymentPlan: 'array'
      }
    },
    reviews: {
      required: ['rating', 'platform'],
      types: {
        entityId: 'string',
        entityType: 'string',
        platform: 'string',
        customerId: 'string',
        customerName: 'string',
        rating: 'number',
        comment: 'string',
        verified: 'boolean',
        photos: 'array',
        helpful: 'number',
        createdAt: 'date',
        response: 'string',
        respondedAt: 'date'
      }
    },
    blog_posts: {
      required: ['title', 'content', 'platform'],
      types: {
        title: 'string',
        content: 'string',
        excerpt: 'string',
        platform: 'string',
        authorId: 'string',
        authorName: 'string',
        publishedAt: 'date',
        status: 'string',
        featured: 'boolean',
        featuredImage: 'string',
        tags: 'array',
        categories: 'array',
        views: 'number',
        createdAt: 'date',
        updatedAt: 'date'
      }
    },
    blog_comments: {
      required: ['postId', 'content'],
      types: {
        postId: 'string',
        userId: 'string',
        userName: 'string',
        userEmail: 'string',
        content: 'string',
        parentId: 'string',
        approved: 'boolean',
        createdAt: 'date'
      }
    },
    cms_pages: {
      required: ['title', 'slug', 'platform'],
      types: {
        title: 'string',
        slug: 'string',
        content: 'string',
        platform: 'string',
        template: 'string',
        sections: 'array',
        metaTitle: 'string',
        metaDescription: 'string',
        status: 'string',
        publishedAt: 'date',
        createdAt: 'date',
        updatedAt: 'date'
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
        featured: 'boolean',
        image: 'string',
        capacity: 'number',
        registered: 'number',
        price: 'number',
        createdAt: 'date'
      }
    }
  }
};

const db = new UniversalSDK(sdkConfig);

db.init().catch(console.error);

export default db;
