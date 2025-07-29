
interface CloudinaryConfig {
  uploadPreset?: string;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

interface SMTPConfig {
  endpoint?: string;
  from?: string;
  test?: () => Promise<boolean>;
}

interface PaystackConfig {
  publicKey: string;
  secretKey: string;
}

interface StripeConfig {
  publicKey: string;
  secretKey: string;
}

interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
}

interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

interface PaypalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}

interface PaymentGatewayConfig {
  paystack?: PaystackConfig;
  stripe?: StripeConfig;
  flutterwave?: FlutterwaveConfig;
  razorpay?: RazorpayConfig;
  paypal?: PaypalConfig;
}

interface AuthConfig {
  requireEmailVerification?: boolean;
  otpTriggers?: string[];
}

interface SchemaDefinition {
  required?: string[];
  types?: Record<string, string>;
  defaults?: Record<string, any>;
}

interface UniversalSDKConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
  basePath?: string;
  mediaPath?: string;
  cloudinary?: CloudinaryConfig;
  smtp?: SMTPConfig;
  templates?: Record<string, string>;
  schemas?: Record<string, SchemaDefinition>;
  auth?: AuthConfig;
  paymentGateways?: PaymentGatewayConfig;
}

interface User {
  id?: string;
  uid?: string;
  email: string;
  password?: string;
  googleId?: string;
  verified?: boolean;
  roles?: string[];
  permissions?: string[];
  schoolId?: string;
  [key: string]: any;
}

interface Session {
  token: string;
  user: User;
  created: number;
}

interface OTPRecord {
  otp: string;
  created: number;
  reason: string;
}

interface AuditLogEntry {
  action: string;
  data: any;
  timestamp: number;
}

interface QueryBuilder<T = any> {
  where(fn: (item: T) => boolean): QueryBuilder<T>;
  sort(field: string, dir?: 'asc' | 'desc'): QueryBuilder<T>;
  project(fields: string[]): QueryBuilder<Partial<T>>;
  exec(): Promise<T[]>;
}

interface MediaAttachment {
  attachmentId: string;
  mimeType: string;
  isInline: boolean;
  url: string;
  name: string;
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  [key: string]: any;
}

interface QueuedWrite {
  collection: string;
  data: any[];
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  retries: number;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from: string;
  headers: Record<string, string>;
}

class UniversalSDK {
  private owner: string;
  private repo: string;
  private token: string;
  private branch: string;
  private basePath: string;
  private mediaPath: string;
  private cloudinary: CloudinaryConfig;
  private smtp: SMTPConfig;
  private paymentGateways: PaymentGatewayConfig;
  private templates: Record<string, string>;
  private schemas: Record<string, SchemaDefinition>;
  private authConfig: AuthConfig;
  private sessionStore: Record<string, Session>;
  private otpMemory: Record<string, OTPRecord>;
  private auditLog: Record<string, AuditLogEntry[]>;
  private cache: Record<string, { data: any[], etag?: string, sha?: string }> = {};
  private subscribers: Record<string, Function[]> = {};
  private pollingIntervals: Record<string, number> = {};
  private writeQueue: QueuedWrite[] = [];
  private isProcessingQueue = false;

