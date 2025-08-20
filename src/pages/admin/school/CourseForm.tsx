import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [lessons, setLessons] = useState([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadCourseAndLessons();
    }
  }, [id, isEditing]);

  const loadCourseAndLessons = async () => {
    setIsLoading(true);
    try {
      const allCourses = await schoolDB.get('courses');
      const foundCourse = allCourses.find(c => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);
        const allLessons = await schoolDB.get('lessons');
        const courseLessons = allLessons.filter(l => l.courseId === id);
        setLessons(courseLessons);
      }
    } catch (error) {
      console.error("Error loading course and lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !id) return;
    try {
        const newLesson = await schoolDB.insert('lessons', {
            title: newLessonTitle,
            courseId: id,
            content: ''
        });
        setLessons(prev => [...prev, newLesson]);
        setNewLessonTitle('');
    } catch(e) {
        console.error("Failed to add lesson", e);
        alert("Failed to add lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if(window.confirm('Are you sure you want to delete this lesson?')) {
        try {
            await schoolDB.delete('lessons', lessonId);
            setLessons(prev => prev.filter(l => l.id !== lessonId));
        } catch(e) {
            console.error("Failed to delete lesson", e);
            alert("Failed to delete lesson");
        }
    }
  }

  const handleCourseSubmit = async (e: React.FormEvent) => {
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
        // For a new course, we would save it first, get an ID, then allow adding lessons.
        // For simplicity, we'll just save and redirect.
        const newCourse = await schoolDB.insert('courses', dataToSave);
        navigate(`/school/admin/courses/edit/${newCourse.id}`);
        return;
      }
      alert("Course saved successfully!");
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <form onSubmit={handleCourseSubmit}>
                <ModernCard>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2"><Label>Course Title</Label><Input name="title" value={course.title} onChange={handleCourseChange} required /></div>
                    <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" value={course.description} onChange={handleCourseChange} /></div>
                    <div><Label>Instructor</Label><Input name="instructor" value={course.instructor} onChange={handleCourseChange} required /></div>
                    <div><Label>Level</Label><Input name="level" value={course.level} onChange={handleCourseChange} /></div>
                    <div><Label>Duration (hours)</Label><Input name="duration" type="number" value={course.duration} onChange={handleCourseChange} /></div>
                    <div><Label>Price</Label><Input name="price" type="number" value={course.price} onChange={handleCourseChange} /></div>
                    <div className="md:col-span-2"><Label>Status</Label><Input name="status" value={course.status} onChange={handleCourseChange} /></div>
                </div>
                <div className="p-6 border-t">
                    <ModernButton type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Course Details'}</ModernButton>
                </div>
                </ModernCard>
            </form>
        </div>
        <div>
            <ModernCard>
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Manage Lessons</h3>
                    {isEditing ? (
                        <div>
                            <div className="space-y-2 mb-4">
                                {lessons.map(lesson => (
                                    <div key={lesson.id} className="flex items-center justify-between p-2 bg-muted rounded-lg group">
                                        <Link to={`/school/admin/courses/edit/${id}/lessons/${lesson.id}`} className="flex-grow hover:text-primary">{lesson.title}</Link>
                                        <div>
                                            <Link to={`/school/admin/courses/edit/${id}/lessons/${lesson.id}`}>
                                                <ModernButton variant="ghost" size="icon"><Edit className="w-4 h-4"/></ModernButton>
                                            </Link>
                                            <ModernButton variant="ghost" size="icon" onClick={() => handleDeleteLesson(lesson.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500"/>
                                            </ModernButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="New lesson title" />
                                <ModernButton onClick={handleAddLesson} leftIcon={<PlusCircle className="w-4 h-4"/>}>Add</ModernButton>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Save the course first to add lessons.</p>
                    )}
                </div>
            </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
