import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { BookOpen, BarChart, Clock, DollarSign } from 'lucide-react';

const SchoolCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    return <div className="text-center py-20">Loading Courses...</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Courses</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore a wide range of courses designed to deepen your knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <ModernCard key={course.id} variant="glass" className="p-6 flex flex-col group">
               <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 text-sm font-semibold rounded-full">
                    {course.level || 'All Levels'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 flex-grow group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                by {course.instructor}
              </p>

              <div className="space-y-3 text-foreground text-sm mb-6 border-t pt-4">
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2"/><span>{course.duration} hours</span></div>
                <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2"/><span>${course.price}</span></div>
              </div>

              <Link to={`/school/courses/${course.id}`} className="mt-auto">
                <ModernButton className="w-full">
                  View Course
                </ModernButton>
              </Link>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolCourses;