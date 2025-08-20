import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const CourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: 0,
    level: '',
    price: 0,
    status: 'upcoming'
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadCourse();
    }
  }, [id, isEditing]);

  const loadCourse = async () => {
    setIsLoading(true);
    try {
      const allCourses = await schoolDB.get('courses');
      const foundCourse = allCourses.find(c => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSave = {
      ...course,
      price: Number(course.price) || 0,
      duration: Number(course.duration) || 0,
    };

    try {
      if (isEditing) {
        await schoolDB.update('courses', id, dataToSave);
      } else {
        await schoolDB.insert('courses', dataToSave);
      }
      navigate('/school/admin/courses');
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate('/school/admin/courses')} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" name="title" value={course.title} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={course.description} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input id="instructor" name="instructor" value={course.instructor} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="level">Level (e.g., Beginner, Advanced)</Label>
              <Input id="level" name="level" value={course.level} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="duration">Duration (in hours)</Label>
              <Input id="duration" name="duration" type="number" value={course.duration} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" value={course.price} onChange={handleChange} />
            </div>
             <div className="md:col-span-2">
              <Label htmlFor="status">Status (e.g., active, upcoming, archived)</Label>
              <Input id="status" name="status" value={course.status} onChange={handleChange} />
            </div>
          </div>
          <div className="p-6 border-t">
            <ModernButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Course'}
            </ModernButton>
          </div>
        </ModernCard>
      </form>
    </div>
  );
};

export default CourseForm;
