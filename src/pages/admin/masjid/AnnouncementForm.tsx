import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const AnnouncementForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: '',
    content: '',
    priority: 'normal',
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await masjidDB.get('announcements');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setItem(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setItem(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await masjidDB.update('announcements', id, item);
      } else {
        await masjidDB.insert('announcements', item);
      }
      navigate('/masjid/admin/announcements');
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
        <Link to="/masjid/admin/announcements">
            <ModernButton variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
            </ModernButton>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 space-y-4">
            <div><Label>Title</Label><Input name="title" value={item.title} onChange={handleChange} required /></div>
            <div><Label>Content</Label><Textarea name="content" value={item.content} onChange={handleChange} rows={10} /></div>
            <div><Label>Priority</Label><Input name="priority" value={item.priority} onChange={handleChange} /></div>
            <div className="flex items-center justify-between"><Label>Active</Label><Switch name="active" checked={item.active} onCheckedChange={(checked) => handleSwitchChange('active', checked)} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Announcement'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default AnnouncementForm;
