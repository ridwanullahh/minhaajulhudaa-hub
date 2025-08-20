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
import { Routes, Route } from 'react-router-dom';
import ManageBlogPosts from './school/ManageBlogPosts';
import BlogPostForm from './school/BlogPostForm';
import ManageStudents from './school/ManageStudents';
import StudentForm from './school/StudentForm';
import ManageCourses from './school/ManageCourses';
import CourseForm from './school/CourseForm';
import ManageClasses from './school/ManageClasses';
import ClassForm from './school/ClassForm';
import ManagePrograms from './school/ManagePrograms';
import ProgramForm from './school/ProgramForm';
import ManageStaff from './school/ManageStaff';
import StaffForm from './school/StaffForm';
import ManageAdmissions from './school/ManageAdmissions';
import AdmissionForm from './school/AdmissionForm';
import ManagePayments from './school/ManagePayments';
import PaymentForm from './school/PaymentForm';
import ManageProducts from './school/ManageProducts';
import ProductForm from './school/ProductForm';
import ManageOrders from './school/ManageOrders';
import OrderForm from './school/OrderForm';

// ... (imports remain the same)

const SchoolAdminDashboard = () => {
  // This component will render the main dashboard view with stats and links
  const [stats, setStats] = useState({ /* ... */ });
  // ... other state and useEffect for dashboard data

  const managementSections = [
    // ... other sections
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

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">School Administration</h1>
        <p className="text-muted-foreground">Manage all aspects of Minhaajulhudaa Islamic School</p>
      </div>

      {/* Stats Grid and other dashboard components */}
      {/* ... */}

      {/* Management Sections */}
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
          <Route path="/blog" element={<ManageBlogPosts />} />
          <Route path="/blog/new" element={<BlogPostForm />} />
          <Route path="/blog/edit/:id" element={<BlogPostForm />} />
          <Route path="/students" element={<ManageStudents />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />

          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/edit/:id" element={<CourseForm />} />

          <Route path="/classes" element={<ManageClasses />} />
          <Route path="/classes/new" element={<ClassForm />} />
          <Route path="/classes/edit/:id" element={<ClassForm />} />

          <Route path="/programs" element={<ManagePrograms />} />
          <Route path="/programs/new" element={<ProgramForm />} />
          <Route path="/programs/edit/:id" element={<ProgramForm />} />

          <Route path="/staff" element={<ManageStaff />} />
          <Route path="/staff/new" element={<StaffForm />} />
          <Route path="/staff/edit/:id" element={<StaffForm />} />

          <Route path="/admissions" element={<ManageAdmissions />} />
          <Route path="/admissions/new" element={<AdmissionForm />} />
          <Route path="/admissions/edit/:id" element={<AdmissionForm />} />

          <Route path="/payments" element={<ManagePayments />} />
          <Route path="/payments/new" element={<PaymentForm />} />
          <Route path="/payments/edit/:id" element={<PaymentForm />} />

          <Route path="/shop/products" element={<ManageProducts />} />
          <Route path="/shop/products/new" element={<ProductForm />} />
          <Route path="/shop/products/edit/:id" element={<ProductForm />} />

          <Route path="/shop/orders" element={<ManageOrders />} />
          <Route path="/shop/orders/new" element={<OrderForm />} />
          <Route path="/shop/orders/edit/:id" element={<OrderForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default SchoolAdmin;
