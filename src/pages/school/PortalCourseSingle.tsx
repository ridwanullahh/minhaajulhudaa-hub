import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { PlayCircle, FileText, CheckSquare, ArrowLeft } from 'lucide-react';

const PortalCourseSingle = () => {
    const { id } = useParams<{ id: string }>();
    // Dummy data
    const course = {
        id: id,
        title: 'Advanced Arabic Grammar',
        instructor: 'Dr. Yusuf',
        lessons: [
            { id: 1, title: 'Lesson 1: Introduction to Nahw', type: 'video' },
            { id: 2, title: 'Lesson 2: Types of Words', type: 'video' },
            { id: 3, title: 'Reading: Chapter 1', type: 'reading' },
            { id: 4, title: 'Quiz 1: Basic Concepts', type: 'quiz' },
        ]
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'video': return <PlayCircle className="w-5 h-5 text-primary" />;
            case 'reading': return <FileText className="w-5 h-5 text-primary" />;
            case 'quiz': return <CheckSquare className="w-5 h-5 text-primary" />;
            default: return null;
        }
    }

    return (
        <div className="min-h-screen py-20 bg-muted/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <Link to="/school/portal/courses">
                    <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                      Back to My Courses
                    </ModernButton>
                  </Link>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-8">Instructor: {course.instructor}</p>

                <ModernCard variant="glass" className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                    <ul className="space-y-3">
                        {course.lessons.map(lesson => (
                            <li key={lesson.id} className="flex items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                                {getIcon(lesson.type)}
                                <span className="ml-4 font-medium">{lesson.title}</span>
                            </li>
                        ))}
                    </ul>
                </ModernCard>
            </div>
        </div>
    );
};

export default PortalCourseSingle;
