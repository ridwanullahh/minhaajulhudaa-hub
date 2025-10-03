import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/db';

interface Exam {
  id: string;
  title: string;
  duration: number;
  totalPoints: number;
}

interface Question {
  id: string;
  examId: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
}

export const ExamTaker: React.FC = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attemptId, setAttemptId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId || !user) return;

      try {
        const [exams, allQuestions] = await Promise.all([
          db.get('exams'),
          db.get('exam_questions'),
        ]);

        const foundExam = exams.find(e => e.id === examId);
        if (!foundExam) {
          toast({ title: 'Error', description: 'Exam not found', variant: 'destructive' });
          navigate('/school/exams');
          return;
        }

        setExam(foundExam);
        const examQuestions = allQuestions
          .filter((q: Question) => q.examId === examId)
          .sort((a: Question, b: Question) => a.order - b.order);
        setQuestions(examQuestions);
        setTimeRemaining(foundExam.duration * 60);

        const attempt = await db.insert('exam_attempts', {
          examId,
          studentId: user.uid,
          startedAt: new Date().toISOString(),
          status: 'in-progress',
          answers: {},
        });
        setAttemptId(attempt.uid);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load exam', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, user, navigate, toast]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!attemptId || !exam) return;

    try {
      let score = 0;
      questions.forEach(q => {
        if (q.type === 'multiple-choice' || q.type === 'true-false') {
          if (answers[q.id] === q.correctAnswer) {
            score += q.points;
          }
        }
      });

      const percentage = (score / exam.totalPoints) * 100;

      await db.update('exam_attempts', attemptId, {
        submittedAt: new Date().toISOString(),
        timeSpent: (exam.duration * 60) - timeRemaining,
        score,
        percentage,
        status: 'completed',
        answers,
      });

      toast({ title: 'Success', description: 'Exam submitted successfully' });
      navigate(`/school/exams/results/${attemptId}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit exam', variant: 'destructive' });
    }
  }, [attemptId, exam, answers, questions, timeRemaining, navigate, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading exam...</div>;
  }

  if (!exam || questions.length === 0) {
    return <div className="container mx-auto p-6">No questions found for this exam.</div>;
  }

  const currentQ = questions[currentQuestion];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{exam.title}</CardTitle>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5" />
            <span className={timeRemaining < 300 ? 'text-red-500' : ''}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">{currentQ.points} points</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{currentQ.question}</p>

          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              {currentQ.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === 'true-false' && (
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </RadioGroup>
          )}

          {(currentQ.type === 'short-answer' || currentQ.type === 'essay') && (
            <Textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Type your answer here..."
              rows={currentQ.type === 'essay' ? 10 : 3}
            />
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit Exam
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            {questions.map((_, idx) => (
              <Button
                key={idx}
                variant={currentQuestion === idx ? 'default' : answers[questions[idx].id] ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamTaker;
