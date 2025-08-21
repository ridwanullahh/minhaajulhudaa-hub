import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const BlogForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    author: '',
    status: 'draft',
    excerpt: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await masjidDB.get('blog_posts');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setPost(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSave = { ...post, publishedAt: new Date().toISOString() };
    try {
      if (isEditing) {
        await masjidDB.update('blog_posts', id, dataToSave);
      } else {
        await masjidDB.insert('blog_posts', dataToSave);
      }
      navigate('/masjid/admin/blog');
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/masjid/admin/blog">
            <ModernButton variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
            </ModernButton>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 space-y-4">
            <div><Label>Title</Label><Input name="title" value={post.title} onChange={handleChange} required /></div>
            <div><Label>Author</Label><Input name="author" value={post.author} onChange={handleChange} /></div>
            <div><Label>Excerpt</Label><Textarea name="excerpt" value={post.excerpt} onChange={handleChange} rows={3} /></div>
            <div><Label>Content</Label><Textarea name="content" value={post.content} onChange={handleChange} rows={15} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Post'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default BlogForm;
