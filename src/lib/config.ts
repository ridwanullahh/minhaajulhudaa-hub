interface AppConfig {
  github: {
    user: string;
    repo: string;
    token: string;
    branch: string;
  };
  payment: {
    paystack: {
      publicKey: string;
      secretKey: string;
    };
    stripe: {
      publicKey: string;
      secretKey: string;
    };
    flutterwave: {
      publicKey: string;
      secretKey: string;
    };
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset: string;
  };
  email: {
    endpoint: string;
    port: string;
    username: string;
    password: string;
    from: string;
    apiKey: string;
  };
  archiveOrg: {
    apiKey: string;
    defaultReciter: string;
  };
  app: {
    url: string;
    apiUrl: string;
    env: string;
    debug: boolean;
  };
  auth: {
    jwtSecret: string;
    sessionExpiry: number;
    requireEmailVerification: boolean;
    otpExpiry: number;
  };
  platforms: {
    school: {
      name: string;
      contactEmail: string;
      phone: string;
      address: string;
    };
    masjid: {
      name: string;
      latitude: number;
      longitude: number;
      timezone: string;
    };
    charity: {
      name: string;
      registrationNumber: string;
    };
    travels: {
      name: string;
      licenseNumber: string;
    };
  };
  integrations: {
    googleMapsApiKey: string;
    googleAnalyticsId: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  features: {
    payments: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    cloudinary: boolean;
    search: boolean;
    analytics: boolean;
  };
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getEnvNum = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key];
  return value ? parseFloat(value) : defaultValue;
};

