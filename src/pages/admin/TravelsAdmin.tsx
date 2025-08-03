import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { 
  Users, 
  Plane, 
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  Star,
  UserCheck,
  Award,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Package,
  CreditCard
} from 'lucide-react';
import { travelsDB } from '@/lib/platform-db';

const TravelsAdmin = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activePackages: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    upcomingTrips: 0,
    averageRating: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDepartures, setUpcomingDepartures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load various data for dashboard
      const [bookings, packages, customers, reviews] = await Promise.all([
        travelsDB.get('bookings'),
        travelsDB.get('packages'),
        travelsDB.get('customers'),
        travelsDB.get('reviews')
      ]);

      const currentMonth = new Date().getMonth();
      const monthlyRevenue = bookings
        .filter(b => new Date(b.createdAt).getMonth() === currentMonth)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
        : 0;

      const upcomingTrips = packages.filter(p => 
        new Date(p.departureDate) > new Date()
      ).length;

      setStats({
        totalBookings: bookings.length,
        activePackages: packages.filter(p => p.status === 'active').length,
        totalCustomers: customers.length,
        monthlyRevenue,
        upcomingTrips,
        averageRating: Math.round(averageRating * 10) / 10
      });

      // Set upcoming departures
      setUpcomingDepartures(
        packages
          .filter(p => new Date(p.departureDate) > new Date())
          .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
          .slice(0, 5)
          .map(p => ({
            title: p.title,
            departureDate: p.departureDate,
            destination: p.destination,
            bookings: bookings.filter(b => b.packageId === p.id).length
          }))
      );

      // Set recent activities
      setRecentActivities([
        { id: 1, type: 'booking', message: 'New Hajj package booking received', time: '1 hour ago' },
        { id: 2, type: 'review', message: 'New 5-star review submitted', time: '3 hours ago' },
        { id: 3, type: 'package', message: 'Umrah package updated', time: '5 hours ago' },
        { id: 4, type: 'customer', message: 'Customer inquiry received', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-blue-500',
      change: '+15',
      changeType: 'positive'
    },
    {
      title: 'Active Packages',
      value: stats.activePackages,
      icon: <Package className="w-8 h-8" />,
      color: 'bg-green-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500',
      change: '+28',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-amber-500',
      change: '+32%',
      changeType: 'positive'
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingTrips,
      icon: <Plane className="w-8 h-8" />,
      color: 'bg-orange-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating}/5`,
      icon: <Star className="w-8 h-8" />,
      color: 'bg-indigo-500',
      change: '+0.2',
      changeType: 'positive'
    }
  ];

  const managementSections = [
    {
      title: 'Package Management',
      description: 'Create and manage travel packages and itineraries',
      icon: <Package className="w-12 h-12" />,
      actions: [
        { name: 'All Packages', href: '/travels/admin/packages', icon: <Package className="w-4 h-4" /> },
        { name: 'Create Package', href: '/travels/admin/packages/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Package Analytics', href: '/travels/admin/analytics/packages', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Booking Management',
      description: 'Handle bookings, reservations, and customer requests',
      icon: <Calendar className="w-12 h-12" />,
      actions: [
        { name: 'All Bookings', href: '/travels/admin/bookings', icon: <Calendar className="w-4 h-4" /> },
        { name: 'Pending Bookings', href: '/travels/admin/bookings?status=pending', icon: <Bell className="w-4 h-4" /> },
        { name: 'Booking Reports', href: '/travels/admin/reports/bookings', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Customer Management',
      description: 'Manage customer profiles, preferences, and history',
      icon: <Users className="w-12 h-12" />,
      actions: [
        { name: 'All Customers', href: '/travels/admin/customers', icon: <Users className="w-4 h-4" /> },
        { name: 'Customer Support', href: '/travels/admin/support', icon: <Bell className="w-4 h-4" /> },
        { name: 'Customer Analytics', href: '/travels/admin/analytics/customers', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Payment Management',
      description: 'Process payments, refunds, and financial transactions',
      icon: <CreditCard className="w-12 h-12" />,
      actions: [
        { name: 'Payment Records', href: '/travels/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
        { name: 'Refund Requests', href: '/travels/admin/refunds', icon: <DollarSign className="w-4 h-4" /> },
        { name: 'Financial Reports', href: '/travels/admin/reports/financial', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Reviews & Feedback',
      description: 'Manage customer reviews and feedback',
      icon: <Star className="w-12 h-12" />,
      actions: [
        { name: 'All Reviews', href: '/travels/admin/reviews', icon: <Star className="w-4 h-4" /> },
        { name: 'Testimonials', href: '/travels/admin/testimonials', icon: <Award className="w-4 h-4" /> },
        { name: 'Feedback Analysis', href: '/travels/admin/analytics/feedback', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Content Management',
      description: 'Manage website content, blogs, and travel guides',
      icon: <FileText className="w-12 h-12" />,
      actions: [
        { name: 'Travel Guides', href: '/travels/admin/guides', icon: <MapPin className="w-4 h-4" /> },
        { name: 'Blog Posts', href: '/travels/admin/blog', icon: <FileText className="w-4 h-4" /> },
        { name: 'Course Content', href: '/travels/admin/courses', icon: <Award className="w-4 h-4" /> }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travels Administration</h1>
          <p className="text-gray-600">Manage all aspects of Minhaajulhudaa Travels & Tours</p>
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
                    {card.change} this month
                  </p>
                </div>
                <div className={`p-3 rounded-full text-white ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Upcoming Departures */}
        {upcomingDepartures.length > 0 && (
          <ModernCard variant="glass" className="mb-8 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Departures</h3>
            <div className="space-y-4">
              {upcomingDepartures.map((departure, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{departure.title}</h4>
                    <p className="text-sm text-gray-600">{departure.destination}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(departure.departureDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {departure.bookings} bookings
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>
        )}

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

        {/* Recent Activities & Quick Actions */}
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
                { name: 'New Package', icon: <Plus className="w-5 h-5" />, href: '/travels/admin/packages/new' },
                { name: 'View Bookings', icon: <Calendar className="w-5 h-5" />, href: '/travels/admin/bookings' },
                { name: 'Customer Support', icon: <Users className="w-5 h-5" />, href: '/travels/admin/support' },
                { name: 'Financial Report', icon: <BarChart3 className="w-5 h-5" />, href: '/travels/admin/reports/financial' },
                { name: 'Send Newsletter', icon: <Bell className="w-5 h-5" />, href: '/travels/admin/newsletter' },
                { name: 'Export Data', icon: <Download className="w-5 h-5" />, href: '/travels/admin/export' }
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

export default TravelsAdmin;
