import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  Calendar,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  ShoppingCart,
  Library,
  UserCheck,
  Award,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

const SchoolAdmin = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingAdmissions: 0,
    activeClasses: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load various data for dashboard
      const [students, staff, courses, admissions, payments, classes] = await Promise.all([
        schoolDB.get('students'),
        schoolDB.get('staff'),
        schoolDB.get('courses'),
        schoolDB.get('admissions'),
        schoolDB.get('payments'),
        schoolDB.get('classes')
      ]);

      setStats({
        totalStudents: students.length,
        totalStaff: staff.length,
        totalCourses: courses.length,
        totalRevenue: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
        pendingAdmissions: admissions.filter(a => a.status === 'pending').length,
        activeClasses: classes.filter(c => c.status === 'active').length
      });

      // Set recent activities
      setRecentActivities([
        { id: 1, type: 'admission', message: 'New admission application received', time: '2 hours ago' },
        { id: 2, type: 'payment', message: 'Tuition payment processed', time: '4 hours ago' },
        { id: 3, type: 'course', message: 'New course "Advanced Arabic" created', time: '1 day ago' },
        { id: 4, type: 'student', message: 'Student profile updated', time: '2 days ago' }
      ]);

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
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: <UserCheck className="w-8 h-8" />,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-amber-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending Admissions',
      value: stats.pendingAdmissions,
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-orange-500',
      change: '+3',
      changeType: 'neutral'
    },
    {
      title: 'Active Classes',
      value: stats.activeClasses,
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-indigo-500',
      change: '+2',
      changeType: 'positive'
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
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Administration</h1>
          <p className="text-gray-600">Manage all aspects of Minhaajulhudaa Islamic School</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <ModernCard key={index} variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-sm ${
                    card.changeType === 'positive' ? 'text-green-600' : 
                    card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {card.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full text-white ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {managementSections.map((section, index) => (
            <ModernCard key={index} variant="glass" className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-platform-primary mb-4">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
              <p className="text-gray-600 mb-6">{section.description}</p>
              
              <div className="space-y-2">
                {section.actions.map((action, actionIndex) => (
                  <Link
                    key={actionIndex}
                    to={action.href}
                    className="flex items-center text-sm text-gray-700 hover:text-platform-primary transition-colors p-2 rounded-lg hover:bg-platform-primary/5"
                  >
                    {action.icon}
                    <span className="ml-2">{action.name}</span>
                  </Link>
                ))}
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ModernCard variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-platform-primary/10 rounded-full">
                    <Bell className="w-4 h-4 text-platform-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Add Student', icon: <Plus className="w-5 h-5" />, href: '/school/admin/students/new' },
                { name: 'Create Course', icon: <BookOpen className="w-5 h-5" />, href: '/school/admin/courses/new' },
                { name: 'Schedule Class', icon: <Calendar className="w-5 h-5" />, href: '/school/admin/schedules/new' },
                { name: 'Generate Report', icon: <BarChart3 className="w-5 h-5" />, href: '/school/admin/reports' },
                { name: 'Send Notice', icon: <Bell className="w-5 h-5" />, href: '/school/admin/notices/new' },
                { name: 'Backup Data', icon: <Download className="w-5 h-5" />, href: '/school/admin/backup' }
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:border-platform-primary hover:bg-platform-primary/5 transition-all"
                >
                  <div className="text-platform-primary mb-2">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.name}</span>
                </Link>
              ))}
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdmin;
