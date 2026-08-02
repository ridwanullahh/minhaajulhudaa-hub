import { z } from 'zod';

/**
 * Zod validation schemas for all forms
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Centralized validation schemas used by react-hook-form + zodResolver
 * across all forms in the app. Each schema enforces production-grade
 * input validation: correct types, required fields, length limits,
 * and format constraints.
 */

// ---------------------------------------------------------------------------
// Auth forms
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  platform: z.string().min(1, 'Platform is required'),
});

export const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  platform: z.string().min(1, 'Platform is required'),
  role: z.string().optional().default('user'),
});

// ---------------------------------------------------------------------------
// School forms
// ---------------------------------------------------------------------------

export const studentSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  classId: z.string().optional().or(z.literal('')),
  rollNumber: z.string().max(50).optional().or(z.literal('')),
  guardianName: z.string().max(100).optional().or(z.literal('')),
  guardianPhone: z.string().max(20).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'graduated']).default('active'),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  instructor: z.string().max(100).optional().or(z.literal('')),
  duration: z.number().int().min(0).max(10000).optional().or(z.literal(0)),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  price: z.number().min(0).max(10000000).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const staffSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required').max(50),
  department: z.string().max(100).optional().or(z.literal('')),
  qualification: z.string().max(200).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
});

// ---------------------------------------------------------------------------
// Charity forms
// ---------------------------------------------------------------------------

export const campaignSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(5000).optional().or(z.literal('')),
  target: z.number().min(0, 'Target must be positive').max(1000000000),
  raised: z.number().min(0).max(1000000000).default(0),
  status: z.enum(['active', 'paused', 'completed', 'cancelled']).default('active'),
  category: z.string().max(50).optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

export const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1').max(1000000000),
  donor: z.string().min(1, 'Donor name is required').max(100),
  donorEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  currency: z.string().min(3).max(3).default('NGN'),
  paymentMethod: z.string().max(50).optional().or(z.literal('')),
  anonymous: z.boolean().default(false),
  recurring: z.boolean().default(false),
  frequency: z.enum(['one_time', 'weekly', 'monthly', 'yearly']).default('one_time'),
  message: z.string().max(500).optional().or(z.literal('')),
  campaignId: z.string().optional().or(z.literal('')),
});

export const volunteerSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().max(20).optional().or(z.literal('')),
  skills: z.array(z.string()).optional().default([]),
  availability: z.string().max(100).optional().or(z.literal('')),
  experience: z.string().max(1000).optional().or(z.literal('')),
  status: z.enum(['pending', 'active', 'inactive']).default('pending'),
});

// ---------------------------------------------------------------------------
// Travels forms
// ---------------------------------------------------------------------------

export const packageSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(5000).optional().or(z.literal('')),
  price: z.number().min(0, 'Price must be positive').max(1000000000),
  type: z.enum(['hajj', 'umrah', 'tour', 'other']),
  duration: z.number().int().min(1, 'Duration must be at least 1 day').max(365),
  maxPeople: z.number().int().min(1).max(1000).default(50),
  available: z.boolean().default(true),
  features: z.array(z.string()).optional().default([]),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
});

export const bookingSchema = z.object({
  packageId: z.string().min(1, 'Package is required'),
  customerId: z.string().min(1, 'Customer is required'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending'),
  totalAmount: z.number().min(0).max(1000000000),
  paidAmount: z.number().min(0).max(1000000000).default(0),
  travelers: z.array(z.object({
    name: z.string().min(1, 'Traveler name is required'),
    passport: z.string().optional().or(z.literal('')),
  })).min(1, 'At least one traveler is required'),
  specialRequests: z.string().max(1000).optional().or(z.literal('')),
  travelDate: z.string().optional().or(z.literal('')),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().max(20).optional().or(z.literal('')),
  passportNumber: z.string().max(50).optional().or(z.literal('')),
  nationality: z.string().max(50).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
});

// ---------------------------------------------------------------------------
// Masjid forms
// ---------------------------------------------------------------------------

export const prayerTimeSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  fajr: z.string().min(1, 'Fajr time is required'),
  dhuhr: z.string().min(1, 'Dhuhr time is required'),
  asr: z.string().min(1, 'Asr time is required'),
  maghrib: z.string().min(1, 'Maghrib time is required'),
  isha: z.string().min(1, 'Isha time is required'),
  fajrIqamah: z.string().optional().or(z.literal('')),
  dhuhrIqamah: z.string().optional().or(z.literal('')),
  asrIqamah: z.string().optional().or(z.literal('')),
  maghribIqamah: z.string().optional().or(z.literal('')),
  ishaIqamah: z.string().optional().or(z.literal('')),
  jumah: z.string().optional().or(z.literal('')),
});

export const audioTrackSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  speaker: z.string().min(1, 'Speaker is required').max(100),
  description: z.string().max(2000).optional().or(z.literal('')),
  audioUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  duration: z.string().max(20).optional().or(z.literal('')),
  category: z.string().max(50).optional().or(z.literal('')),
  language: z.string().max(20).optional().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
});

// ---------------------------------------------------------------------------
// Blog / CMS forms
// ---------------------------------------------------------------------------

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  content: z.string().min(10, 'Content is too short').max(50000),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).optional().default([]),
  categories: z.array(z.string()).optional().default([]),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(5000).optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  category: z.string().max(50).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  capacity: z.number().int().min(0).optional().or(z.literal(0)),
  price: z.number().min(0).max(1000000).optional().or(z.literal(0)),
});

// ---------------------------------------------------------------------------
// Type exports (inferred from schemas)
// ---------------------------------------------------------------------------

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type PrayerTimeInput = z.infer<typeof prayerTimeSchema>;
export type AudioTrackInput = z.infer<typeof audioTrackSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type EventInput = z.infer<typeof eventSchema>;

export default {
  loginSchema,
  registerSchema,
  studentSchema,
  courseSchema,
  staffSchema,
  campaignSchema,
  donationSchema,
  volunteerSchema,
  packageSchema,
  bookingSchema,
  customerSchema,
  prayerTimeSchema,
  audioTrackSchema,
  blogPostSchema,
  eventSchema,
};
