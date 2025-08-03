import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  BookOpen,
  Heart,
  Plane,
  Home as HomeIcon
} from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { getPlatformDB } from '@/lib/platform-db';

interface AdminDashboardProps {
  platform: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ platform }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const platformDB = getPlatformDB(platform);
        const [users, posts, events] = await Promise.all([
          platformDB.get('users'),
          platformDB.get('blog_posts'),
          platformDB.get('events')
        ]);

        setStats({
          totalUsers: users.length,
          totalPosts: posts.length,
          totalRevenue: Math.floor(Math.random() * 50000) + 10000, // Mock data
          monthlyGrowth: Math.floor(Math.random() * 20) + 5
        });

        // Mock recent activity
        setRecentActivity([
          { action: 'New user registered', time: '2 minutes ago', type: 'user' },
          { action: 'Blog post published', time: '1 hour ago', type: 'content' },
          { action: 'Event created', time: '3 hours ago', type: 'event' },
          { action: 'Payment received', time: '5 hours ago', type: 'payment' }
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [platform]);

  const getPlatformIcon = () => {
    switch (platform) {
      case 'school': return <BookOpen className="w-6 h-6" />;
      case 'masjid': return <HomeIcon className="w-6 h-6" />;
      case 'charity': return <Heart className="w-6 h-6" />;
      case 'travels': return <Plane className="w-6 h-6" />;
      default: return <HomeIcon className="w-6 h-6" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'school': return 'School';
      case 'masjid': return 'Masjid';
      case 'charity': return 'Charity';
      case 'travels': return 'Travels';
      default: return 'Platform';
    }
  };

  const getQuickActions = () => {
    switch (platform) {
      case 'school':
        return [
          { label: 'Add Student', icon: <Users className="w-5 h-5" />, action: () => {} },
          { label: 'Create Course', icon: <BookOpen className="w-5 h-5" />, action: () => {} },
          { label: 'New Blog Post', icon: <FileText className="w-5 h-5" />, action: () => {} },
          { label: 'Schedule Event', icon: <Calendar className="w-5 h-5" />, action: () => {} }
        ];
      case 'masjid':
        return [
          { label: 'Update Prayer Times', icon: <Calendar className="w-5 h-5" />, action: () => {} },
          { label: 'Add Audio', icon: <Plus className="w-5 h-5" />, action: () => {} },
          { label: 'New Announcement', icon: <FileText className="w-5 h-5" />, action: () => {} },
          { label: 'Create Event', icon: <Calendar className="w-5 h-5" />, action: () => {} }
        ];
      case 'charity':
        return [
          { label: 'New Campaign', icon: <Plus className="w-5 h-5" />, action: () => {} },
          { label: 'Add Project', icon: <FileText className="w-5 h-5" />, action: () => {} },
          { label: 'Manage Volunteers', icon: <Users className="w-5 h-5" />, action: () => {} },
          { label: 'Track Donations', icon: <DollarSign className="w-5 h-5" />, action: () => {} }
        ];
      case 'travels':
        return [
          { label: 'New Package', icon: <Plus className="w-5 h-5" />, action: () => {} },
          { label: 'Manage Bookings', icon: <Calendar className="w-5 h-5" />, action: () => {} },
          { label: 'Add Customer', icon: <Users className="w-5 h-5" />, action: () => {} },
          { label: 'Update Itinerary', icon: <FileText className="w-5 h-5" />, action: () => {} }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="text-platform-primary mr-3">
              {getPlatformIcon()}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {getPlatformName()} Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your {platform} platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
              <div className="text-blue-500">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Content Posts</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalPosts}</p>
              </div>
              <div className="text-green-500">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-yellow-500">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Growth</p>
                <p className="text-3xl font-bold text-gray-800">{stats.monthlyGrowth}%</p>
              </div>
              <div className="text-purple-500">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </ModernCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <ModernCard variant="glass" className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <ModernButton
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    leftIcon={action.icon}
                    onClick={action.action}
                  >
                    {action.label}
                  </ModernButton>
                ))}
              </div>
            </ModernCard>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <ModernCard variant="glass" className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'content' ? 'bg-green-500' :
                        activity.type === 'event' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`} />
                      <span className="text-gray-800">{activity.action}</span>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </ModernCard>
          </div>
        </div>

        {/* Management Links */}
        <div className="mt-8">
          <ModernCard variant="glass" className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Platform Management</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ModernButton variant="outline" leftIcon={<Users className="w-5 h-5" />}>
                Manage Users
              </ModernButton>
              <ModernButton variant="outline" leftIcon={<FileText className="w-5 h-5" />}>
                Content Management
              </ModernButton>
              <ModernButton variant="outline" leftIcon={<BarChart3 className="w-5 h-5" />}>
                Analytics
              </ModernButton>
              <ModernButton variant="outline" leftIcon={<Settings className="w-5 h-5" />}>
                Settings
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
