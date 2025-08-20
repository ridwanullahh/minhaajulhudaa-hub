import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
  Tag,
  Eye,
  MessageCircle
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  status: 'published' | 'draft';
}

const SchoolBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await schoolDB.get('blog_posts');
      setPosts(data as BlogPost[]);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'popular':
          return b.views - a.views;
        case 'most-liked':
          return b.likes - a.likes;
        case 'most-commented':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'education', name: 'Education' },
    { id: 'technology', name: 'Technology' },
    { id: 'character-development', name: 'Character Development' },
    { id: 'parenting', name: 'Parenting' },
    { id: 'academics', name: 'Academics' },
    { id: 'activities', name: 'Activities' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'oldest', name: 'Oldest First' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'most-liked', name: 'Most Liked' },
    { id: 'most-commented', name: 'Most Commented' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            School <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Insights, updates, and stories from our Islamic school community. 
            Stay informed about educational developments, student achievements, and Islamic perspectives.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-background rounded-2xl shadow-lg p-6 mb-12 border">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {/* Featured Posts */}
        {filteredPosts.filter(post => post.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">Featured Posts</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredPosts.filter(post => post.featured).slice(0, 2).map((post) => (
                <ModernCard
                  key={post.id}
                  variant="glass"
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-10 bg-muted relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-primary/30">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-primary font-medium capitalize">
                        {post.category}
                      </span>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime} min read
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.publishDate)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>

                      <Link to={`/school/blog/${post.id}`}>
                        <ModernButton size="sm">
                          Read More
                        </ModernButton>
                      </Link>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <ModernCard
              key={post.id}
              variant="glass"
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="aspect-w-16 aspect-h-10 bg-muted relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-primary/30">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>

                {post.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-primary font-medium capitalize">
                    {post.category}
                  </span>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime} min read
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishDate)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views}
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </div>
                  </div>

                  <Link to={`/school/blog/${post.id}`}>
                    <ModernButton size="sm">
                      Read More
                    </ModernButton>
                  </Link>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest updates from our school community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
              <ModernButton size="lg">
                Subscribe
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolBlog;