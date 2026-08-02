import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ArrowLeft, Plus, Trash2, Save, FileQuestion } from 'lucide-react';
import { toast } from 'sonner';

/**
 * QuizBuilder
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Allows a teacher to create a quiz with multiple-choice questions.
 * Each question has a text, 4 options, and a correct answer index.
 * The quiz is saved to the lms_lessons collection with type='quiz'.
 *
 * Accessible at /school/portal/quiz-builder.
 */
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

const QuizBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    if (!courseId.trim()) {
      toast.error('Please select a course');
      return;
    }
    if (questions.some((q) => !q.question.trim() || q.options.some((o) => !o.trim()))) {
      toast.error('Please complete all questions and options');
      return;
    }

    setSaving(true);
    try {
      await schoolDB.insert('lms_lessons', {
        title,
        description,
        courseId,
        type: 'quiz',
        content: JSON.stringify({ questions }),
        published: false,
        duration: questions.length * 2,
        order: 0,
      });
      toast.success('Quiz created successfully');
      navigate('/school/portal/teacher');
    } catch (err: any) {
      console.error('Error saving quiz:', err);
      toast.error('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/school/portal/teacher')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teacher Portal
        </button>

        <div className="flex items-center gap-3 mb-8">
          <FileQuestion className="h-6 w-6 text-platform-accent" />
          <h1 className="text-2xl font-bold text-foreground">Quiz Builder</h1>
        </div>

        {/* Quiz details */}
        <ModernCard className="mb-6">
          <h2 className="font-semibold text-foreground mb-4">Quiz Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Surah Al-Fatihah Quiz"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Course ID</label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter the course ID"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the quiz..."
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </ModernCard>

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <ModernCard key={qIndex} className="mb-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-foreground">Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-destructive hover:text-destructive/80 p-1"
                  aria-label="Remove question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Question</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder="Enter the question..."
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Options (select the correct one)</label>
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswer === optIndex}
                        onChange={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                        className="text-platform-accent"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Points</label>
                <input
                  type="number"
                  value={q.points}
                  onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-24 h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </ModernCard>
        ))}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <ModernButton variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4" />
            Add Question
          </ModernButton>
          <ModernButton onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Quiz'}
          </ModernButton>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
