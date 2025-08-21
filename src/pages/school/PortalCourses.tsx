import React from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { BookOpen, Percent } from 'lucide-react';

const PortalCourses = () => {
    // Dummy data
    const enrolledCourses = [
        { id: '1', title: 'Advanced Arabic Grammar', progress: 75, instructor: 'Dr. Yusuf' },
        { id: '2', title: 'Fiqh of Worship', progress: 45, instructor: 'Sheikh Abdullah' },
        { id: '3', title: 'Seerah of the Prophet (SAW)', progress: 90, instructor: 'Ustadha Fatima' },
    ];

    return (
        <div className="min-h-screen py-20 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-foreground mb-8">My Courses</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrolledCourses.map(course => (
                        <Link to={`/school/portal/courses/${course.id}`} key={course.id}>
                            <ModernCard variant="glass" className="p-6 h-full hover:shadow-xl transition-all">
                                <BookOpen className="w-8 h-8 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                                <p className="text-muted-foreground mb-4">Instructor: {course.instructor}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                                <p className="text-right text-sm text-muted-foreground mt-2">{course.progress}% Complete</p>
                            </ModernCard>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortalCourses;
