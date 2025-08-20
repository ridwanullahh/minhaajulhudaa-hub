import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { 
  Users, BookOpen, GraduationCap, Calendar, DollarSign,
  FileText, ShoppingCart, Library, UserCheck, Eye, Plus, BarChart3
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

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

const SchoolAdminDashboard = () => {
  const managementSections = [
    {
      title: 'Student Management',
      description: 'Manage student records, enrollment, and academic progress',
      icon: <Users className="w-12 h-12" />,
      actions: [
        { name: 'View All Students', href: 'students', icon: <Eye className="w-4 h-4" /> },
        { name: 'Add New Student', href: 'students/new', icon: <Plus className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Academic Management',
      description: 'Manage courses, classes, schedules, and academic content',
      icon: <BookOpen className="w-12 h-12" />,
      actions: [
        { name: 'Manage Courses', href: 'courses', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'Manage Classes', href: 'classes', icon: <GraduationCap className="w-4 h-4" /> },
        { name: 'Manage Programs', href: 'programs', icon: <Calendar className="w-4 h-4" /> },
      ]
    },
     {
      title: 'Blog Management',
      description: 'Create, edit, and manage all blog posts and articles',
      icon: <FileText className="w-12 h-12" />,
      actions: [
        { name: 'View All Posts', href: 'blog', icon: <Eye className="w-4 h-4" /> },
        { name: 'Add New Post', href: 'blog/new', icon: <Plus className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Staff Management',
      description: 'Manage teachers, staff records, and payroll',
      icon: <UserCheck className="w-12 h-12" />,
      actions: [
        { name: 'View All Staff', href: 'staff', icon: <Users className="w-4 h-4" /> },
        { name: 'Add New Staff', href: 'staff/new', icon: <Plus className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Admissions',
      description: 'Process applications, interviews, and enrollment',
      icon: <FileText className="w-12 h-12" />,
      actions: [
        { name: 'Pending Applications', href: 'admissions', icon: <FileText className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Financial Management',
      description: 'Handle payments, fees, and financial reporting',
      icon: <DollarSign className="w-12 h-12" />,
      actions: [
        { name: 'Payment Records', href: 'payments', icon: <DollarSign className="w-4 h-4" /> },
      ]
    },
    {
      title: 'E-Commerce',
      description: 'Manage school shop, products, and orders',
      icon: <ShoppingCart className="w-12 h-12" />,
      actions: [
        { name: 'Manage Products', href: 'shop/products', icon: <ShoppingCart className="w-4 h-4" /> },
        { name: 'View Orders', href: 'shop/orders', icon: <FileText className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">School Administration</h1>
        <p className="text-muted-foreground">Manage all aspects of Minhaajulhudaa Islamic School</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {managementSections.map((section) => (
          <ModernCard key={section.title} variant="glass" className="p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-primary mb-4">{section.icon}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">{section.title}</h3>
            <p className="text-muted-foreground mb-6">{section.description}</p>
            <div className="space-y-2">
              {section.actions.map((action) => (
                <Link key={action.name} to={action.href} className="flex items-center text-sm text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5">
                  {action.icon}<span className="ml-2">{action.name}</span>
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
