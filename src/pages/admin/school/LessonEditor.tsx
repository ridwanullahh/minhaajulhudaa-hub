import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';

const LessonEditor = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({ title: '', content: '', videoUrl: '' });
  const [quiz, setQuiz] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correct: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLessonData();
  }, [lessonId]);

  const loadLessonData = async () => {
    if (!lessonId) return;
    setIsLoading(true);
    try {
      const allLessons = await schoolDB.get('lessons');
      const foundLesson = allLessons.find(l => l.id === lessonId);
      if (foundLesson) setLesson(foundLesson);

      const allQuizzes = await schoolDB.get('quizzes');
      const foundQuiz = allQuizzes.find(q => q.lessonId === lessonId);
      if (foundQuiz) setQuiz(foundQuiz);

    } catch (error) { console.error("Error loading lesson data:", error); }
    finally { setIsLoading(false); }
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLesson(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await schoolDB.update('lessons', lessonId, lesson);
      alert('Lesson saved!');
    } catch (error) { alert("Failed to save lesson."); }
    finally { setIsLoading(false); }
  };

  const handleQuizCreate = async () => {
    try {
        const newQuiz = await schoolDB.insert('quizzes', { lessonId, title: `${lesson.title} Quiz`, questions: [] });
        setQuiz(newQuiz);
    } catch(e) { alert('Failed to create quiz.'); }
  }

  const handleAddQuestion = async () => {
    if(!quiz || !newQuestion.text) return;
    const updatedQuestions = [...(quiz.questions || []), newQuestion];
    try {
        const updatedQuiz = await schoolDB.update('quizzes', quiz.id, { questions: updatedQuestions });
        setQuiz(updatedQuiz);
        setNewQuestion({ text: '', options: ['', '', '', ''], correct: 0 });
    } catch(e) { alert('Failed to add question'); }
  }

  if (isLoading) return <div>Loading lesson...</div>;

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to={`/school/admin/courses/edit/${courseId}`}>
            <ModernButton variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4" />
            </ModernButton>
        </Link>
        <h1 className="text-2xl font-bold">Edit Lesson: {lesson.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleLessonSubmit}>
            <ModernCard>
            <div className="p-6 space-y-6">
                <div><Label>Lesson Title</Label><Input name="title" value={lesson.title} onChange={handleLessonChange} /></div>
                <div><Label>Video URL</Label><Input name="videoUrl" value={lesson.videoUrl} onChange={handleLessonChange} /></div>
                <div><Label>Content</Label><Textarea name="content" value={lesson.content} onChange={handleLessonChange} rows={15} /></div>
            </div>
            <div className="p-6 border-t"><ModernButton type="submit">Save Lesson Content</ModernButton></div>
            </ModernCard>
        </form>

        <ModernCard>
            <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Manage Quiz</h3>
                {!quiz ? (
                    <ModernButton onClick={handleQuizCreate}>Create Quiz for this Lesson</ModernButton>
                ) : (
                    <div>
                        <h4 className="font-bold mb-2">{quiz.title}</h4>
                        <div className="space-y-2 mb-4">
                            {quiz.questions?.map((q, i) => <div key={i} className="p-2 bg-muted rounded">{q.text}</div>)}
                        </div>
                        <div className="p-4 border rounded-lg space-y-2">
                            <h5 className="font-semibold">Add New Question</h5>
                            <Input placeholder="Question text" value={newQuestion.text} onChange={(e) => setNewQuestion(p => ({...p, text: e.target.value}))}/>
                            {newQuestion.options.map((opt, i) => <Input key={i} placeholder={`Option ${i+1}`} value={opt} onChange={(e) => {
                                const opts = [...newQuestion.options]; opts[i] = e.target.value; setNewQuestion(p => ({...p, options: opts}));
                            }}/>)}
                            <Input placeholder="Correct option index (0-3)" type="number" value={newQuestion.correct} onChange={(e) => setNewQuestion(p => ({...p, correct: Number(e.target.value)}))}/>
                            <ModernButton onClick={handleAddQuestion}>Add Question</ModernButton>
                        </div>
                    </div>
                )}
            </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default LessonEditor;
