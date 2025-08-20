import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const AudioForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState({
    title: '',
    speaker: '',
    category: '',
    url: '',
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const loadItem = async () => {
        setIsLoading(true);
        try {
          const items = await masjidDB.get('audio_library');
          const foundItem = items.find(i => i.id === id);
          if (foundItem) setTrack(foundItem);
        } catch (error) { console.error("Error:", error); }
        finally { setIsLoading(false); }
      };
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrack(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await masjidDB.update('audio_library', id, track);
      } else {
        await masjidDB.insert('audio_library', track);
      }
      navigate('/masjid/admin/audio');
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
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/masjid/admin/audio')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Audio Track' : 'Add New Audio Track'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><Label>Title</Label><Input name="title" value={track.title} onChange={handleChange} required /></div>
            <div><Label>Speaker</Label><Input name="speaker" value={track.speaker} onChange={handleChange} required /></div>
            <div><Label>Category</Label><Input name="category" value={track.category} onChange={handleChange} /></div>
            <div className="md:col-span-2"><Label>Audio URL</Label><Input name="url" type="url" value={track.url} onChange={handleChange} required /></div>
            <div><Label>Duration (e.g., 01:15:30)</Label><Input name="duration" value={track.duration} onChange={handleChange} /></div>
          </div>
          <div className="p-6 border-t"><ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Track'}</ModernButton></div>
        </ModernCard>
      </form>
    </div>
  );
};

export default AudioForm;