  constructor(config: UniversalSDKConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.token = config.token;
    this.branch = config.branch || "main";
    this.basePath = config.basePath || "db";
    this.mediaPath = config.mediaPath || "media";
    this.cloudinary = config.cloudinary || {};
    this.smtp = config.smtp || {};
    this.paymentGateways = config.paymentGateways || {};
    this.templates = config.templates || {};
    this.schemas = {
      schools: {
        types: {
          name: 'string',
          paymentSettings: 'object'
        }
      },
      payments: {
        types: {
          schoolId: 'string',
          studentId: 'string',
          amount: 'number',
          currency: 'string',
          provider: 'string',
          transactionId: 'string',
          status: 'string',
          createdAt: 'date',
          updatedAt: 'date',
        }
      },
      sections: {
        types: {
          icon: 'string',
          borderColor: 'string',
          framePadding: 'string',
          gridGap: 'string',
          animationDuration: 'string',
          shrinkScale: 'string',
          slideDirection: 'string',
          skewAngle: 'string',
        }
      },
      ...config.schemas
    };
    this.authConfig = config.auth || { requireEmailVerification: true, otpTriggers: ["register"] };
    this.sessionStore = {};
    this.otpMemory = {};
    this.auditLog = {};
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `token ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private async request(path: string, method: string = "GET", body: any = null, etag?: string): Promise<any> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}` +
                (method === "GET" ? `?ref=${this.branch}` : "");
    const headers = this.headers();
    if (etag) {
      headers["If-None-Match"] = etag;
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (res.status === 304) {
      return { notModified: true };
    }

    if (!res.ok) throw new Error(await res.text());
    if (res.status === 204 || res.status === 201) {
        return { success: true, ...await res.json() };
    }

    const json = await res.json();
    return { ...json, etag: res.headers.get("ETag") };
  }

  async get<T = any>(collection: string, force = false): Promise<T[]> {
    const cacheEntry = this.cache[collection];
    if (cacheEntry && !force) {
      return cacheEntry.data;
    }

    try {
      const res = await this.request(`${this.basePath}/${collection}.json`, "GET", null, cacheEntry?.etag);
      if (res.notModified) {
        return cacheEntry.data;
      }
      const data = JSON.parse(atob(res.content));
      this.cache[collection] = { data, etag: res.etag, sha: res.sha };
      this.notifySubscribers(collection, data);
      return data;
    } catch (e) {
      if ((e as Error).message.includes("Not Found")) {
        // Auto-create collection with empty array
        await this.createCollection(collection);
        this.cache[collection] = { data: [], etag: undefined, sha: undefined };
        return [];
      }
      throw e;
    }
  }

  private async createCollection(collection: string): Promise<void> {
    try {
      await this.request(`${this.basePath}/${collection}.json`, "PUT", {
        message: `Create ${collection} collection`,
        content: btoa(JSON.stringify([], null, 2)),
        branch: this.branch,
      });
    } catch (e) {
      console.warn(`Failed to create collection ${collection}:`, e);
    }
  }

  private notifySubscribers(collection: string, data: any[]) {
    (this.subscribers[collection] || []).forEach(cb => cb(data));
  }

  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    if (!this.subscribers[collection]) {
      this.subscribers[collection] = [];
    }
    this.subscribers[collection].push(callback);

    if (!this.pollingIntervals[collection]) {
      this.pollCollection(collection);
      const intervalId = setInterval(() => this.pollCollection(collection), 5000);
      this.pollingIntervals[collection] = intervalId as any;
    }
    
    if (this.cache[collection]) {
      callback(this.cache[collection].data);
    } else {
      this.get(collection).then(data => callback(data));
    }

    return () => this.unsubscribe(collection, callback);
  }

  unsubscribe(collection: string, callback: Function) {
    this.subscribers[collection] = (this.subscribers[collection] || []).filter(cb => cb !== callback);
    if (this.subscribers[collection].length === 0) {
      clearInterval(this.pollingIntervals[collection]);
      delete this.pollingIntervals[collection];
    }
  }

  private async pollCollection(collection: string) {
    try {
      const cacheEntry = this.cache[collection];
      const res = await this.request(`${this.basePath}/${collection}.json`, "GET", null, cacheEntry?.etag);

      if (!res.notModified) {
        const data = JSON.parse(atob(res.content));
        this.cache[collection] = { data, etag: res.etag, sha: res.sha };
        this.notifySubscribers(collection, data);
      }
    } catch (error) {
      console.error(`Polling failed for ${collection}:`, error);
    }
  }

  async getItem<T = any>(collection: string, key: string): Promise<T | null> {
    const arr = await this.get<T>(collection);
    return arr.find((x: any) => x.id === key || x.uid === key) || null;
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.writeQueue.length === 0) {
      return;
    }
    this.isProcessingQueue = true;
    const write = this.writeQueue[0];

