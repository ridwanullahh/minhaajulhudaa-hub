import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { charityDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: '',
    description: '',
    location: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await charityDB.get('projects');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await charityDB.update('projects', id, item);
      } else {
        await charityDB.insert('projects', item);
      }
      navigate('/charity/admin/projects');
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
        <Link to="/charity/admin/projects">
            <ModernButton variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
            </ModernButton>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'Create New Project'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><Label>Title</Label><Input name="title" value={item.title} onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" value={item.description} onChange={handleChange} /></div>
            <div><Label>Location</Label><Input name="location" value={item.location} onChange={handleChange} /></div>
            <div><Label>Status</Label><Input name="status" value={item.status} onChange={handleChange} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Project'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default ProjectForm;
