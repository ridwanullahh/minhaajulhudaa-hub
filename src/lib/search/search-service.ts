import db from '../db';
import blogService from '../blog/blog-service';
import ecommerceService from '../ecommerce/ecommerce-service';

export interface SearchResult {
  id: string;
  type: 'post' | 'product' | 'course' | 'event' | 'page';
  title: string;
  description: string;
  url: string;
  platform: string;
  thumbnail?: string;
  relevance: number;
}

class SearchService {
  async search(platform: string, query: string, types?: string[]): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    if (!types || types.includes('post')) {
      const posts = await blogService.searchPosts(platform, query);
      posts.forEach(post => {
        results.push({
          id: post.uid,
          type: 'post',
          title: post.title,
          description: post.excerpt,
          url: `/${platform}/blog/${post.uid}`,
          platform,
          thumbnail: post.featuredImage,
          relevance: this.calculateRelevance(lowerQuery, post.title, post.excerpt),
        });
      });
    }

    if (!types || types.includes('product')) {
      const products = await ecommerceService.getProducts(platform);
      const matchedProducts = products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );

      matchedProducts.forEach(product => {
        results.push({
          id: product.uid,
          type: 'product',
          title: product.name,
          description: product.description,
          url: `/${platform}/shop/products/${product.uid}`,
          platform,
          thumbnail: product.images[0],
          relevance: this.calculateRelevance(lowerQuery, product.name, product.description),
        });
      });
    }

    if (!types || types.includes('course')) {
      const courses = await db.get('lms_courses');
      const platformCourses = courses.filter((c: any) => c.platform === platform);
      const matchedCourses = platformCourses.filter((c: any) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description?.toLowerCase().includes(lowerQuery)
      );

      matchedCourses.forEach((course: any) => {
        results.push({
          id: course.uid,
          type: 'course',
          title: course.title,
          description: course.description || '',
          url: `/${platform}/lms/courses/${course.uid}`,
          platform,
          thumbnail: course.thumbnail,
          relevance: this.calculateRelevance(lowerQuery, course.title, course.description),
        });
      });
    }

    if (!types || types.includes('event')) {
      const events = await db.get('events');
      const platformEvents = events.filter((e: any) => e.platform === platform);
      const matchedEvents = platformEvents.filter((e: any) =>
        e.title.toLowerCase().includes(lowerQuery) ||
        e.description?.toLowerCase().includes(lowerQuery)
      );

      matchedEvents.forEach((event: any) => {
        results.push({
          id: event.uid,
          type: 'event',
          title: event.title,
          description: event.description || '',
          url: `/${platform}/events/${event.uid}`,
          platform,
          thumbnail: event.image,
          relevance: this.calculateRelevance(lowerQuery, event.title, event.description),
        });
      });
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  private calculateRelevance(query: string, title: string, description: string): number {
    let score = 0;
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();

    if (titleLower === query) score += 10;
    else if (titleLower.startsWith(query)) score += 7;
    else if (titleLower.includes(query)) score += 5;

    if (descLower.includes(query)) score += 2;

    const words = query.split(' ');
    words.forEach(word => {
      if (titleLower.includes(word)) score += 1;
      if (descLower.includes(word)) score += 0.5;
    });

    return score;
  }

  async getPopularSearches(platform: string, limit: number = 10): Promise<string[]> {
    return [];
  }

  async saveSearch(platform: string, query: string, userId?: string): Promise<void> {
  }
}

export const searchService = new SearchService();
export default searchService;
