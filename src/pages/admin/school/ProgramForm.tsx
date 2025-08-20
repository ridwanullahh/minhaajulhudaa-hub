import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const ProgramForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState({
    title: '',
    description: '',
    type: '',
    duration: '',
    requirements: '', // Storing as comma-separated string
    benefits: '' // Storing as comma-separated string
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadProgram();
    }
  }, [id, isEditing]);

  const loadProgram = async () => {
    setIsLoading(true);
    try {
      const allItems = await schoolDB.get('programs');
      const foundItem = allItems.find(i => i.id === id);
      if (foundItem) {
        setProgram({
            ...foundItem,
            requirements: Array.isArray(foundItem.requirements) ? foundItem.requirements.join(', ') : '',
            benefits: Array.isArray(foundItem.benefits) ? foundItem.benefits.join(', ') : '',
        });
      }
    } catch (error) {
      console.error("Error loading program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgram(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSave = {
      ...program,
      requirements: program.requirements.split(',').map(s => s.trim()).filter(Boolean),
      benefits: program.benefits.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await schoolDB.update('programs', id, dataToSave);
      } else {
        await schoolDB.insert('programs', dataToSave);
      }
      navigate('/school/admin/programs');
    } catch (error) {
      console.error("Error saving program:", error);
      alert("Failed to save program.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/programs')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Program' : 'Create New Program'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Program Title</Label>
              <Input id="title" name="title" value={program.title} onChange={handleChange} required />
            </div>
             <div>
              <Label htmlFor="type">Type (e.g., Hifz, Academic)</Label>
              <Input id="type" name="type" value={program.type} onChange={handleChange} required />
            </div>
             <div>
              <Label htmlFor="duration">Duration (e.g., 3 Years)</Label>
              <Input id="duration" name="duration" value={program.duration} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={program.description} onChange={handleChange} rows={5} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <Textarea id="requirements" name="requirements" value={program.requirements} onChange={handleChange} rows={3} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="benefits">Benefits (comma-separated)</Label>
              <Textarea id="benefits" name="benefits" value={program.benefits} onChange={handleChange} rows={3} />
            </div>
          </div>
          <div className="p-6 border-t">
            <ModernButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Program'}
            </ModernButton>
          </div>
        </ModernCard>
      </form>
    </div>
  );
};

export default ProgramForm;
