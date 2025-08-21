import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';

import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadPost = async () => {
        setIsLoading(true);
        try {
          const allItems = await masjidDB.get('blog_posts');
          const foundItem = allItems.find(p => p.id === id);
          setPost(foundItem);
        } catch (error) {
          console.error('Error loading post:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadPost();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading Post...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl mb-4">Post Not Found</h1>
        <Link to="/masjid/blog"><ModernButton>Back to Blog</ModernButton></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/masjid/blog">
            <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Blog
            </ModernButton>
          </Link>
        </div>

        <ModernCard variant="glass" className="p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mb-6 border-b pb-6">
                <div className="flex items-center"><User className="w-4 h-4 mr-2"/>{post.author || 'Admin'}</div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2"/>{formatDate(post.publishedAt)}</div>
            </div>
            <div className="prose max-w-none text-foreground/90">
                <p>{post.content}</p>
            </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default BlogPost;