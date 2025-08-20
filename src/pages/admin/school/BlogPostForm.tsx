import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: '', // Storing tags as a comma-separated string for simplicity
    status: 'draft',
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id, isEditing]);

  const loadPost = async () => {
    setIsLoading(true);
    try {
      const allPosts = await schoolDB.get('blog_posts');
      const foundPost = allPosts.find(p => p.id === id);
      if (foundPost) {
        setPost({
          ...foundPost,
          tags: Array.isArray(foundPost.tags) ? foundPost.tags.join(', ') : '',
        });
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPost(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = {
      ...post,
      tags: post.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      publishDate: post.status === 'published' ? new Date().toISOString() : null,
    };

    try {
      if (isEditing) {
        await schoolDB.update('blog_posts', id, postData);
      } else {
        await schoolDB.insert('blog_posts', postData);
      }
      navigate('/school/admin/blog');
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/blog')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ModernCard>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={post.title} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" name="content" value={post.content} onChange={handleChange} rows={15} required />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" name="excerpt" value={post.excerpt} onChange={handleChange} rows={3} />
                  </div>
                </div>
              </div>
            </ModernCard>
          </div>
          <div className="space-y-6">
            <ModernCard>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" value={post.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Post</Label>
                  <Switch id="featured" name="featured" checked={post.featured} onCheckedChange={(checked) => handleSwitchChange('featured', checked)} />
                </div>
              </div>
            </ModernCard>
            <ModernCard>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" name="author" value={post.author} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={post.category} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" name="tags" value={post.tags} onChange={handleChange} />
                </div>
              </div>
            </ModernCard>
            <ModernButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Post'}
            </ModernButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
