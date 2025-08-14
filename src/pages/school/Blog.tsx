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
    try {
      const data = await schoolDB.get('blog_posts');

      if (data.length === 0) {
        // Initialize with sample blog posts
        const samplePosts = [
          {
            title: 'The Importance of Islamic Education in Modern Times',
            content: 'In today\'s rapidly changing world, Islamic education plays a crucial role in shaping the minds and hearts of our children. It provides a strong foundation of faith while equipping them with the knowledge and skills needed to navigate modern challenges...',
            excerpt: 'Discover how Islamic education prepares students for success in both this world and the hereafter.',
            author: 'Dr. Amina Khan',
            publishDate: '2024-01-15',
            category: 'education',
            tags: ['islamic-education', 'modern-times', 'parenting'],
            image: '/images/islamic-education.jpg',
            readTime: 5,
            views: 1245,
            likes: 89,
            comments: 23,
            featured: true,
            status: 'published'
          },
          {
            title: 'Integrating Technology in Islamic Schools',
            content: 'Technology has transformed education across the globe, and Islamic schools are no exception. By carefully integrating digital tools and platforms, we can enhance learning while maintaining our Islamic values and principles...',
            excerpt: 'Learn how our school uses technology to enhance Islamic education while preserving traditional values.',
            author: 'Ahmed Hassan',
            publishDate: '2024-01-10',
            category: 'technology',
            tags: ['technology', 'innovation', 'digital-learning'],
            image: '/images/tech-in-islamic-schools.jpg',
            readTime: 4,
            views: 892,
            likes: 67,
            comments: 15,
            featured: false,
            status: 'published'
          },
          {
            title: 'Building Character Through Islamic Values',
            content: 'Character development is at the heart of Islamic education. Our comprehensive approach focuses on instilling core Islamic values that guide students\' behavior and decision-making throughout their lives...',
            excerpt: 'Explore our character development program rooted in Islamic teachings and values.',
            author: 'Fatima Ahmed',
            publishDate: '2024-01-05',
            category: 'character-development',
            tags: ['character', 'islamic-values', 'moral-development'],
            image: '/images/character-development.jpg',
            readTime: 6,
            views: 1567,
            likes: 112,
            comments: 34,
            featured: true,
            status: 'published'
          },
          {
            title: 'The Role of Parents in Islamic Education',
            content: 'Parental involvement is crucial for the success of Islamic education. When parents and schools work together, students thrive academically, spiritually, and emotionally...',
            excerpt: 'Discover how parents can actively participate in their child\'s Islamic education journey.',
            author: 'Yusuf Ibrahim',
            publishDate: '2023-12-28',
            category: 'parenting',
            tags: ['parenting', 'family', 'collaboration'],
            image: '/images/parental-involvement.jpg',
            readTime: 7,
            views: 2103,
            likes: 145,
            comments: 42,
            featured: false,
            status: 'published'
          },
          {
            title: 'Preparing Students for Higher Education',
            content: 'Our comprehensive academic program prepares students for success in higher education while maintaining their Islamic identity. We focus on developing critical thinking skills and academic excellence...',
            excerpt: 'Learn how our curriculum prepares students for university success with Islamic foundations.',
            author: 'Dr. Sarah Mohammed',
            publishDate: '2023-12-20',
            category: 'academics',
            tags: ['higher-education', 'university', 'academic-preparation'],
            image: '/images/higher-education.jpg',
            readTime: 5,
            views: 1876,
            likes: 98,
            comments: 28,
            featured: false,
            status: 'published'
          },
          {
            title: 'Extracurricular Activities in Islamic Schools',
            content: 'Beyond academics, extracurricular activities play a vital role in developing well-rounded individuals. Our diverse programs help students discover their talents and build lasting friendships...',
            excerpt: 'Explore our range of extracurricular activities that complement Islamic education.',
            author: 'Omar Khalid',
            publishDate: '2023-12-15',
            category: 'activities',
            tags: ['extracurricular', 'sports', 'arts', 'clubs'],
            image: '/images/extracurricular-activities.jpg',
            readTime: 4,
            views: 1432,
            likes: 87,
            comments: 19,
            featured: false,
            status: 'published'
          }
        ];

        for (const post of samplePosts) {
          await schoolDB.insert('blog_posts', post);
        }
        setPosts(samplePosts as BlogPost[]);
      } else {
        setPosts(data);
      }
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
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            School <span className="text-amber-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Insights, updates, and stories from our Islamic school community. 
            Stay informed about educational developments, student achievements, and Islamic perspectives.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
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
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {/* Featured Posts */}
        {filteredPosts.filter(post => post.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Featured Posts</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredPosts.filter(post => post.featured).slice(0, 2).map((post) => (
                <ModernCard
                  key={post.id}
                  variant="glass"
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                      <div className="text-amber-600/30">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-amber-600 font-medium capitalize">
                        {post.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime} min read
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.publishDate)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
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
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                  <div className="text-amber-600/30">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>

                {post.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-amber-600 font-medium capitalize">
                    {post.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime} min read
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishDate)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Subscribe to our newsletter for the latest updates from our school community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
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