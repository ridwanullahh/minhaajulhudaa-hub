import db from '../db';

export interface BlogPost {
  id: string;
  uid: string;
  title: string;
  content: string;
  excerpt: string;
  platform: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  status: 'draft' | 'published' | 'scheduled';
  featured: boolean;
  featuredImage?: string;
  tags: string[];
  categories: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: string;
  uid: string;
  postId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  content: string;
  parentId?: string;
  approved: boolean;
  createdAt: string;
}

class BlogService {
  async getPosts(platform: string, filters?: {
    status?: BlogPost['status'];
    featured?: boolean;
    authorId?: string;
    category?: string;
    tag?: string;
  }): Promise<BlogPost[]> {
    let posts = await db.get<BlogPost>('blog_posts');
    posts = posts.filter(p => p.platform === platform);

    if (filters?.status) {
      posts = posts.filter(p => p.status === filters.status);
    }
    if (filters?.featured !== undefined) {
      posts = posts.filter(p => p.featured === filters.featured);
    }
    if (filters?.authorId) {
      posts = posts.filter(p => p.authorId === filters.authorId);
    }
    if (filters?.category) {
      posts = posts.filter(p => p.categories?.includes(filters.category));
    }
    if (filters?.tag) {
      posts = posts.filter(p => p.tags?.includes(filters.tag));
    }

    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPost(postId: string): Promise<BlogPost | null> {
    const posts = await db.get<BlogPost>('blog_posts');
    return posts.find(p => p.id === postId || p.uid === postId) || null;
  }

  async createPost(postData: Omit<BlogPost, 'id' | 'uid' | 'views' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    return await db.insert<BlogPost>('blog_posts', {
      ...postData,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async updatePost(postId: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    return await db.update<BlogPost>('blog_posts', postId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deletePost(postId: string): Promise<void> {
    await db.delete('blog_posts', postId);
  }

  async incrementViews(postId: string): Promise<void> {
    const post = await this.getPost(postId);
    if (post) {
      await this.updatePost(postId, { views: (post.views || 0) + 1 });
    }
  }

  async getComments(postId: string, approvedOnly: boolean = true): Promise<BlogComment[]> {
    let comments = await db.get<BlogComment>('blog_comments');
    comments = comments.filter(c => c.postId === postId);
    
    if (approvedOnly) {
      comments = comments.filter(c => c.approved);
    }

    return comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createComment(commentData: Omit<BlogComment, 'id' | 'uid' | 'createdAt'>): Promise<BlogComment> {
    return await db.insert<BlogComment>('blog_comments', {
      ...commentData,
      createdAt: new Date().toISOString(),
    });
  }

  async approveComment(commentId: string): Promise<BlogComment> {
    return await db.update<BlogComment>('blog_comments', commentId, { approved: true });
  }

  async deleteComment(commentId: string): Promise<void> {
    await db.delete('blog_comments', commentId);
  }

  async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    const post = await this.getPost(postId);
    if (!post) return [];

    const posts = await this.getPosts(post.platform, { status: 'published' });
    
    const scored = posts
      .filter(p => p.id !== postId && p.uid !== postId)
      .map(p => {
        let score = 0;
        
        p.categories?.forEach(cat => {
          if (post.categories?.includes(cat)) score += 3;
        });
        
        p.tags?.forEach(tag => {
          if (post.tags?.includes(tag)) score += 2;
        });
        
        if (p.authorId === post.authorId) score += 1;
        
        return { post: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(s => s.post);
  }

  async searchPosts(platform: string, query: string): Promise<BlogPost[]> {
    const posts = await this.getPosts(platform, { status: 'published' });
    const lowerQuery = query.toLowerCase();

    return posts.filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      p.categories?.some(cat => cat.toLowerCase().includes(lowerQuery))
    );
  }
}

export const blogService = new BlogService();
export default blogService;
