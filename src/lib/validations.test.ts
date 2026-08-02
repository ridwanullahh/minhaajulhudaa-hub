import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  studentSchema,
  courseSchema,
  campaignSchema,
  donationSchema,
  packageSchema,
  bookingSchema,
  blogPostSchema,
  prayerTimeSchema,
} from '@/lib/validations';

/**
 * Validation schema tests
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Tests all zod validation schemas to ensure they correctly accept valid
 * input and reject invalid input with appropriate error messages.
 */

describe('loginSchema', () => {
  it('accepts valid login input', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      platform: 'school',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
      platform: 'school',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
      platform: 'school',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing platform', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'securepass123',
      name: 'New User',
      platform: 'school',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: '123',
      name: 'New User',
      platform: 'school',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name shorter than 2 chars', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'securepass123',
      name: 'A',
      platform: 'school',
    });
    expect(result.success).toBe(false);
  });

  it('defaults role to user', () => {
    const result = registerSchema.safeParse({
      email: 'new@example.com',
      password: 'securepass123',
      name: 'New User',
      platform: 'school',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('user');
    }
  });
});

describe('studentSchema', () => {
  it('accepts valid student', () => {
    const result = studentSchema.safeParse({
      name: 'Abdullah Student',
      email: 'student@example.com',
      status: 'active',
    });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 chars', () => {
    const result = studentSchema.safeParse({
      name: 'A',
      status: 'active',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = studentSchema.safeParse({
      name: 'Student Name',
      status: 'invalid_status',
    });
    expect(result.success).toBe(false);
  });
});

describe('courseSchema', () => {
  it('accepts valid course', () => {
    const result = courseSchema.safeParse({
      title: 'Introduction to Tajweed',
      price: 50000,
      level: 'beginner',
    });
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 3 chars', () => {
    const result = courseSchema.safeParse({
      title: 'AB',
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = courseSchema.safeParse({
      title: 'Valid Title',
      price: -100,
    });
    expect(result.success).toBe(false);
  });
});

describe('campaignSchema', () => {
  it('accepts valid campaign', () => {
    const result = campaignSchema.safeParse({
      title: 'Build a Well',
      target: 5000000,
      raised: 0,
      status: 'active',
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative target', () => {
    const result = campaignSchema.safeParse({
      title: 'Build a Well',
      target: -1000,
    });
    expect(result.success).toBe(false);
  });

  it('rejects title shorter than 3 chars', () => {
    const result = campaignSchema.safeParse({
      title: 'AB',
      target: 1000,
    });
    expect(result.success).toBe(false);
  });
});

describe('donationSchema', () => {
  it('accepts valid donation', () => {
    const result = donationSchema.safeParse({
      amount: 50000,
      donor: 'Abdullah',
      currency: 'NGN',
    });
    expect(result.success).toBe(true);
  });

  it('rejects amount less than 1', () => {
    const result = donationSchema.safeParse({
      amount: 0,
      donor: 'Abdullah',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty donor name', () => {
    const result = donationSchema.safeParse({
      amount: 1000,
      donor: '',
    });
    expect(result.success).toBe(false);
  });

  it('defaults to one_time frequency', () => {
    const result = donationSchema.safeParse({
      amount: 1000,
      donor: 'Abdullah',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.frequency).toBe('one_time');
    }
  });
});

describe('packageSchema', () => {
  it('accepts valid package', () => {
    const result = packageSchema.safeParse({
      title: 'Hajj 1447 AH Package',
      price: 4500000,
      type: 'hajj',
      duration: 35,
    });
    expect(result.success).toBe(true);
  });

  it('rejects duration less than 1', () => {
    const result = packageSchema.safeParse({
      title: 'Valid Title',
      price: 1000,
      type: 'umrah',
      duration: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid type', () => {
    const result = packageSchema.safeParse({
      title: 'Valid Title',
      price: 1000,
      type: 'invalid',
      duration: 7,
    });
    expect(result.success).toBe(false);
  });
});

describe('bookingSchema', () => {
  it('accepts valid booking with travelers', () => {
    const result = bookingSchema.safeParse({
      packageId: 'pkg-1',
      customerId: 'cust-1',
      totalAmount: 4500000,
      travelers: [{ name: 'Ibrahim Traveler' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects booking without travelers', () => {
    const result = bookingSchema.safeParse({
      packageId: 'pkg-1',
      customerId: 'cust-1',
      totalAmount: 4500000,
      travelers: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('blogPostSchema', () => {
  it('accepts valid blog post', () => {
    const result = blogPostSchema.safeParse({
      title: 'Welcome to Minhaajulhudaa',
      content: 'This is the content of the blog post, long enough to pass validation.',
      status: 'published',
    });
    expect(result.success).toBe(true);
  });

  it('rejects content shorter than 10 chars', () => {
    const result = blogPostSchema.safeParse({
      title: 'Valid Title',
      content: 'short',
    });
    expect(result.success).toBe(false);
  });
});

describe('prayerTimeSchema', () => {
  it('accepts valid prayer times', () => {
    const result = prayerTimeSchema.safeParse({
      date: '2026-08-02',
      fajr: '05:15',
      dhuhr: '12:45',
      asr: '16:00',
      maghrib: '18:55',
      isha: '20:00',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required prayer time', () => {
    const result = prayerTimeSchema.safeParse({
      date: '2026-08-02',
      fajr: '05:15',
      dhuhr: '12:45',
      asr: '16:00',
      maghrib: '18:55',
      // isha missing
    });
    expect(result.success).toBe(false);
  });
});
