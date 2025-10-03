import config from '../config';
import db from '../db';

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
  tags?: string[];
  context?: Record<string, string>;
  transformation?: Record<string, any>;
}

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resource_type: string;
  created_at: string;
  tags?: string[];
  folder?: string;
}

export interface MediaRecord {
  id: string;
  uid: string;
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  width?: number;
  height?: number;
  size: number;
  folder?: string;
  tags?: string[];
  platform: string;
  uploadedBy?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.cloudName = config.cloudinary.cloudName;
    this.uploadPreset = config.cloudinary.uploadPreset;
    this.apiKey = config.cloudinary.apiKey;
    this.apiSecret = config.cloudinary.apiSecret;
  }

  isConfigured(): boolean {
    return Boolean(this.cloudName && this.uploadPreset);
  }

  async upload(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error('Cloudinary is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    if (options.folder) {
      formData.append('folder', options.folder);
    }

    if (options.publicId) {
      formData.append('public_id', options.publicId);
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    if (options.context) {
      const contextStr = Object.entries(options.context)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      formData.append('context', contextStr);
    }

    const resourceType = options.resourceType || this.detectResourceType(file);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resource_type: result.resource_type,
      created_at: result.created_at,
      tags: result.tags,
      folder: result.folder,
    };
  }

  async uploadMultiple(
    files: File[],
    options: UploadOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    let completed = 0;

    for (const file of files) {
      const result = await this.upload(file, options);
      results.push(result);
      completed++;
      
      if (onProgress) {
        onProgress((completed / files.length) * 100);
      }
    }

    return results;
  }

  async saveToDatabase(
    uploadResult: UploadResult,
    platform: string,
    uploadedBy?: string
  ): Promise<MediaRecord> {
    const mediaRecord = await db.insert<MediaRecord>('media', {
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      size: uploadResult.bytes,
      folder: uploadResult.folder,
      tags: uploadResult.tags,
      platform,
      uploadedBy,
      createdAt: new Date().toISOString(),
    });

    return mediaRecord;
  }

  async deleteMedia(publicId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Cloudinary is not configured');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await this.generateSignature({
      public_id: publicId,
      timestamp: timestamp.toString(),
    });

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.result === 'ok';
  }

  private async generateSignature(params: Record<string, string>): Promise<string> {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const stringToSign = sortedParams + this.apiSecret;

    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private detectResourceType(file: File): 'image' | 'video' | 'raw' {
    const mimeType = file.type;
    
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else {
      return 'raw';
    }
  }

  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'crop';
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
  ): string {
    const transformations: string[] = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);

    const transformStr = transformations.length > 0 ? transformations.join(',') + '/' : '';
    
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformStr}${publicId}`;
  }

  async getMediaByPlatform(platform: string): Promise<MediaRecord[]> {
    const media = await db.get<MediaRecord>('media');
    return media.filter(m => m.platform === platform);
  }

  async getMediaByFolder(folder: string): Promise<MediaRecord[]> {
    const media = await db.get<MediaRecord>('media');
    return media.filter(m => m.folder === folder);
  }

  async searchMedia(query: string): Promise<MediaRecord[]> {
    const media = await db.get<MediaRecord>('media');
    const lowerQuery = query.toLowerCase();
    
    return media.filter(m => 
      m.publicId.toLowerCase().includes(lowerQuery) ||
      m.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
