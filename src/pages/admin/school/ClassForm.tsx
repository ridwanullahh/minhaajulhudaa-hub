import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const ClassForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState({
    name: '',
    level: '',
    capacity: 0,
    enrolled: 0,
    teacher: '',
    schedule: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadClass();
    }
  }, [id, isEditing]);

  const loadClass = async () => {
    setIsLoading(true);
    try {
      const allItems = await schoolDB.get('classes');
      const foundItem = allItems.find(i => i.id === id);
      if (foundItem) {
        setClassData(foundItem);
      }
    } catch (error) {
      console.error("Error loading class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClassData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSave = {
      ...classData,
      capacity: Number(classData.capacity) || 0,
      enrolled: Number(classData.enrolled) || 0,
    };

    try {
      if (isEditing) {
        await schoolDB.update('classes', id, dataToSave);
      } else {
        await schoolDB.insert('classes', dataToSave);
      }
      navigate('/school/admin/classes');
    } catch (error) {
      console.error("Error saving class:", error);
      alert("Failed to save class.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/classes')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Class' : 'Create New Class'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Class Name (e.g., Grade 1A)</Label>
              <Input id="name" name="name" value={classData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="level">Level (e.g., Elementary)</Label>
              <Input id="level" name="level" value={classData.level} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="teacher">Teacher</Label>
              <Input id="teacher" name="teacher" value={classData.teacher} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="schedule">Schedule (e.g., Mon/Wed/Fri 9-11AM)</Label>
              <Input id="schedule" name="schedule" value={classData.schedule} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" value={classData.capacity} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="enrolled">Enrolled Students</Label>
              <Input id="enrolled" name="enrolled" type="number" value={classData.enrolled} onChange={handleChange} />
            </div>
          </div>
          <div className="p-6 border-t">
            <ModernButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Class'}
            </ModernButton>
          </div>
        </ModernCard>
      </form>
    </div>
  );
};

export default ClassForm;
