#!/usr/bin/env node
/**
 * Lightbase Seed Script
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Creates all platform collections in Lightbase and seeds them with
 * production-ready data for full end-to-end testing.
 *
 * Run with:
 *   node /home/z/my-project/scripts/seed-lightbase.mjs
 *
 * Env (read from .env or process.env):
 *   VITE_LIGHTBASE_BASE_URL
 *   VITE_LIGHTBASE_API_KEY
 *   VITE_LIGHTBASE_PROJECT_ID
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

// --- Load .env manually (no dependency on dotenv) ---------------------------
const envPath = resolve(repoRoot, '.env');
if (existsSync(envPath)) {
  const envText = readFileSync(envPath, 'utf8');
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

const BASE_URL = (process.env.VITE_LIGHTBASE_BASE_URL || '').replace(/\/+$/, '');
const API_KEY = process.env.VITE_LIGHTBASE_API_KEY || '';
const PROJECT_ID = process.env.VITE_LIGHTBASE_PROJECT_ID || '';

if (!BASE_URL || !API_KEY || !PROJECT_ID) {
  console.error('Missing Lightbase env vars. Set VITE_LIGHTBASE_BASE_URL, VITE_LIGHTBASE_API_KEY, VITE_LIGHTBASE_PROJECT_ID in .env');
  process.exit(1);
}

const HEADERS = {
  apikey: API_KEY,
  'x-lightbase-project': PROJECT_ID,
  'Content-Type': 'application/json',
};

const API = `${BASE_URL}/api/v1/projects/${PROJECT_ID}`;

// --- Helpers ---------------------------------------------------------------

async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...HEADERS, ...(options.headers || {}) },
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* keep text */ }
  return { ok: res.ok, status: res.status, json, text };
}

