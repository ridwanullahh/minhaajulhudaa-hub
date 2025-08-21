import React from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import {
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  GraduationCap,
  User,
  Bell
} from 'lucide-react';

const StudentPortalDashboard = () => {
  // Dummy data - in a real app, this would come from an API call
  // based on the logged-in student's ID.
  const student = {
    name: 'Abdullah Ibrahim',
    grade: 'Grade 5',
    profilePic: '/images/student-avatar.png'
  };

  const dashboardItems = [
    {
      title: 'My Courses',
      description: 'Access your enrolled courses, lessons, and materials.',
      href: '/school/portal/courses',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: 'My Assignments',
      description: 'View upcoming and submitted assignments.',
      href: '/school/portal/assignments',
      icon: <ClipboardCheck className="w-8 h-8" />
    },
    {
      title: 'My Results',
      description: 'Check your exam scores and academic progress.',
      href: '/school/portal/results',
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      title: 'Messages',
      description: 'Communicate with teachers and administration.',
      href: '/school/portal/messages',
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      title: 'My Profile',
      description: 'Update your personal information.',
      href: '/school/portal/profile',
      icon: <User className="w-8 h-8" />
    },
    {
      title: 'Notifications',
      description: 'View important announcements and updates.',
      href: '/school/portal/notifications',
      icon: <Bell className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {student.name}!</h1>
            <p className="text-xl text-muted-foreground">This is your student portal dashboard.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardItems.map((item, index) => (
            <Link to={item.href} key={index}>
              <ModernCard
                variant="glass"
                className="p-6 h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="text-primary mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground flex-grow">{item.description}</p>
              </ModernCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPortalDashboard;
