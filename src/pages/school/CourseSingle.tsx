import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ArrowLeft, BookOpen, Clock, User, CheckCircle, PlayCircle } from 'lucide-react';

const SchoolCourseSingle = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const studentId = '1'; // This would be dynamic from auth

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

  const handleEnroll = async () => {
      if(!course || !studentId) return;
      try {
        await schoolDB.insert('enrollments', {
            studentId,
            courseId: course.id,
            enrolledAt: new Date().toISOString(),
            progress: 0
        });
        alert(`Successfully enrolled in ${course.title}!`);
      } catch(e) {
          console.error("Enrollment failed", e);
          alert("Failed to enroll in course.");
      }
  }

  if (isLoading) {
    return <div className="text-center py-20">Loading Course...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl mb-4">Course Not Found</h1>
        <Link to="/school/courses"><ModernButton>Back to Courses</ModernButton></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Course Details */}
        <div className="lg:col-span-2">
            <div className="mb-8">
                <Link to="/school/courses">
                    <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to All Courses
                    </ModernButton>
                </Link>
            </div>
            <ModernCard variant="glass" className="p-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{course.title}</h1>
                <div className="flex items-center text-muted-foreground mb-6">
                    <User className="w-4 h-4 mr-2" />
                    <span>Instructor: {course.instructor}</span>
                </div>
                <p className="text-foreground/80 mb-6">{course.description}</p>
                <ModernButton size="lg" onClick={handleEnroll}>Enroll Now (${course.price})</ModernButton>
            </ModernCard>
        </div>

        {/* Lesson List */}
        <div>
             <ModernCard className="p-6 mt-16">
                <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
                <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center p-3 bg-muted rounded-lg">
                            <PlayCircle className="w-6 h-6 text-primary mr-4"/>
                            <div className="flex-grow">
                                <p className="font-semibold">{index + 1}. {lesson.title}</p>
                            </div>
                        </div>
                    ))}
                     {lessons.length === 0 && <p className="text-sm text-muted-foreground">Lessons will be available soon.</p>}
                </div>
            </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolCourseSingle;
