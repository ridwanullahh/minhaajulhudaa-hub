interface AppConfig {
  db: {
    provider: 'api' | 'lightbase' | 'github';
  };
  lightbase: {
    baseUrl: string;
    apiKey: string;
    projectId: string;
    tenant: string;
  };
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

// NOTE: We intentionally do NOT use `import.meta.env[key]` with a
// dynamic key here. Vite replaces dynamic `import.meta.env[...]`
// accesses by inlining the ENTIRE env object into the client bundle,
// which would leak secrets like VITE_LIGHTBASE_API_KEY even when
// provider=api. Instead we use direct property access so Vite only
// inlines the specific vars that are actually referenced. The
// Lightbase vars are only referenced inside the
// `if (config.db.provider === 'lightbase')` block, which Vite's
// dead-code elimination can drop when provider=api at build time.
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // Use a switch so Vite sees static `import.meta.env.VITE_X` accesses
  // and can tree-shake unused ones.
  switch (key) {
    case 'VITE_DB_PROVIDER': return import.meta.env.VITE_DB_PROVIDER || defaultValue;
    case 'VITE_API_URL': return import.meta.env.VITE_API_URL || defaultValue;
    case 'VITE_APP_URL': return import.meta.env.VITE_APP_URL || defaultValue;
    case 'VITE_APP_ENV': return import.meta.env.VITE_APP_ENV || defaultValue;
    case 'VITE_DEBUG': return import.meta.env.VITE_DEBUG || defaultValue;
    case 'VITE_GITHUB_USER': return import.meta.env.VITE_GITHUB_USER || defaultValue;
    case 'VITE_GITHUB_REPO': return import.meta.env.VITE_GITHUB_REPO || defaultValue;
    case 'VITE_GITHUB_TOKEN': return import.meta.env.VITE_GITHUB_TOKEN || defaultValue;
    case 'VITE_GITHUB_BRANCH': return import.meta.env.VITE_GITHUB_BRANCH || defaultValue;
    case 'VITE_JWT_SECRET': return import.meta.env.VITE_JWT_SECRET || defaultValue;
    case 'VITE_SESSION_EXPIRY': return import.meta.env.VITE_SESSION_EXPIRY || defaultValue;
    case 'VITE_REQUIRE_EMAIL_VERIFICATION': return import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION || defaultValue;
    case 'VITE_OTP_EXPIRY': return import.meta.env.VITE_OTP_EXPIRY || defaultValue;
    case 'VITE_PAYSTACK_PUBLIC_KEY': return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || defaultValue;
    case 'VITE_PAYSTACK_SECRET_KEY': return import.meta.env.VITE_PAYSTACK_SECRET_KEY || defaultValue;
    case 'VITE_STRIPE_PUBLIC_KEY': return import.meta.env.VITE_STRIPE_PUBLIC_KEY || defaultValue;
    case 'VITE_STRIPE_SECRET_KEY': return import.meta.env.VITE_STRIPE_SECRET_KEY || defaultValue;
    case 'VITE_FLUTTERWAVE_PUBLIC_KEY': return import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || defaultValue;
    case 'VITE_FLUTTERWAVE_SECRET_KEY': return import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY || defaultValue;
    case 'VITE_CLOUDINARY_CLOUD_NAME': return import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || defaultValue;
    case 'VITE_CLOUDINARY_API_KEY': return import.meta.env.VITE_CLOUDINARY_API_KEY || defaultValue;
    case 'VITE_CLOUDINARY_API_SECRET': return import.meta.env.VITE_CLOUDINARY_API_SECRET || defaultValue;
    case 'VITE_CLOUDINARY_UPLOAD_PRESET': return import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || defaultValue;
    case 'VITE_SMTP_ENDPOINT': return import.meta.env.VITE_SMTP_ENDPOINT || defaultValue;
    case 'VITE_SMTP_PORT': return import.meta.env.VITE_SMTP_PORT || defaultValue;
    case 'VITE_SMTP_USERNAME': return import.meta.env.VITE_SMTP_USERNAME || defaultValue;
    case 'VITE_SMTP_PASSWORD': return import.meta.env.VITE_SMTP_PASSWORD || defaultValue;
    case 'VITE_SMTP_FROM': return import.meta.env.VITE_SMTP_FROM || defaultValue;
    case 'VITE_EMAIL_API_KEY': return import.meta.env.VITE_EMAIL_API_KEY || defaultValue;
    case 'VITE_ARCHIVE_ORG_API_KEY': return import.meta.env.VITE_ARCHIVE_ORG_API_KEY || defaultValue;
    case 'VITE_DEFAULT_QURAN_RECITER': return import.meta.env.VITE_DEFAULT_QURAN_RECITER || defaultValue;
    case 'VITE_SCHOOL_NAME': return import.meta.env.VITE_SCHOOL_NAME || defaultValue;
    case 'VITE_SCHOOL_CONTACT_EMAIL': return import.meta.env.VITE_SCHOOL_CONTACT_EMAIL || defaultValue;
    case 'VITE_SCHOOL_PHONE': return import.meta.env.VITE_SCHOOL_PHONE || defaultValue;
    case 'VITE_SCHOOL_ADDRESS': return import.meta.env.VITE_SCHOOL_ADDRESS || defaultValue;
    case 'VITE_MASJID_NAME': return import.meta.env.VITE_MASJID_NAME || defaultValue;
    case 'VITE_MASJID_TIMEZONE': return import.meta.env.VITE_MASJID_TIMEZONE || defaultValue;
    case 'VITE_CHARITY_NAME': return import.meta.env.VITE_CHARITY_NAME || defaultValue;
    case 'VITE_CHARITY_REGISTRATION_NUMBER': return import.meta.env.VITE_CHARITY_REGISTRATION_NUMBER || defaultValue;
    case 'VITE_TRAVELS_NAME': return import.meta.env.VITE_TRAVELS_NAME || defaultValue;
    case 'VITE_TRAVELS_LICENSE_NUMBER': return import.meta.env.VITE_TRAVELS_LICENSE_NUMBER || defaultValue;
    case 'VITE_GOOGLE_MAPS_API_KEY': return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || defaultValue;
    case 'VITE_GOOGLE_ANALYTICS_ID': return import.meta.env.VITE_GOOGLE_ANALYTICS_ID || defaultValue;
    case 'VITE_FACEBOOK_URL': return import.meta.env.VITE_FACEBOOK_URL || defaultValue;
    case 'VITE_TWITTER_URL': return import.meta.env.VITE_TWITTER_URL || defaultValue;
    case 'VITE_INSTAGRAM_URL': return import.meta.env.VITE_INSTAGRAM_URL || defaultValue;
    case 'VITE_YOUTUBE_URL': return import.meta.env.VITE_YOUTUBE_URL || defaultValue;
    case 'VITE_ADMIN_USERS_SCHOOL': return import.meta.env.VITE_ADMIN_USERS_SCHOOL || defaultValue;
    case 'VITE_ADMIN_USERS_MASJID': return import.meta.env.VITE_ADMIN_USERS_MASJID || defaultValue;
    case 'VITE_ADMIN_USERS_CHARITY': return import.meta.env.VITE_ADMIN_USERS_CHARITY || defaultValue;
    case 'VITE_ADMIN_USERS_TRAVELS': return import.meta.env.VITE_ADMIN_USERS_TRAVELS || defaultValue;
    // VITE_LIGHTBASE_* are intentionally NOT in this switch. They are
    // accessed directly (statically) only inside the
    // `if (provider === 'lightbase')` block, so Vite drops them when
    // provider=api.
    default: return defaultValue;
  }
};

