import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Calendar, User } from 'lucide-react';

const MasjidBlog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const data = await masjidDB.get('blog_posts');
        setPosts(data.filter(p => p.status === 'published'));
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading Blog...</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            From The <span className="text-primary">Minbar</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, announcements, and reflections from our community leaders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ModernCard key={post.id} variant="glass" className="p-6 flex flex-col group">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        {post.excerpt}
                    </p>
                </div>
              <div className="border-t pt-4 mt-4 text-sm text-muted-foreground flex justify-between items-center">
                <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.author || 'Admin'}</span>
                </div>
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
              <Link to={`/masjid/blog/${post.id}`} className="mt-4">
                <ModernButton className="w-full">
                  Read More
                </ModernButton>
              </Link>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasjidBlog;