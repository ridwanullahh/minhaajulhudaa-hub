import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { travelsDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const PackageForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'Umrah',
    duration: 14,
    available: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await travelsDB.get('packages');
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
    const dataToSave = { ...item, price: Number(item.price) || 0, duration: Number(item.duration) || 0 };
    try {
      if (isEditing) {
        await travelsDB.update('packages', id, dataToSave);
      } else {
        await travelsDB.insert('packages', dataToSave);
      }
      navigate('/travels/admin/packages');
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
        <Link to="/travels/admin/packages">
            <ModernButton variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
            </ModernButton>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Package' : 'Create New Package'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><Label>Title</Label><Input name="title" value={item.title} onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" value={item.description} onChange={handleChange} /></div>
            <div><Label>Price (USD)</Label><Input name="price" type="number" value={item.price} onChange={handleChange} /></div>
            <div><Label>Duration (days)</Label><Input name="duration" type="number" value={item.duration} onChange={handleChange} /></div>
            <div><Label>Type (e.g., Hajj, Umrah, Tour)</Label><Input name="type" value={item.type} onChange={handleChange} /></div>
            <div className="flex items-center justify-between"><Label>Available</Label><Switch name="available" checked={item.available} onCheckedChange={(checked) => handleSwitchChange('available', checked)} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Package'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default PackageForm;
