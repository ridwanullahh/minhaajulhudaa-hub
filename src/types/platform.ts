
export type PlatformType = 'school' | 'masjid' | 'charity' | 'travels';

export interface PlatformConfig {
  name: string;
  slug: string;
  title: string;
  description: string;
  features: string[];
  publicRoutes: string[];
  adminRoutes: string[];
}

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  school: {
    name: 'Minhaajulhudaa Islamic School',
    slug: 'school',
    title: 'Excellence in Islamic Education',
    description: 'Nurturing minds and souls with comprehensive Islamic education',
    features: ['LMS', 'Admissions', 'Student Portal', 'E-Library', 'Online Shop'],
    publicRoutes: ['/', '/about', '/programs', '/admissions', '/classes', '/events', '/blog', '/gallery', '/contact'],
    adminRoutes: ['/admin', '/admin/students', '/admin/staff', '/admin/courses', '/admin/blog', '/admin/shop']
  },
  masjid: {
    name: 'Minhaajulhudaa Masjid',
    slug: 'masjid',
    title: 'Your Spiritual Home',
    description: 'Building community through worship, knowledge, and service',
    features: ['Prayer Times', 'Audio Library', 'Quran Player', 'Events', 'Donations'],
    publicRoutes: ['/', '/about', '/activities', '/library', '/events', '/blog', '/donate', '/contact'],
    adminRoutes: ['/admin', '/admin/prayers', '/admin/events', '/admin/library', '/admin/donations', '/admin/blog']
  },
  charity: {
    name: 'Minhaajulhudaa Charity Foundation',
    slug: 'charity',
    title: 'Compassion in Action',
    description: 'Making a difference through charitable works and community support',
    features: ['Campaigns', 'Donations', 'Volunteer Management', 'Impact Tracking', 'Success Stories'],
    publicRoutes: ['/', '/about', '/projects', '/how-to-help', '/blog', '/testimonials', '/contact'],
    adminRoutes: ['/admin', '/admin/campaigns', '/admin/donations', '/admin/volunteers', '/admin/reports', '/admin/blog']
  },
  travels: {
    name: 'Minhaajulhudaa Travels & Tours',
    slug: 'travels',
    title: 'Sacred Journeys Await',
    description: 'Your trusted partner for Hajj, Umrah, and Islamic heritage tours',
    features: ['Hajj Packages', 'Umrah Services', 'Tours', 'Booking System', 'Travel Resources'],
    publicRoutes: ['/', '/about', '/hajj-umrah', '/tours', '/booking', '/reviews', '/resources', '/blog', '/contact'],
    adminRoutes: ['/admin', '/admin/packages', '/admin/bookings', '/admin/customers', '/admin/payments', '/admin/blog']
  }
};
