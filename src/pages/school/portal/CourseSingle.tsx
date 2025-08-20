import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ArrowLeft, CheckCircle, PlayCircle, Lock } from 'lucide-react';

const PortalCourseSingle = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
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
                setActiveLesson(courseLessons[0]); // Set first lesson as active
            }
          }
        } catch (error) {
          console.error('Error loading course data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadCourseData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20">Loading Course...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl mb-4">Course Not Found</h1>
        <Link to="/school/portal/courses"><ModernButton>Back to My Courses</ModernButton></Link>
      </div>
    );
  }

  return (
    <div>
        <div className="mb-8">
            <Link to="/school/portal/courses">
                <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to My Courses
                </ModernButton>
            </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lesson Content */}
            <div className="lg:col-span-2">
                <ModernCard className="p-6">
                    {activeLesson ? (
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{activeLesson.title}</h1>
                            {activeLesson.videoUrl && (
                                <div className="aspect-video bg-muted rounded-lg mb-6">
                                    <iframe
                                        src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                                        title={activeLesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full rounded-lg"
                                    ></iframe>
                                </div>
                            )}
                            <div className="prose max-w-none">
                                <p>{activeLesson.content}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Select a lesson to begin.</p>
                    )}
                </ModernCard>
            </div>

            {/* Lesson List */}
            <div>
                <ModernCard className="p-6">
                    <h2 className="text-xl font-bold mb-4">{course.title}</h2>
                    <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                            <button
                                key={lesson.id}
                                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${activeLesson?.id === lesson.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                                onClick={() => setActiveLesson(lesson)}
                            >
                                <PlayCircle className="w-5 h-5 mr-3"/>
                                <span className="flex-grow font-medium">{index + 1}. {lesson.title}</span>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </button>
                        ))}
                    </div>
                </ModernCard>
            </div>
        </div>
    </div>
  );
};

export default PortalCourseSingle;