async function ensureCollection(name, fields) {
  // Check existence
  const check = await apiFetch(`/collections/${encodeURIComponent(name)}`);
  if (check.ok) {
    return { name, created: false };
  }
  if (check.status !== 404) {
    console.warn(`  ! ensureCollection(${name}) check failed: ${check.status} ${check.text}`);
  }
  // Create
  const body = { name, fields };
  const create = await apiFetch('/collections', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (create.ok || create.status === 409) {
    return { name, created: true };
  }
  console.error(`  ! Failed to create collection ${name}: ${create.status} ${create.text}`);
  return { name, created: false };
}

async function insertDoc(collection, doc) {
  const res = await apiFetch(`/collections/${encodeURIComponent(collection)}`, {
    method: 'POST',
    body: JSON.stringify(doc),
  });
  if (!res.ok) {
    // If duplicate, ignore
    if (res.status === 409 || (res.text && res.text.includes('duplicate'))) {
      return null;
    }
    console.warn(`  ! insert(${collection}) failed: ${res.status} ${res.text}`);
    return null;
  }
  return res.json?.document || res.json;
}

async function seedCollection(name, docs, dedupOn) {
  if (!docs || docs.length === 0) return { inserted: 0, skipped: 0 };
  // Use the bulk seed endpoint for efficiency
  const body = { collection: name, documents: docs };
  if (dedupOn) body.dedupOn = dedupOn;
  const res = await apiFetch('/seed', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (res.ok) {
    const data = res.json || {};
    return { inserted: data.inserted || 0, skipped: data.skipped || 0, errors: data.errors || [] };
  }
  // Fallback: insert one-by-one
  let inserted = 0;
  for (const doc of docs) {
    const r = await insertDoc(name, doc);
    if (r) inserted++;
  }
  return { inserted, skipped: docs.length - inserted };
}

// --- Schema (Lightbase field type mapping) ---------------------------------

function f(name, type, opts = {}) {
  return { name, type, ...opts };
}

const indexedString = (name) => f(name, 'string', { indexed: true });

const collectionSchemas = {
  // Global
  users: [
    indexedString('email'),
    f('name', 'string'),
    indexedString('platform'),
    f('role', 'string'),
    f('roles', 'json'),
    f('permissions', 'json'),
    f('password', 'string'),
    f('verified', 'boolean'),
    f('createdAt', 'datetime'),
  ],
  otps: [
    indexedString('email'),
    f('otp', 'string'),
    f('reason', 'string'),
    f('expiresAt', 'integer'),
    f('createdAt', 'datetime'),
  ],
  transactions: [
    indexedString('reference'),
    f('provider', 'string'),
    f('amount', 'number'),
    f('currency', 'string'),
    f('status', 'string'),
    indexedString('platform'),
    f('email', 'string'),
    f('userId', 'string'),
    f('transactionId', 'string'),
    f('metadata', 'json'),
    f('createdAt', 'datetime'),
    f('paidAt', 'datetime'),
  ],
  media: [
    f('publicId', 'string'),
    f('url', 'string'),
    f('secureUrl', 'string'),
    f('resourceType', 'string'),
    f('format', 'string'),
    f('platform', 'string'),
    f('width', 'integer'),
    f('height', 'integer'),
    f('size', 'integer'),
    f('tags', 'json'),
    f('uploadedBy', 'string'),
    f('createdAt', 'datetime'),
  ],
  email_logs: [
    f('to', 'string'),
    f('subject', 'string'),
    f('body', 'text'),
    f('template', 'string'),
    f('status', 'string'),
    f('platform', 'string'),
    f('createdAt', 'datetime'),
  ],
};

// Platform-scoped collection schemas - we create one Lightbase collection
// per (platform, collection) pair using the `${platform}_${collection}`
// naming convention.
const platformCollections = {
  school: {
    settings: [indexedString('platform'), f('phone', 'string'), f('email', 'string'), f('address', 'string'), f('socials', 'json')],
    blog_posts: [f('title', 'string'), f('content', 'text'), f('excerpt', 'text'), f('platform', 'string'), f('authorName', 'string'), f('status', 'string'), f('publishedAt', 'datetime'), f('featured', 'boolean'), f('tags', 'json'), f('categories', 'json'), f('views', 'integer')],
    events: [f('title', 'string'), f('description', 'text'), f('date', 'datetime'), f('platform', 'string'), f('location', 'string'), f('category', 'string'), f('featured', 'boolean'), f('capacity', 'integer'), f('registered', 'integer')],
    announcements: [f('title', 'string'), f('content', 'text'), f('platform', 'string'), f('category', 'string'), f('priority', 'string'), f('publishedAt', 'datetime'), f('status', 'string')],
    students: [f('name', 'string'), f('email', 'string'), f('phone', 'string'), f('platform', 'string'), f('classId', 'string'), f('rollNumber', 'string'), f('guardianName', 'string'), f('guardianPhone', 'string'), f('status', 'string'), f('enrolledAt', 'datetime')],
    staff: [f('name', 'string'), f('email', 'string'), f('phone', 'string'), f('platform', 'string'), f('role', 'string'), f('department', 'string'), f('qualification', 'string'), f('status', 'string'), f('joinedAt', 'datetime')],
    classes: [f('name', 'string'), f('platform', 'string'), f('teacherId', 'string'), f('teacherName', 'string'), f('capacity', 'integer'), f('enrolled', 'integer'), f('schedule', 'string'), f('room', 'string'), f('status', 'string')],
    programs: [f('title', 'string'), f('description', 'text'), f('platform', 'string'), f('category', 'string'), f('duration', 'string'), f('fee', 'number'), f('startDate', 'datetime'), f('endDate', 'datetime'), f('instructor', 'string'), f('status', 'string')],
    admissions: [f('studentName', 'string'), f('platform', 'string'), f('programId', 'string'), f('programTitle', 'string'), f('parentName', 'string'), f('parentEmail', 'string'), f('parentPhone', 'string'), f('status', 'string'), f('appliedAt', 'datetime')],
    courses: [f('title', 'string'), f('description', 'text'), f('platform', 'string'), f('instructor', 'string'), f('duration', 'integer'), f('level', 'string'), f('price', 'number'), f('status', 'string'), f('thumbnail', 'string')],
    library: [f('title', 'string'), f('author', 'string'), f('platform', 'string'), f('description', 'text'), f('pdfUrl', 'string'), f('coverImage', 'string'), f('pages', 'integer'), f('downloads', 'integer')],
    shop_products: [f('name', 'string'), f('price', 'number'), f('platform', 'string'), f('description', 'text'), f('category', 'string'), f('stock', 'integer'), f('sku', 'string'), f('status', 'string'), f('featured', 'boolean')],
    shop_orders: [f('customerId', 'string'), f('platform', 'string'), f('orderNumber', 'string'), f('total', 'number'), f('items', 'json'), f('status', 'string'), f('paymentStatus', 'string'), f('createdAt', 'datetime')],
    payments: [f('reference', 'string'), f('platform', 'string'), f('amount', 'number'), f('currency', 'string'), f('payer', 'string'), f('payerEmail', 'string'), f('purpose', 'string'), f('status', 'string'), f('method', 'string'), f('paidAt', 'datetime')],
    lms_courses: [f('title', 'string'), f('description', 'text'), f('platform', 'string'), f('instructor', 'string'), f('duration', 'integer'), f('level', 'string'), f('price', 'number'), f('status', 'string'), f('thumbnail', 'string'), f('syllabus', 'json')],
    lms_lessons: [f('courseId', 'string'), f('title', 'string'), f('description', 'text'), f('type', 'string'), f('content', 'text'), f('videoUrl', 'string'), f('duration', 'integer'), f('order', 'integer'), f('published', 'boolean')],
  },
  masjid: {
    settings: [indexedString('platform'), f('phone', 'string'), f('email', 'string'), f('address', 'string'), f('socials', 'json')],
    blog_posts: [f('title', 'string'), f('content', 'text'), f('excerpt', 'text'), f('platform', 'string'), f('authorName', 'string'), f('status', 'string'), f('publishedAt', 'datetime'), f('tags', 'json')],
    events: [f('title', 'string'), f('description', 'text'), f('date', 'datetime'), f('platform', 'string'), f('location', 'string'), f('category', 'string'), f('featured', 'boolean')],
    announcements: [f('title', 'string'), f('content', 'text'), f('platform', 'string'), f('category', 'string'), f('priority', 'string'), f('publishedAt', 'datetime'), f('status', 'string')],
    prayer_times: [f('date', 'date'), f('fajr', 'string'), f('fajrIqamah', 'string'), f('dhuhr', 'string'), f('dhuhrIqamah', 'string'), f('asr', 'string'), f('asrIqamah', 'string'), f('maghrib', 'string'), f('maghribIqamah', 'string'), f('isha', 'string'), f('ishaIqamah', 'string'), f('jumah', 'string')],
    audio_library: [f('title', 'string'), f('speaker', 'string'), f('description', 'text'), f('audioUrl', 'string'), f('duration', 'string'), f('category', 'string'), f('language', 'string'), f('platform', 'string'), f('tags', 'json')],
    donations: [f('amount', 'number'), f('platform', 'string'), f('campaignId', 'string'), f('donor', 'string'), f('donorEmail', 'string'), f('currency', 'string'), f('paymentMethod', 'string'), f('anonymous', 'boolean'), f('recurring', 'boolean'), f('frequency', 'string'), f('message', 'text'), f('createdAt', 'datetime')],
    quran_recitations: [f('surah', 'string'), f('reciter', 'string'), f('platform', 'string'), f('audioUrl', 'string'), f('duration', 'string')],
    islamic_calendar: [f('date', 'date'), f('platform', 'string'), f('hijriDate', 'string'), f('event', 'string'), f('type', 'string')],
    volunteers: [f('name', 'string'), f('email', 'string'), f('phone', 'string'), f('platform', 'string'), f('skills', 'json'), f('availability', 'string'), f('status', 'string'), f('hoursLogged', 'integer')],
    programs: [f('title', 'string'), f('description', 'text'), f('platform', 'string'), f('category', 'string'), f('duration', 'string'), f('status', 'string')],
  },
  charity: {
    settings: [indexedString('platform'), f('phone', 'string'), f('email', 'string'), f('address', 'string'), f('socials', 'json')],
    blog_posts: [f('title', 'string'), f('content', 'text'), f('excerpt', 'text'), f('platform', 'string'), f('authorName', 'string'), f('status', 'string'), f('publishedAt', 'datetime'), f('tags', 'json')],
    events: [f('title', 'string'), f('description', 'text'), f('date', 'datetime'), f('platform', 'string'), f('location', 'string'), f('category', 'string')],
    campaigns: [f('title', 'string'), f('description', 'text'), f('target', 'number'), f('raised', 'number'), f('status', 'string'), f('platform', 'string'), f('category', 'string'), f('endDate', 'datetime'), f('featured', 'boolean')],
    projects: [f('title', 'string'), f('description', 'text'), f('platform', 'string'), f('category', 'string'), f('status', 'string'), f('budget', 'number'), f('spent', 'number'), f('location', 'string')],
    donations: [f('amount', 'number'), f('platform', 'string'), f('campaignId', 'string'), f('donor', 'string'), f('donorEmail', 'string'), f('currency', 'string'), f('paymentMethod', 'string'), f('anonymous', 'boolean'), f('recurring', 'boolean'), f('message', 'text'), f('createdAt', 'datetime')],
    volunteers: [f('name', 'string'), f('email', 'string'), f('phone', 'string'), f('platform', 'string'), f('skills', 'json'), f('availability', 'string'), f('status', 'string'), f('hoursLogged', 'integer')],
    beneficiaries: [f('name', 'string'), f('email', 'string'), f('phone', 'string'), f('platform', 'string'), f('address', 'string'), f('needs', 'json'), f('status', 'string'), f('assignedTo', 'string')],
    testimonials: [f('name', 'string'), f('platform', 'string'), f('role', 'string'), f('content', 'text'), f('rating', 'integer'), f('approved', 'boolean')],
    impact_reports: [f('title', 'string'), f('platform', 'string'), f('period', 'string'), f('beneficiaries', 'integer'), f('fundsUsed', 'number'), f('summary', 'text')],
    fundraisers: [f('title', 'string'), f('platform', 'string'), f('organizer', 'string'), f('target', 'number'), f('raised', 'number'), f('endDate', 'datetime'), f('status', 'string')],
  },
  travels: {
    settings: [indexedString('platform'), f('phone', 'string'), f('email', 'string'), f('address', 'string'), f('socials', 'json')],
    blog_posts: [f('title', 'string'), f('content', 'text'), f('excerpt', 'text'), f('platform', 'string'), f('authorName', 'string'), f('status', 'string'), f('publishedAt', 'datetime'), f('tags', 'json')],
    events: [f('title', 'string'), f('description', 'text'), f('date', 'datetime'), f('platform', 'string'), f('location', 'string')],
    packages: [f('title', 'string'), f('description', 'text'), f('price', 'number'), f('type', 'string'), f('platform', 'string'), f('duration', 'integer'), f('maxPeople', 'integer'), f('available', 'boolean'), f('features', 'json'), f('itinerary', 'json'), f('startDate', 'datetime'), f('endDate', 'datetime')],
    bookings: [f('packageId', 'string'), f('customerId', 'string'), f('platform', 'string'), f('status', 'string'), f('totalAmount', 'number'), f('paidAmount', 'number'), f('travelers', 'json'), f('specialRequests', 'text'), f('bookingDate', 'datetime'), f('travelDate', 'datetime')],
    customers: [f('name', 'string'), f('email', 'string'), f('phone', 'string'), f('platform', 'string'), f('passportNumber', 'string'), f('nationality', 'string'), f('status', 'string'), f('registeredAt', 'datetime')],
    reviews: [f('entityId', 'string'), f('entityType', 'string'), f('platform', 'string'), f('customerName', 'string'), f('rating', 'integer'), f('comment', 'text'), f('verified', 'boolean'), f('helpful', 'integer')],
    itineraries: [f('packageId', 'string'), f('platform', 'string'), f('day', 'integer'), f('title', 'string'), f('description', 'text'), f('activities', 'json'), f('accommodation', 'string')],
    payments: [f('reference', 'string'), f('platform', 'string'), f('amount', 'number'), f('currency', 'string'), f('payer', 'string'), f('purpose', 'string'), f('status', 'string'), f('method', 'string'), f('paidAt', 'datetime')],
  },
};

// --- Seed data -------------------------------------------------------------

// Helper: hash password with SHA-256 (same as auth-context.tsx)
async function hashPassword(password, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const now = () => new Date().toISOString();
const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

async function buildSeedData() {
  const JWT_SECRET = process.env.VITE_JWT_SECRET || 'default-secret-change-in-production';

  // Test users for all roles across all platforms
  const testUsers = [
    // Platform admins (stored in global users collection)
    { email: 'admin@minhaajulhudaa.org', password: 'Admin@2026', name: 'Platform Admin', platform: 'school', role: 'admin', roles: ['admin'], permissions: ['*'], verified: true },
    { email: 'admin.masjid@minhaajulhudaa.org', password: 'Admin@2026', name: 'Masjid Admin', platform: 'masjid', role: 'admin', roles: ['admin'], permissions: ['*'], verified: true },
    { email: 'admin.charity@minhaajulhudaa.org', password: 'Admin@2026', name: 'Charity Admin', platform: 'charity', role: 'admin', roles: ['admin'], permissions: ['*'], verified: true },
    { email: 'admin.travels@minhaajulhudaa.org', password: 'Admin@2026', name: 'Travels Admin', platform: 'travels', role: 'admin', roles: ['admin'], permissions: ['*'], verified: true },
    // School users
    { email: 'student@minhaajulhudaa.org', password: 'Student@2026', name: 'Abdullah Student', platform: 'school', role: 'student', roles: ['student'], permissions: ['read'], verified: true },
    { email: 'teacher@minhaajulhudaa.org', password: 'Teacher@2026', name: 'Ustadh Yusuf', platform: 'school', role: 'teacher', roles: ['teacher'], permissions: ['read', 'write'], verified: true },
    // Masjid users
    { email: 'member@minhaajulhudaa.org', password: 'Member@2026', name: 'Masjid Member', platform: 'masjid', role: 'member', roles: ['member'], permissions: ['read'], verified: true },
    // Charity users
    { email: 'donor@minhaajulhudaa.org', password: 'Donor@2026', name: 'Abdur-Rahman Donor', platform: 'charity', role: 'donor', roles: ['donor'], permissions: ['read', 'write'], verified: true },
    { email: 'volunteer@minhaajulhudaa.org', password: 'Volunteer@2026', name: 'Khadijah Volunteer', platform: 'charity', role: 'volunteer', roles: ['volunteer'], permissions: ['read'], verified: true },
    // Travels users
    { email: 'traveler@minhaajulhudaa.org', password: 'Traveler@2026', name: 'Ibrahim Traveler', platform: 'travels', role: 'customer', roles: ['customer'], permissions: ['read', 'write'], verified: true },
  ];

  const usersWithHash = [];
  for (const u of testUsers) {
    const hashed = await hashPassword(u.password, JWT_SECRET);
    usersWithHash.push({
      email: u.email,
      name: u.name,
      platform: u.platform,
      role: u.role,
      roles: u.roles,
      permissions: u.permissions,
      verified: u.verified,
      password: hashed,
      createdAt: now(),
    });
  }

  return {
    users: usersWithHash,
    school: {
      settings: [
        { platform: 'school', phone: '+234-803-000-0001', email: 'school@minhaajulhudaa.org', address: '1 Islamic Way, Lagos', socials: [{ name: 'Facebook', url: 'https://facebook.com/minhaajulhudaa' }] },
      ],
      blog_posts: [
        { title: 'Welcome to Minhaajulhudaa Islamic School', content: 'BismiLLAH. We are honoured to welcome you to our Islamic school where we combine authentic Islamic knowledge with modern academic excellence.', excerpt: 'A warm welcome to our community of learners.', platform: 'school', authorName: 'Ustadh Yusuf', status: 'published', publishedAt: daysAgo(5), featured: true, tags: ['welcome', 'community'], categories: ['announcements'], views: 142 },
        { title: 'Admissions Open for 1447 AH', content: 'We are now accepting admissions for the new academic year. Apply early to secure your place.', excerpt: 'Admissions open for the new Hijri year.', platform: 'school', authorName: 'Admin', status: 'published', publishedAt: daysAgo(2), featured: false, tags: ['admissions'], categories: ['announcements'], views: 88 },
      ],
      events: [
        { title: 'Annual Quran Competition', description: 'Annual Quran recitation competition for all students.', date: daysFromNow(14), platform: 'school', location: 'School Hall', category: 'competition', featured: true, capacity: 200, registered: 87 },
        { title: 'Parent-Teacher Conference', description: 'Termly parent-teacher meeting.', date: daysFromNow(7), platform: 'school', location: 'School Hall', category: 'meeting', featured: false, capacity: 100, registered: 45 },
      ],
      announcements: [
        { title: 'School Resumption Date', content: 'School resumes on the 15th of Sha\'ban. All students should be in attendance.', platform: 'school', category: 'academic', priority: 'high', publishedAt: daysAgo(3), status: 'active' },
      ],
      students: [
        { name: 'Abdullah Student', email: 'student@minhaajulhudaa.org', phone: '+234-803-111-0001', platform: 'school', classId: 'cls-1', rollNumber: 'SCH/2026/001', guardianName: 'Abdur-Rahman', guardianPhone: '+234-803-111-0002', status: 'active', enrolledAt: daysAgo(120) },
        { name: 'Aisha Bint Ali', email: 'aisha@student.org', phone: '+234-803-111-0003', platform: 'school', classId: 'cls-2', rollNumber: 'SCH/2026/002', guardianName: 'Ali', guardianPhone: '+234-803-111-0004', status: 'active', enrolledAt: daysAgo(110) },
      ],
      staff: [
        { name: 'Ustadh Yusuf', email: 'teacher@minhaajulhudaa.org', phone: '+234-803-222-0001', platform: 'school', role: 'teacher', department: 'Quran & Tajweed', qualification: 'B.A. Islamic Studies', status: 'active', joinedAt: daysAgo(400) },
        { name: 'Ustadha Fatimah', email: 'fatimah@minhaajulhudaa.org', phone: '+234-803-222-0002', platform: 'school', role: 'teacher', department: 'Arabic Language', qualification: 'M.A. Arabic', status: 'active', joinedAt: daysAgo(300) },
      ],
      classes: [
        { name: 'Tahfeez Class A', platform: 'school', teacherId: 'staff-1', teacherName: 'Ustadh Yusuf', capacity: 25, enrolled: 18, schedule: 'Mon-Fri 8:00-10:00', room: 'Room 1', status: 'active' },
        { name: 'Tajweed Class B', platform: 'school', teacherId: 'staff-2', teacherName: 'Ustadha Fatimah', capacity: 20, enrolled: 15, schedule: 'Mon-Fri 10:00-12:00', room: 'Room 2', status: 'active' },
      ],
      programs: [
        { title: 'Full-Time Hifdh Program', description: 'A complete Quran memorization program with qualified instructors.', platform: 'school', category: 'hifdh', duration: '3 years', fee: 150000, startDate: daysFromNow(30), endDate: daysFromNow(1100), instructor: 'Ustadh Yusuf', status: 'active' },
        { title: 'Weekend Islamic Studies', description: 'Weekend classes on Fiqh, Seerah, and Aqeedah.', platform: 'school', category: 'studies', duration: '1 year', fee: 50000, startDate: daysFromNow(20), endDate: daysFromNow(385), instructor: 'Ustadha Fatimah', status: 'active' },
      ],
      admissions: [
        { studentName: 'Muhammad Ibrahim', platform: 'school', programId: 'prog-1', programTitle: 'Full-Time Hifdh Program', parentName: 'Ibrahim Sr.', parentEmail: 'ibrahim.sr@email.com', parentPhone: '+234-803-333-0001', status: 'pending', appliedAt: daysAgo(7) },
      ],
      courses: [
        { title: 'Quran Memorization - Juz Amma', description: 'Memorize the 30th Juz with proper tajweed.', platform: 'school', instructor: 'Ustadh Yusuf', duration: 180, level: 'beginner', price: 50000, status: 'published', thumbnail: '' },
        { title: 'Arabic for Beginners', description: 'Learn the Arabic alphabet and basic grammar.', platform: 'school', instructor: 'Ustadha Fatimah', duration: 120, level: 'beginner', price: 30000, status: 'published', thumbnail: '' },
      ],
      library: [
        { title: 'Kitab At-Tawheed', author: 'Shaykh Muhammad ibn AbdilWahhab', platform: 'school', description: 'The Book of Monotheism.', pdfUrl: '', coverImage: '', pages: 280, downloads: 42 },
      ],
      shop_products: [
        { name: 'Islamic Studies Textbook 1', price: 5000, platform: 'school', description: 'Foundation textbook for Islamic studies.', category: 'books', stock: 50, sku: 'BK-001', status: 'active', featured: true },
        { name: 'Quran with Tajweed Color-Coded', price: 12000, platform: 'school', description: 'Color-coded Quran for easy tajweed.', category: 'quran', stock: 30, sku: 'QR-001', status: 'active', featured: true },
      ],
      shop_orders: [
        { customerId: 'student-1', platform: 'school', orderNumber: 'ORD-001', total: 17000, items: [{ productId: 'prod-1', name: 'Islamic Studies Textbook 1', qty: 1, price: 5000 }, { productId: 'prod-2', name: 'Quran with Tajweed', qty: 1, price: 12000 }], status: 'completed', paymentStatus: 'paid', createdAt: daysAgo(5) },
      ],
      payments: [
        { reference: 'PAY-001', platform: 'school', amount: 17000, currency: 'NGN', payer: 'Abdullah Student', payerEmail: 'student@minhaajulhudaa.org', purpose: 'Shop order ORD-001', status: 'completed', method: 'card', paidAt: daysAgo(5) },
      ],
      lms_courses: [
        { title: 'Quran Memorization - Juz Amma', description: 'Memorize the 30th Juz with proper tajweed.', platform: 'school', instructor: 'Ustadh Yusuf', duration: 180, level: 'beginner', price: 50000, status: 'published', thumbnail: '', syllabus: ['Surah An-Naba', 'Surah An-Naziat', 'Surah Abasa'] },
      ],
      lms_lessons: [
        { courseId: 'lms-1', title: 'Introduction to Tajweed', description: 'Basic rules of tajweed.', type: 'video', content: 'Learn the foundational rules of tajweed.', videoUrl: '', duration: 45, order: 1, published: true },
        { courseId: 'lms-1', title: 'Surah An-Naba - Part 1', description: 'Memorize the first 10 verses.', type: 'video', content: 'Memorization of Surah An-Naba verses 1-10.', videoUrl: '', duration: 60, order: 2, published: true },
      ],
    },
    masjid: {
      settings: [
        { platform: 'masjid', phone: '+234-803-444-0001', email: 'masjid@minhaajulhudaa.org', address: '1 Islamic Way, Lagos', socials: [{ name: 'Facebook', url: 'https://facebook.com/minhaajulhudaa' }] },
      ],
      blog_posts: [
        { title: 'Ramadan Programmes 1447 AH', content: 'Join us for taraweeh, lectures, and iftar throughout Ramadan.', excerpt: 'Ramadan programmes at the masjid.', platform: 'masjid', authorName: 'Imam', status: 'published', publishedAt: daysAgo(3), tags: ['ramadan'] },
      ],
      events: [
        { title: 'Jumah Khutbah', description: 'Weekly Friday khutbah and prayer.', date: daysFromNow(2), platform: 'masjid', location: 'Main Prayer Hall', category: 'prayer', featured: true },
        { title: 'Community Iftar', description: 'Community iftar gathering every Saturday in Ramadan.', date: daysFromNow(5), platform: 'masjid', location: 'Courtyard', category: 'community', featured: true },
      ],
      announcements: [
        { title: 'Eid Prayer Time', content: 'Eid prayer will be at 7:00 AM sharp. Please arrive early.', platform: 'masjid', category: 'eid', priority: 'high', publishedAt: daysAgo(1), status: 'active' },
      ],
      prayer_times: [
        { date: new Date().toISOString().split('T')[0], fajr: '05:15', fajrIqamah: '05:35', dhuhr: '12:45', dhuhrIqamah: '13:00', asr: '16:00', asrIqamah: '16:15', maghrib: '18:55', maghribIqamah: '19:05', isha: '20:00', ishaIqamah: '20:15', jumah: '13:00' },
      ],
      audio_library: [
        { title: 'Tafseer Surah Al-Baqarah', speaker: 'Shaykh Abdur-Rahman', description: 'Detailed tafseer of Surah Al-Baqarah.', audioUrl: '', duration: '45:00', category: 'tafseer', language: 'English', platform: 'masjid', tags: ['tafseer', 'quran'] },
        { title: 'Seerah of the Prophet - Part 1', speaker: 'Ustadh Yusuf', description: 'The life of the Prophet Muhammad (peace be upon him).', audioUrl: '', duration: '52:00', category: 'seerah', language: 'English', platform: 'masjid', tags: ['seerah'] },
      ],
      donations: [
        { amount: 50000, platform: 'masjid', donor: 'Anonymous', donorEmail: 'anon@email.com', currency: 'NGN', paymentMethod: 'card', anonymous: true, recurring: false, message: 'For masjid maintenance', createdAt: daysAgo(2) },
      ],
      quran_recitations: [
        { surah: 'Al-Fatihah', reciter: 'AbdulBaset AbdulSamad', platform: 'masjid', audioUrl: 'https://archive.org/download/AbdulBasetAbdulSamadMujawwad/001.mp3', duration: '2:30' },
        { surah: 'Al-Baqarah', reciter: 'AbdulBaset AbdulSamad', platform: 'masjid', audioUrl: 'https://archive.org/download/AbdulBasetAbdulSamadMujawwad/002.mp3', duration: '3:45:00' },
      ],
      islamic_calendar: [
        { date: new Date().toISOString().split('T')[0], platform: 'masjid', hijriDate: '1 Muharram 1448', event: 'Islamic New Year', type: 'holiday' },
      ],
      volunteers: [
        { name: 'Khadijah Volunteer', email: 'volunteer@minhaajulhudaa.org', phone: '+234-803-555-0001', platform: 'masjid', skills: ['teaching', 'organization'], availability: 'weekends', status: 'active', hoursLogged: 24 },
      ],
      programs: [
        { title: 'Daily Tafsir after Fajr', description: 'Daily tafsir circle after Fajr prayer.', platform: 'masjid', category: 'tafsir', duration: '30 min', status: 'active' },
      ],
    },
    charity: {
      settings: [
        { platform: 'charity', phone: '+234-803-666-0001', email: 'charity@minhaajulhudaa.org', address: '1 Islamic Way, Lagos', socials: [{ name: 'Facebook', url: 'https://facebook.com/minhaajulhudaa' }] },
      ],
      blog_posts: [
        { title: 'Sadaqah Jariyah: Build a Well', content: 'Help us build a well in a rural community.', excerpt: 'Build a well campaign update.', platform: 'charity', authorName: 'Charity Team', status: 'published', publishedAt: daysAgo(4), tags: ['water', 'sadaqah'] },
      ],
      events: [
        { title: 'Charity Fundraising Dinner', description: 'Annual fundraising dinner.', date: daysFromNow(21), platform: 'charity', location: 'Community Hall', category: 'fundraising' },
      ],
      campaigns: [
        { title: 'Build a Well for 500 Families', description: 'Provide clean water to 500 families in rural areas.', target: 5000000, raised: 1850000, status: 'active', platform: 'charity', category: 'water', endDate: daysFromNow(60), featured: true },
        { title: 'Orphan Sponsorship Programme', description: 'Sponsor orphans for their daily needs and education.', target: 3000000, raised: 1200000, status: 'active', platform: 'charity', category: 'orphans', endDate: daysFromNow(90), featured: true },
      ],
      projects: [
        { title: 'Borehole Project - Village A', description: 'Drilling a borehole in Village A.', platform: 'charity', category: 'water', status: 'in-progress', budget: 1500000, spent: 800000, location: 'Village A, Northern Nigeria' },
      ],
      donations: [
        { amount: 100000, platform: 'charity', campaignId: 'camp-1', donor: 'Abdur-Rahman', donorEmail: 'donor@minhaajulhudaa.org', currency: 'NGN', paymentMethod: 'card', anonymous: false, recurring: true, frequency: 'monthly', message: 'May Allah accept', createdAt: daysAgo(3) },
      ],
      volunteers: [
        { name: 'Khadijah Volunteer', email: 'volunteer@minhaajulhudaa.org', phone: '+234-803-555-0001', platform: 'charity', skills: ['logistics', 'teaching'], availability: 'weekends', status: 'active', hoursLogged: 48 },
      ],
      beneficiaries: [
        { name: 'Family of 5 - Widow', email: '', phone: '+234-803-777-0001', platform: 'charity', address: 'Village A', needs: ['food', 'shelter', 'school fees'], status: 'active', assignedTo: 'Khadijah Volunteer' },
      ],
      testimonials: [
        { name: 'Sister Aminah', platform: 'charity', role: 'Beneficiary', content: 'May Allah reward the team for their support during our difficult time.', rating: 5, approved: true },
      ],
      impact_reports: [
        { title: 'Q1 2026 Impact Report', platform: 'charity', period: 'Q1 2026', beneficiaries: 320, fundsUsed: 2400000, summary: 'Supported 320 families across 5 communities.' },
      ],
      fundraisers: [
        { title: 'Ramadan Food Drive', platform: 'charity', organizer: 'Charity Team', target: 2000000, raised: 850000, endDate: daysFromNow(15), status: 'active' },
      ],
    },
    travels: {
      settings: [
        { platform: 'travels', phone: '+234-803-888-0001', email: 'travels@minhaajulhudaa.org', address: '1 Islamic Way, Lagos', socials: [{ name: 'Facebook', url: 'https://facebook.com/minhaajulhudaa' }] },
      ],
      blog_posts: [
        { title: 'Preparing for Hajj: A Complete Guide', content: 'Everything you need to know to prepare for Hajj.', excerpt: 'Hajj preparation guide.', platform: 'travels', authorName: 'Travels Team', status: 'published', publishedAt: daysAgo(6), tags: ['hajj', 'guide'] },
      ],
      events: [
        { title: 'Pre-Hajj Seminar', description: 'Seminar for prospective pilgrims.', date: daysFromNow(10), platform: 'travels', location: 'Seminar Hall' },
      ],
      packages: [
        { title: 'Hajj 1447 AH - Premium Package', description: 'Premium Hajj package with 5-star accommodation.', price: 4500000, type: 'hajj', platform: 'travels', duration: 35, maxPeople: 50, available: true, features: ['5-star hotel', 'Air-conditioned transport', 'Guided tours', 'Full board meals'], itinerary: [{ day: 1, title: 'Arrival in Makkah', description: 'Arrive and check into hotel.' }], startDate: daysFromNow(30), endDate: daysFromNow(65) },
        { title: 'Umrah Ramadan Special', description: 'Umrah during Ramadan with all amenities.', price: 1800000, type: 'umrah', platform: 'travels', duration: 15, maxPeople: 40, available: true, features: ['4-star hotel', 'Close to Haram', 'Group guide'], itinerary: [{ day: 1, title: 'Arrival in Madinah', description: 'Arrive in Madinah and check in.' }], startDate: daysFromNow(20), endDate: daysFromNow(35) },
      ],
      bookings: [
        { packageId: 'pkg-1', customerId: 'cust-1', platform: 'travels', status: 'confirmed', totalAmount: 4500000, paidAmount: 2250000, travelers: [{ name: 'Ibrahim Traveler', passport: 'A12345678' }], specialRequests: 'Wheelchair access for elderly traveler', bookingDate: daysAgo(10), travelDate: daysFromNow(30) },
      ],
      customers: [
        { name: 'Ibrahim Traveler', email: 'traveler@minhaajulhudaa.org', phone: '+234-803-999-0001', platform: 'travels', passportNumber: 'A12345678', nationality: 'Nigerian', status: 'active', registeredAt: daysAgo(60) },
      ],
      reviews: [
        { entityId: 'pkg-1', entityType: 'package', platform: 'travels', customerName: 'Ibrahim Traveler', rating: 5, comment: 'Excellent service throughout the journey. May Allah accept.', verified: true, helpful: 12 },
      ],
      itineraries: [
        { packageId: 'pkg-1', platform: 'travels', day: 1, title: 'Arrival in Jeddah', description: 'Arrive at King Abdulaziz International Airport.', activities: ['Airport pickup', 'Transfer to Makkah hotel', 'Rest'], accommodation: '5-star Hotel' },
      ],
      payments: [
        { reference: 'PAY-TRV-001', platform: 'travels', amount: 2250000, currency: 'NGN', payer: 'Ibrahim Traveler', purpose: 'Hajj package deposit', status: 'completed', method: 'bank_transfer', paidAt: daysAgo(10) },
      ],
    },
  };
}

// --- Main ------------------------------------------------------------------

async function main() {
  console.log('BismiLLAH Ar-Rahman Ar-Roheem.');
  console.log('Lightbase seed starting...\n');
  console.log(`  Base URL : ${BASE_URL}`);
  console.log(`  Project  : ${PROJECT_ID}\n`);

  // 1. Create global collections
  console.log('--- Step 1: Creating global collections ---');
  for (const [name, fields] of Object.entries(collectionSchemas)) {
    const r = await ensureCollection(name, fields);
    console.log(`  ${r.created ? '+' : '.'} ${name}`);
  }

  // 2. Create platform-scoped collections
  console.log('\n--- Step 2: Creating platform-scoped collections ---');
  for (const [platform, cols] of Object.entries(platformCollections)) {
    console.log(`  [${platform}]`);
    for (const [colName, fields] of Object.entries(cols)) {
      const fullName = `${platform}_${colName}`;
      const r = await ensureCollection(fullName, fields);
      console.log(`    ${r.created ? '+' : '.'} ${fullName}`);
    }
  }

  // 3. Seed data
  console.log('\n--- Step 3: Seeding data ---');
  const data = await buildSeedData();

  // Global users
  console.log('  [users]');
  const usersRes = await seedCollection('users', data.users, ['email', 'platform']);
  console.log(`    inserted: ${usersRes.inserted}, skipped: ${usersRes.skipped}`);

  // Platform-scoped data
  for (const platform of ['school', 'masjid', 'charity', 'travels']) {
    console.log(`  [${platform}]`);
    for (const [colName, docs] of Object.entries(data[platform])) {
      const fullName = `${platform}_${colName}`;
      const res = await seedCollection(fullName, docs);
      console.log(`    ${fullName}: inserted ${res.inserted}, skipped ${res.skipped}`);
    }
  }

  console.log('\nAlhamduliLLAH. Seed complete.');
  console.log('\nTest credentials (all passwords shown below):');
  console.log('  School admin  : admin@minhaajulhudaa.org / Admin@2026');
  console.log('  Masjid admin  : admin.masjid@minhaajulhudaa.org / Admin@2026');
  console.log('  Charity admin : admin.charity@minhaajulhudaa.org / Admin@2026');
  console.log('  Travels admin : admin.travels@minhaajulhudaa.org / Admin@2026');
  console.log('  School student: student@minhaajulhudaa.org / Student@2026');
  console.log('  School teacher: teacher@minhaajulhudaa.org / Teacher@2026');
  console.log('  Masjid member : member@minhaajulhudaa.org / Member@2026');
  console.log('  Charity donor : donor@minhaajulhudaa.org / Donor@2026');
  console.log('  Charity volunteer: volunteer@minhaajulhudaa.org / Volunteer@2026');
  console.log('  Travels customer: traveler@minhaajulhudaa.org / Traveler@2026');
  console.log('\nBaarokaLLAHU Fee.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
