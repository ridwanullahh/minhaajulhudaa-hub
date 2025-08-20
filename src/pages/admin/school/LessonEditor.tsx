import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const LessonEditor = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    videoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      setIsLoading(true);
      try {
        const allLessons = await schoolDB.get('lessons');
        const foundLesson = allLessons.find(l => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        }
      } catch (error) {
        console.error("Error loading lesson:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLesson(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await schoolDB.update('lessons', lessonId, lesson);
      alert('Lesson saved successfully!');
      navigate(`/school/admin/courses/edit/${courseId}`);
    } catch (error) {
      console.error("Error saving lesson:", error);
      alert("Failed to save lesson.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading lesson...</div>

  return (
    <div>
      <div className="flex items-center mb-6">
        <ModernButton variant="outline" size="sm" onClick={() => navigate(`/school/admin/courses/edit/${courseId}`)} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </ModernButton>
        <h1 className="text-2xl font-bold text-foreground">
          Edit Lesson: {lesson.title}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <ModernCard>
          <div className="p-6 space-y-6">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input id="title" name="title" value={lesson.title} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL (optional)</Label>
              <Input id="videoUrl" name="videoUrl" value={lesson.videoUrl} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="content">Lesson Content (Markdown supported)</Label>
              <Textarea id="content" name="content" value={lesson.content} onChange={handleChange} rows={20} />
            </div>
          </div>
          <div className="p-6 border-t">
            <ModernButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Lesson'}
            </ModernButton>
          </div>
        </ModernCard>
      </form>
    </div>
  );
};

export default LessonEditor;
