import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ArrowLeft, CheckCircle, PlayCircle, FileText } from 'lucide-react';

const QuizView = ({ quiz, onComplete }) => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleAnswerChange = (qIndex, aIndex) => {
        setAnswers(prev => ({...prev, [qIndex]: aIndex}));
    }

    const handleSubmit = () => {
        let score = 0;
        quiz.questions.forEach((q, i) => {
            if(answers[i] === q.correct) {
                score++;
            }
        });
        const finalScore = (score / quiz.questions.length) * 100;
        setResult({score: finalScore, total: quiz.questions.length, correct: score});
        // Here you would save the submission to the database
        // schoolDB.insert('quiz_submissions', { ... });
    }

    if(result) {
        return (
            <div>
                <h3 className="text-xl font-bold">Quiz Result</h3>
                <p>You scored: {result.correct} / {result.total} ({result.score.toFixed(2)}%)</p>
                <ModernButton onClick={onComplete} className="mt-4">Close</ModernButton>
            </div>
        )
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">{quiz.title}</h3>
            <div className="space-y-6">
                {quiz.questions.map((q, qIndex) => (
                    <div key={qIndex}>
                        <p className="font-semibold">{qIndex+1}. {q.text}</p>
                        <div className="space-y-2 mt-2">
                            {q.options.map((opt, aIndex) => (
                                <label key={aIndex} className="flex items-center p-2 rounded-lg border has-[:checked]:bg-primary/10">
                                    <input type="radio" name={`q${qIndex}`} onChange={() => handleAnswerChange(qIndex, aIndex)} className="mr-2"/>
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <ModernButton onClick={handleSubmit} className="mt-6">Submit Quiz</ModernButton>
        </div>
    )
}


const PortalCourseSingle = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [quizForLesson, setQuizForLesson] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id]);

  const loadCourseData = async () => {
    setIsLoading(true);
    try {
      const allCourses = await schoolDB.get('courses');
      const foundCourse = allCourses.find(p => p.id === id);
      setCourse(foundCourse);

      if(foundCourse) {
        const allLessons = await schoolDB.get('lessons');
        const courseLessons = allLessons.filter(l => l.courseId === id);
        setLessons(courseLessons);
        if(courseLessons.length > 0) {
            selectLesson(courseLessons[0]);
        }
      }
    } catch (error) { console.error('Error:', error); }
    finally { setIsLoading(false); }
  };

  const selectLesson = async (lesson) => {
      setActiveLesson(lesson);
      setShowQuiz(false);
      const allQuizzes = await schoolDB.get('quizzes');
      const foundQuiz = allQuizzes.find(q => q.lessonId === lesson.id);
      setQuizForLesson(foundQuiz);
  }

  if (isLoading) return <div>Loading...</div>;
  if (!course) return <div>Course Not Found</div>;

  return (
    <div>
        <div className="mb-8">
            <Link to="/school/portal/courses">
                <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to My Courses</ModernButton>
            </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <ModernCard className="p-6">
                    {showQuiz && quizForLesson ? (
                        <QuizView quiz={quizForLesson} onComplete={() => setShowQuiz(false)} />
                    ) : activeLesson ? (
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{activeLesson.title}</h1>
                            {activeLesson.videoUrl && (
                                <div className="aspect-video bg-muted rounded-lg mb-6">
                                    <iframe src={activeLesson.videoUrl.replace('watch?v=', 'embed/')} title={activeLesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg"></iframe>
                                </div>
                            )}
                            <div className="prose max-w-none"><p>{activeLesson.content}</p></div>
                        </div>
                    ) : <p>Select a lesson to begin.</p>}
                </ModernCard>
            </div>

            <div>
                <ModernCard className="p-6">
                    <h2 className="text-xl font-bold mb-4">{course.title}</h2>
                    <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                            <div key={lesson.id} className={`p-3 rounded-lg transition-colors ${activeLesson?.id === lesson.id ? 'bg-primary/10' : ''}`}>
                                <button className="w-full text-left flex items-center" onClick={() => selectLesson(lesson)}>
                                    <PlayCircle className="w-5 h-5 mr-3 text-primary"/>
                                    <span className="flex-grow font-medium">{index + 1}. {lesson.title}</span>
                                </button>
                                {quizForLesson && quizForLesson.lessonId === lesson.id && (
                                    <ModernButton size="sm" className="mt-2 w-full" onClick={() => setShowQuiz(true)}>
                                        <FileText className="w-4 h-4 mr-2"/> Take Quiz
                                    </ModernButton>
                                )}
                            </div>
                        ))}
                    </div>
                </ModernCard>
            </div>
        </div>
    </div>
  );
};

export default PortalCourseSingle;
