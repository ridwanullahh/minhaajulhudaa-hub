import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { charityDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const CampaignForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: '',
    description: '',
    goal: 0,
    raised: 0,
    status: 'active',
    category: '',
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await charityDB.get('campaigns');
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
    const dataToSave = { ...item, goal: Number(item.goal) || 0, raised: Number(item.raised) || 0 };
    try {
      if (isEditing) {
        await charityDB.update('campaigns', id, dataToSave);
      } else {
        await charityDB.insert('campaigns', dataToSave);
      }
      navigate('/charity/admin/campaigns');
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
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/charity/admin/campaigns')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Campaign' : 'Create New Campaign'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><Label>Title</Label><Input name="title" value={item.title} onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" value={item.description} onChange={handleChange} /></div>
            <div><Label>Goal Amount</Label><Input name="goal" type="number" value={item.goal} onChange={handleChange} /></div>
            <div><Label>Amount Raised</Label><Input name="raised" type="number" value={item.raised} onChange={handleChange} /></div>
            <div><Label>Category</Label><Input name="category" value={item.category} onChange={handleChange} /></div>
            <div><Label>Status</Label><Input name="status" value={item.status} onChange={handleChange} /></div>
            <div className="flex items-center justify-between md:col-span-2"><Label>Featured Campaign</Label><Switch name="featured" checked={item.featured} onCheckedChange={(checked) => handleSwitchChange('featured', checked)} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Campaign'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default CampaignForm;
