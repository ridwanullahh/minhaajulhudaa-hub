import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  Calendar,
  User,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Eye,
  MessageCircle,
  Tag,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Mail
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

interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  likes: number;
}

const SchoolBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const posts = await schoolDB.get('blog_posts');
      const foundPost = posts.find(p => p.id === id);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Increment view count
        await schoolDB.update('blog_posts', id, {
          ...foundPost,
          views: (foundPost.views || 0) + 1
        });

        // Load related posts
        const related = posts
          .filter(p => p.id !== id && p.category === foundPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    
    try {
      const allComments = await schoolDB.get('blog_comments');
      const postComments = allComments.filter(c => c.postId === id);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;

    try {
      await schoolDB.update('blog_posts', post.id, {
        ...post,
        likes: post.likes + 1
      });
      
      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      setLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !newComment.trim() || !commentAuthor.trim() || !commentEmail.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        postId: id,
        author: commentAuthor,
        email: commentEmail,
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0
      };

      await schoolDB.insert('blog_comments', comment);
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setCommentAuthor('');
      setCommentEmail('');
      
      // Update comment count on post
      if (post) {
        await schoolDB.update('blog_posts', post.id, {
          ...post,
          comments: post.comments + 1
        });
        setPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const sharePost = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const text = post.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/school/blog">
            <ModernButton size="lg">
              Back to Blog
            </ModernButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/school/blog">
            <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Blog
            </ModernButton>
          </Link>
        </div>

        {/* Article Header */}
        <ModernCard variant="glass" className="mb-8 overflow-hidden">
          <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden mb-8">
            <div className="w-full h-64 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
              <div className="text-amber-600/30">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
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

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-amber-600 font-medium capitalize">
                {post.category}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime} min read
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.publishDate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-1" />
                  <span>{post.views}</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center ${liked ? 'text-red-500' : 'hover:text-red-500'} transition-colors`}
                >
                  <Heart className={`w-5 h-5 mr-1 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-1" />
                  <span>{post.comments}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => sharePost('facebook')}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => sharePost('twitter')}
                  className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => sharePost('email')}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Article Content */}
        <ModernCard variant="glass" className="mb-8 p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              {post.content}
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Key Takeaways</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Islamic education provides a strong foundation of faith</li>
                <li>Modern teaching methods enhance traditional Islamic learning</li>
                <li>Character development is central to our educational approach</li>
                <li>Parental involvement significantly impacts student success</li>
              </ul>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 mb-8">
              <h4 className="font-bold text-amber-800 mb-2">About the Author</h4>
              <p className="text-amber-700">
                {post.author} is an experienced educator and Islamic scholar dedicated to providing 
                quality Islamic education that prepares students for success in this world and the hereafter.
              </p>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <Tag className="w-5 h-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </ModernCard>

        {/* Comments Section */}
        <ModernCard variant="glass" className="mb-8 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment *
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                required
              />
            </div>
            <ModernButton type="submit">
              Post Comment
            </ModernButton>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{comment.author}</h4>
                      <p className="text-sm text-gray-500">{formatCommentDate(comment.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 ml-13">{comment.content}</p>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </ModernCard>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <ModernCard variant="glass" className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/school/blog/${relatedPost.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-w-16 aspect-h-10 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-32 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                        <div className="text-amber-600/30">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 group-hover:text-amber-600 transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ModernCard>
        )}
      </div>
    </div>
  );
};

export default SchoolBlogPost;