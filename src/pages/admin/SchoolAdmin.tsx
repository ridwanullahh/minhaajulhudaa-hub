import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  FileText,
  ShoppingCart,
  Library,
  UserCheck,
  Award,
  BarChart3,
  Plus,
  Eye,
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

const SchoolAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingAdmissions: 0,
    activeClasses: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [students, courses] = await Promise.all([
        schoolDB.get('students'),
        schoolDB.get('courses'),
      ]);

      setStats({
        totalStudents: students.length,
        totalStaff: 0,
        totalCourses: courses.length,
        totalRevenue: 0,
        pendingAdmissions: 0,
        activeClasses: 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: <UserCheck className="w-8 h-8" />,
      color: 'bg-green-500',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-amber-500',
    },
    {
      title: 'Pending Admissions',
      value: stats.pendingAdmissions,
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Active Classes',
      value: stats.activeClasses,
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-indigo-500',
    }
  ];

  const managementSections = [
    {
      title: 'Student Management',
      description: 'Manage student records, enrollment, and academic progress',
      icon: <Users className="w-12 h-12" />,
      actions: [
        { name: 'View All Students', href: '/school/admin/students', icon: <Eye className="w-4 h-4" /> },
        { name: 'Add New Student', href: '/school/admin/students/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Student Reports', href: '/school/admin/reports/students', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Academic Management',
      description: 'Manage courses, classes, schedules, and academic content',
      icon: <BookOpen className="w-12 h-12" />,
      actions: [
        { name: 'Manage Courses', href: '/school/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'Class Schedules', href: '/school/admin/schedules', icon: <Calendar className="w-4 h-4" /> },
        { name: 'Assignments', href: '/school/admin/assignments', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Staff Management',
      description: 'Manage teachers, staff records, and payroll',
      icon: <UserCheck className="w-12 h-12" />,
      actions: [
        { name: 'View All Staff', href: '/school/admin/staff', icon: <Users className="w-4 h-4" /> },
        { name: 'Add New Staff', href: '/school/admin/staff/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Payroll', href: '/school/admin/payroll', icon: <DollarSign className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Admissions',
      description: 'Process applications, interviews, and enrollment',
      icon: <FileText className="w-12 h-12" />,
      actions: [
        { name: 'Pending Applications', href: '/school/admin/admissions', icon: <FileText className="w-4 h-4" /> },
        { name: 'Interview Schedule', href: '/school/admin/interviews', icon: <Calendar className="w-4 h-4" /> },
        { name: 'Enrollment', href: '/school/admin/enrollment', icon: <UserCheck className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Financial Management',
      description: 'Handle payments, fees, and financial reporting',
      icon: <DollarSign className="w-12 h-12" />,
      actions: [
        { name: 'Payment Records', href: '/school/admin/payments', icon: <DollarSign className="w-4 h-4" /> },
        { name: 'Fee Structure', href: '/school/admin/fees', icon: <Settings className="w-4 h-4" /> },
        { name: 'Financial Reports', href: '/school/admin/reports/financial', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage all blog posts and articles',
      icon: <FileText className="w-12 h-12" />,
      actions: [
        { name: 'View All Posts', href: '/school/admin/blog', icon: <Eye className="w-4 h-4" /> },
        { name: 'Add New Post', href: '/school/admin/blog/new', icon: <Plus className="w-4 h-4" /> },
      ]
    },
    {
      title: 'E-Commerce',
      description: 'Manage school shop, products, and orders',
      icon: <ShoppingCart className="w-12 h-12" />,
      actions: [
        { name: 'Manage Products', href: '/school/admin/shop/products', icon: <ShoppingCart className="w-4 h-4" /> },
        { name: 'View Orders', href: '/school/admin/shop/orders', icon: <FileText className="w-4 h-4" /> },
        { name: 'Inventory', href: '/school/admin/shop/inventory', icon: <Library className="w-4 h-4" /> }
      ]
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">School Administration</h1>
        <p className="text-muted-foreground">Manage all aspects of Minhaajulhudaa Islamic School</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <ModernCard key={index} variant="default" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {managementSections.map((section, index) => (
          <ModernCard key={index} variant="glass" className="p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-primary mb-4">
              {section.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{section.title}</h3>
            <p className="text-muted-foreground mb-6">{section.description}</p>

            <div className="space-y-2">
              {section.actions.map((action, actionIndex) => (
                <Link
                  key={actionIndex}
                  to={action.href}
                  className="flex items-center text-sm text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
                >
                  {action.icon}
                  <span className="ml-2">{action.name}</span>
                </Link>
              ))}
            </div>
          </ModernCard>
        ))}
      </div>
    </>
  );
};

const SchoolAdmin = () => {
  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<SchoolAdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default SchoolAdmin;