    try {
      const { collection, data, resolve } = write;
      const file = await this.request(`${this.basePath}/${collection}.json`).catch(() => ({ sha: undefined }));
      await this.request(`${this.basePath}/${collection}.json`, "PUT", {
          message: `Update ${collection} - ${new Date().toISOString()}`,
          content: btoa(JSON.stringify(data, null, 2)),
          branch: this.branch,
          sha: file.sha,
      });

      this.writeQueue.shift();
      this.get(collection, true);
      resolve(data);
    } catch (error: any) {
        if (error.message.includes("409") && write.retries < 5) {
            write.retries++;
        } else {
            write.reject(error);
            this.writeQueue.shift();
        }
    } finally {
        this.isProcessingQueue = false;
        if (this.writeQueue.length > 0) {
          setTimeout(() => this.processQueue(), 250);
        }
    }
  }

  private save<T = any>(collection: string, data: T[]): Promise<T[]> {
      return new Promise((resolve, reject) => {
        this.cache[collection] = { ...this.cache[collection], data };
        this.notifySubscribers(collection, data);
        this.writeQueue.push({
            collection,
            data,
            resolve,
            reject,
            retries: 0
        });
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    });
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    const arr = await this.get<T>(collection);
    const schema = this.schemas[collection];
    if (schema?.defaults) item = { ...schema.defaults, ...item };
    this.validateSchema(collection, item);
    const id = (Math.max(0, ...arr.map((x: any) => +x.id || 0)) + 1).toString();
    const newItem = { uid: crypto.randomUUID(), id, ...item } as T & { id: string; uid: string };
    arr.push(newItem);
    await this.save(collection, arr);
    this._audit(collection, newItem, "insert");
    return newItem;
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.get(collection, true);
    const arr = [...(this.cache[collection]?.data || [])];
    const itemIndex = arr.findIndex((x: any) => x.id === key || x.uid === key);
    if (itemIndex === -1) {
      throw new Error(`Item with key "${key}" not found in collection "${collection}".`);
    }

    const updatedItem = { ...arr[itemIndex], ...updates };
    this.validateSchema(collection, updatedItem);
    arr[itemIndex] = updatedItem;

    await this.save(collection, arr);
    this._audit(collection, updatedItem, "update");
    return updatedItem;
  }

  async delete<T = any>(collection: string, key: string): Promise<void> {
    const arr = await this.get<T>(collection);
    const filtered = arr.filter((x: any) => x.id !== key && x.uid !== key);
    const deleted = arr.filter((x: any) => x.id === key || x.uid === key);
    await this.save(collection, filtered);
    deleted.forEach(d => this._audit(collection, d, "delete"));
  }

  private validateSchema(collection: string, item: any): void {
    const schema = this.schemas[collection];
    if (!schema) return;
    (schema.required || []).forEach(r => {
      if (!(r in item)) throw new Error(`Missing required: ${r}`);
    });
    Object.entries(item).forEach(([k, v]) => {
      const t = schema.types?.[k];
      if (t) {
        const ok =
          (t === "string" && typeof v === "string") ||
          (t === "number" && typeof v === "number") ||
          (t === "boolean" && typeof v === "boolean") ||
          (t === "object" && typeof v === "object") ||
          (t === "array" && Array.isArray(v)) ||
          (t === "date" && !isNaN(Date.parse(v as string))) ||
          (t === "uuid" && typeof v === "string");
        if (!ok) throw new Error(`Field ${k} should be ${t}`);
      }
    });
  }

  private _audit(collection: string, data: any, action: string): void {
    const logs = this.auditLog[collection] || [];
    logs.push({ action, data, timestamp: Date.now() });
    this.auditLog[collection] = logs.slice(-100);
  }

  async init(): Promise<UniversalSDK> {
    // Auto-create essential collections for each platform
    const collections = [
      'users', 'sessions', 'blog_posts', 'pages', 'media', 'settings',
      // School specific
      'students', 'courses', 'classes', 'programs', 'admissions', 'assignments', 'exams',
      // Masjid specific
      'prayer_times', 'events', 'audio_library', 'donations', 'announcements',
      // Charity specific
      'campaigns', 'projects', 'volunteers', 'beneficiaries', 'testimonials',
      // Travels specific
      'packages', 'bookings', 'reviews', 'itineraries', 'customers'
    ];

    for (const collection of collections) {
      try {
        await this.get(collection);
      } catch (e) {
        console.log(`Auto-creating collection: ${collection}`);
      }
    }

    return this;
  }

  // Simplified version - include only essential methods for now
  queryBuilder<T = any>(collection: string): QueryBuilder<T> {
    let chain = Promise.resolve().then(() => this.get<T>(collection));
    const qb: QueryBuilder<T> = {
      where(fn: (item: T) => boolean) {
        chain = chain.then(arr => arr.filter(fn));
        return qb;
      },
      sort(field: string, dir: 'asc' | 'desc' = "asc") {
        chain = chain.then(arr => arr.sort((a: any, b: any) =>
          dir === 'asc' ? (a[field] > b[field] ? 1 : -1) : (a[field] < b[field] ? 1 : -1)
        ));
        return qb;
      },
      project(fields: string[]) {
        chain = chain.then(arr => arr.map((item: any) => {
          const o: any = {};
          fields.forEach(f => {
            if (f in item) o[f] = item[f]
          });
          return o
        }));
        return qb as QueryBuilder<any>;
      },
      exec() { return chain; },
    };
    return qb;
  }
}

export default UniversalSDK;
export type {
  UniversalSDKConfig,
  CloudinaryConfig,
  SMTPConfig,
  AuthConfig,
  SchemaDefinition,
  User,
  Session,
  QueryBuilder,
  CloudinaryUploadResult,
  MediaAttachment
};
