import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { BookOpen, Percent } from 'lucide-react';

const PortalCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch courses for the LOGGED IN student.
    // For now, we'll just fetch all active courses as a demonstration.
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const data = await schoolDB.get('courses');
        setCourses(data.filter(c => c.status === 'active'));
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20">Loading Your Courses...</div>;
  }

  return (
    <div>
        <h1 className="text-3xl font-bold text-foreground mb-8">My Courses</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
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
                            <div className="bg-primary h-2.5 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <p className="text-sm text-muted-foreground">45% Complete</p>
                    </div>
                </ModernCard>
            </Link>
          ))}
        </div>
    </div>
  );
};

export default PortalCourses;
