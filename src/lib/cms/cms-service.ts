import db from '../db';

export interface CMSPage {
  id: string;
  uid: string;
  title: string;
  slug: string;
  content: string;
  platform: string;
  template?: string;
  sections: CMSSection[];
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'gallery' | 'content' | 'form';
  title?: string;
  content?: string;
  data: Record<string, any>;
  order: number;
}

class CMSService {
  async getPages(platform: string): Promise<CMSPage[]> {
    const pages = await db.get<CMSPage>('cms_pages');
    return pages.filter(p => p.platform === platform);
  }

  async getPage(pageId: string): Promise<CMSPage | null> {
    const pages = await db.get<CMSPage>('cms_pages');
    return pages.find(p => p.id === pageId || p.uid === pageId) || null;
  }

  async getPageBySlug(platform: string, slug: string): Promise<CMSPage | null> {
    const pages = await db.get<CMSPage>('cms_pages');
    return pages.find(p => p.platform === platform && p.slug === slug) || null;
  }

  async createPage(pageData: Omit<CMSPage, 'id' | 'uid' | 'createdAt' | 'updatedAt'>): Promise<CMSPage> {
    return await db.insert<CMSPage>('cms_pages', {
      ...pageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async updatePage(pageId: string, updates: Partial<CMSPage>): Promise<CMSPage> {
    return await db.update<CMSPage>('cms_pages', pageId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deletePage(pageId: string): Promise<void> {
    await db.delete('cms_pages', pageId);
  }

  async publishPage(pageId: string): Promise<CMSPage> {
    return await this.updatePage(pageId, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
  }

  async unpublishPage(pageId: string): Promise<CMSPage> {
    return await this.updatePage(pageId, {
      status: 'draft',
    });
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const cmsService = new CMSService();
export default cmsService;