const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === '1';
};

const getEnvNum = (key: string, defaultValue: number = 0): number => {
  const value = getEnvVar(key);
  return value ? parseFloat(value) : defaultValue;
};

const config: AppConfig = {
  db: {
    // Direct static access so Vite's `define` (in vite.config.ts)
    // replaces `import.meta.env.VITE_DB_PROVIDER` with the literal
    // string at build time. This enables dead-code elimination of the
    // `if (provider === 'lightbase')` branch when provider=api, which
    // prevents the Lightbase API key from leaking into the client
    // bundle.
    provider: (import.meta.env.VITE_DB_PROVIDER || 'api') as 'api' | 'lightbase' | 'github',
  },
  // Lightbase config is only read when provider=lightbase. When
  // provider=api (the production default), these env vars are NEVER
  // accessed and therefore NEVER inlined into the client bundle, so
  // the Lightbase API key stays server-side only.
  lightbase: {
    baseUrl: '',
    apiKey: '',
    projectId: '',
    tenant: 'default',
  },
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

// Only populate Lightbase config when provider=lightbase. This gate
// ensures Vite never sees `import.meta.env.VITE_LIGHTBASE_*` accesses
// when provider=api (the production default), so the API key is never
// inlined into the client bundle.
if (config.db.provider === 'lightbase') {
  config.lightbase.baseUrl = import.meta.env.VITE_LIGHTBASE_BASE_URL || '';
  config.lightbase.apiKey = import.meta.env.VITE_LIGHTBASE_API_KEY || '';
  config.lightbase.projectId = import.meta.env.VITE_LIGHTBASE_PROJECT_ID || '';
  config.lightbase.tenant = import.meta.env.VITE_LIGHTBASE_TENANT || 'default';
}

export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (config.db.provider === 'api') {
    if (!config.app.apiUrl) errors.push('VITE_API_URL is required when DB_PROVIDER=api (points to the Astro backend, e.g. http://localhost:4321/api)');
  } else if (config.db.provider === 'lightbase') {
    if (!config.lightbase.baseUrl) errors.push('VITE_LIGHTBASE_BASE_URL is required when DB_PROVIDER=lightbase');
    if (!config.lightbase.apiKey) errors.push('VITE_LIGHTBASE_API_KEY is required when DB_PROVIDER=lightbase');
    if (!config.lightbase.projectId) errors.push('VITE_LIGHTBASE_PROJECT_ID is required when DB_PROVIDER=lightbase');
  } else {
    if (!config.github.user) errors.push('VITE_GITHUB_USER is required when DB_PROVIDER=github');
    if (!config.github.repo) errors.push('VITE_GITHUB_REPO is required when DB_PROVIDER=github');
    if (!config.github.token) errors.push('VITE_GITHUB_TOKEN is required when DB_PROVIDER=github');
  }
  
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
    console.warn('Configuration warnings:');
    validation.errors.forEach(error => console.warn(`  - ${error}`));
  } else {
    console.log('Configuration validated successfully');
  }
}

export default config;
export type { AppConfig };
