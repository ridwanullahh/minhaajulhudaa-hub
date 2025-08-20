import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { Plane, BookOpen, User, Star, FileText } from 'lucide-react';

import ManagePackages from './travels/ManagePackages';
import PackageForm from './travels/PackageForm';
import ManageBookings from './travels/ManageBookings';
import BookingForm from './travels/BookingForm';
import ManageCustomers from './travels/ManageCustomers';
import CustomerForm from './travels/CustomerForm';
import ManageReviews from './travels/ManageReviews';
import ReviewForm from './travels/ReviewForm';
import ManageCourses from './travels/ManageCourses';
import CourseForm from './travels/CourseForm';

const TravelsAdminDashboard = () => {
    const managementSections = [
        { title: 'Packages', href: 'packages', icon: <Plane/> },
        { title: 'Bookings', href: 'bookings', icon: <FileText/> },
        { title: 'Customers', href: 'customers', icon: <User/> },
        { title: 'Reviews', href: 'reviews', icon: <Star/> },
        { title: 'Courses', href: 'courses', icon: <BookOpen/> },
    ];
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Travels & Tours Administration</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {managementSections.map((section) => (
                    <ModernCard key={section.title} className="p-6">
                        <div className="text-primary mb-4">{section.icon}</div>
                        <h3 className="text-xl font-bold">{section.title}</h3>
                        <Link to={section.href}>
                            <ModernButton className="mt-4 w-full">Manage</ModernButton>
                        </Link>
                    </ModernCard>
                ))}
            </div>
        </div>
    );
};

const TravelsAdmin = () => {
  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<TravelsAdminDashboard />} />
          <Route path="/packages" element={<ManagePackages />} />
          <Route path="/packages/new" element={<PackageForm />} />
          <Route path="/packages/edit/:id" element={<PackageForm />} />
          <Route path="/bookings" element={<ManageBookings />} />
          <Route path="/bookings/new" element={<BookingForm />} />
          <Route path="/bookings/edit/:id" element={<BookingForm />} />
          <Route path="/customers" element={<ManageCustomers />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
          <Route path="/reviews" element={<ManageReviews />} />
          <Route path="/reviews/new" element={<ReviewForm />} />
          <Route path="/reviews/edit/:id" element={<ReviewForm />} />
          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/edit/:id" element={<CourseForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default TravelsAdmin;