const config: AppConfig = {
  github: {
    user: getEnvVar('VITE_GITHUB_USER'),
    repo: getEnvVar('VITE_GITHUB_REPO'),
    token: getEnvVar('VITE_GITHUB_TOKEN'),
    branch: getEnvVar('VITE_GITHUB_BRANCH', 'main'),
  },
  payment: {
    paystack: {
      publicKey: getEnvVar('VITE_PAYSTACK_PUBLIC_KEY'),
      secretKey: getEnvVar('VITE_PAYSTACK_SECRET_KEY'),
    },
    stripe: {
      publicKey: getEnvVar('VITE_STRIPE_PUBLIC_KEY'),
      secretKey: getEnvVar('VITE_STRIPE_SECRET_KEY'),
    },
    flutterwave: {
      publicKey: getEnvVar('VITE_FLUTTERWAVE_PUBLIC_KEY'),
      secretKey: getEnvVar('VITE_FLUTTERWAVE_SECRET_KEY'),
    },
  },
  cloudinary: {
    cloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnvVar('VITE_CLOUDINARY_API_KEY'),
    apiSecret: getEnvVar('VITE_CLOUDINARY_API_SECRET'),
    uploadPreset: getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET'),
  },
  email: {
    endpoint: getEnvVar('VITE_SMTP_ENDPOINT'),
    port: getEnvVar('VITE_SMTP_PORT', '587'),
    username: getEnvVar('VITE_SMTP_USERNAME'),
    password: getEnvVar('VITE_SMTP_PASSWORD'),
    from: getEnvVar('VITE_SMTP_FROM'),
    apiKey: getEnvVar('VITE_EMAIL_API_KEY'),
  },
  archiveOrg: {
    apiKey: getEnvVar('VITE_ARCHIVE_ORG_API_KEY'),
    defaultReciter: getEnvVar('VITE_DEFAULT_QURAN_RECITER', 'AbdulBaset_AbdulSamad_Mujawwad_128kbps'),
  },
  app: {
    url: getEnvVar('VITE_APP_URL', 'http://localhost:3000'),
    apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
    env: getEnvVar('VITE_APP_ENV', 'development'),
    debug: getEnvBool('VITE_DEBUG', true),
  },
  auth: {
    jwtSecret: getEnvVar('VITE_JWT_SECRET', 'default-secret-change-in-production'),
    sessionExpiry: getEnvNum('VITE_SESSION_EXPIRY', 604800),
    requireEmailVerification: getEnvBool('VITE_REQUIRE_EMAIL_VERIFICATION', true),
    otpExpiry: getEnvNum('VITE_OTP_EXPIRY', 10),
  },
  platforms: {
    school: {
      name: getEnvVar('VITE_SCHOOL_NAME', 'Minhaajulhudaa Islamic School'),
      contactEmail: getEnvVar('VITE_SCHOOL_CONTACT_EMAIL', 'school@minhaajulhudaa.org'),
      phone: getEnvVar('VITE_SCHOOL_PHONE', '+234-xxx-xxx-xxxx'),
      address: getEnvVar('VITE_SCHOOL_ADDRESS', 'Address Here'),
    },
    masjid: {
      name: getEnvVar('VITE_MASJID_NAME', 'Minhaajulhudaa Masjid'),
      latitude: getEnvNum('VITE_MASJID_LATITUDE', 0),
      longitude: getEnvNum('VITE_MASJID_LONGITUDE', 0),
      timezone: getEnvVar('VITE_MASJID_TIMEZONE', 'Africa/Lagos'),
    },
    charity: {
      name: getEnvVar('VITE_CHARITY_NAME', 'Minhaajulhudaa Charity'),
      registrationNumber: getEnvVar('VITE_CHARITY_REGISTRATION_NUMBER', 'RC-xxxxx'),
    },
    travels: {
      name: getEnvVar('VITE_TRAVELS_NAME', 'Minhaajulhudaa Travels'),
      licenseNumber: getEnvVar('VITE_TRAVELS_LICENSE_NUMBER', 'TL-xxxxx'),
    },
  },
  integrations: {
    googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
    googleAnalyticsId: getEnvVar('VITE_GOOGLE_ANALYTICS_ID'),
  },
  social: {
    facebook: getEnvVar('VITE_FACEBOOK_URL', 'https://facebook.com/minhaajulhudaa'),
    twitter: getEnvVar('VITE_TWITTER_URL', 'https://twitter.com/minhaajulhudaa'),
    instagram: getEnvVar('VITE_INSTAGRAM_URL', 'https://instagram.com/minhaajulhudaa'),
    youtube: getEnvVar('VITE_YOUTUBE_URL', 'https://youtube.com/@minhaajulhudaa'),
  },
  features: {
    payments: getEnvBool('VITE_ENABLE_PAYMENTS', true),
    emailNotifications: getEnvBool('VITE_ENABLE_EMAIL_NOTIFICATIONS', true),
    smsNotifications: getEnvBool('VITE_ENABLE_SMS_NOTIFICATIONS', false),
    cloudinary: getEnvBool('VITE_ENABLE_CLOUDINARY', true),
    search: getEnvBool('VITE_ENABLE_SEARCH', true),
    analytics: getEnvBool('VITE_ENABLE_ANALYTICS', true),
  },
};

export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.github.user) errors.push('VITE_GITHUB_USER is required');
  if (!config.github.repo) errors.push('VITE_GITHUB_REPO is required');
  if (!config.github.token) errors.push('VITE_GITHUB_TOKEN is required');
  
  if (config.features.payments) {
    if (!config.payment.paystack.publicKey && !config.payment.stripe.publicKey && !config.payment.flutterwave.publicKey) {
      errors.push('At least one payment gateway must be configured when payments are enabled');
    }
  }
  
  if (config.features.cloudinary) {
    if (!config.cloudinary.cloudName) errors.push('VITE_CLOUDINARY_CLOUD_NAME is required when Cloudinary is enabled');
    if (!config.cloudinary.uploadPreset) errors.push('VITE_CLOUDINARY_UPLOAD_PRESET is required when Cloudinary is enabled');
  }
  
  if (config.features.emailNotifications) {
    if (!config.email.endpoint && !config.email.apiKey) {
      errors.push('Email configuration is required when email notifications are enabled');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

if (config.app.debug && config.app.env === 'development') {
  const validation = validateConfig();
  if (!validation.valid) {
    console.warn('⚠️ Configuration warnings:');
    validation.errors.forEach(error => console.warn(`  - ${error}`));
  } else {
    console.log('✅ Configuration validated successfully');
  }
}

export default config;
export type { AppConfig };
