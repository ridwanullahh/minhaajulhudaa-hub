import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { BookOpen, Percent } from 'lucide-react';

const PortalCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const studentId = '1'; // This would be dynamic from auth

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      setIsLoading(true);
      try {
        const enrollments = await schoolDB.find('enrollments', { studentId });
        const courseIds = enrollments.map(e => e.courseId);

        if (courseIds.length > 0) {
            const allCourses = await schoolDB.get('courses');
            const myCourses = allCourses.filter(c => courseIds.includes(c.id));

            const coursesWithProgress = myCourses.map(course => {
                const enrollment = enrollments.find(e => e.courseId === course.id);
                return {...course, progress: enrollment?.progress || 0 };
            });
            setEnrolledCourses(coursesWithProgress);
        }

      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEnrolledCourses();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20">Loading Your Courses...</div>;
  }

  return (
    <div>
        <h1 className="text-3xl font-bold text-foreground mb-8">My Courses</h1>
        {enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
                <Link to={`/school/portal/courses/${course.id}`} key={course.id}>
                    <ModernCard variant="glass" className="p-6 flex flex-col group h-full">
                        <div className="flex-grow">
                            <div className="mb-4 text-primary"><BookOpen className="w-8 h-8"/></div>
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                by {course.instructor}
                            </p>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                                <div className="bg-primary h-2.5 rounded-full" style={{width: `${course.progress}%`}}></div>
                            </div>
                            <p className="text-sm text-muted-foreground">{course.progress}% Complete</p>
                        </div>
                    </ModernCard>
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
                <Link to="/school/courses">
                    <ModernButton>Browse Courses</ModernButton>
                </Link>
            </div>
        )}
    </div>
  );
};

export default PortalCourses;
