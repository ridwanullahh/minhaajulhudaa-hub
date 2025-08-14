import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { 
  Users, 
  Clock, 
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  Volume2,
  BookOpen,
  UserCheck,
  Award,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Mic,
  Play
} from 'lucide-react';
import { masjidDB } from '@/lib/platform-db';

const MasjidAdmin = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    monthlyDonations: 0,
    activePrograms: 0,
    audioLibraryItems: 0,
    upcomingEvents: 0,
    volunteerHours: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load various data for dashboard
      const [donations, events, audioLibrary, volunteers, prayerTimesData] = await Promise.all([
        masjidDB.get('donations'),
        masjidDB.get('events'),
        masjidDB.get('audio_library'),
        masjidDB.get('volunteers'),
        masjidDB.get('prayer_times')
      ]);

      const currentMonth = new Date().getMonth();
      const monthlyDonations = donations
        .filter(d => new Date(d.createdAt).getMonth() === currentMonth)
        .reduce((sum, d) => sum + (d.amount || 0), 0);

      setStats({
        totalMembers: 450, // This would come from a members collection
        monthlyDonations,
        activePrograms: events.filter(e => e.status === 'active').length,
        audioLibraryItems: audioLibrary.length,
        upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
        volunteerHours: volunteers.reduce((sum, v) => sum + (v.hoursContributed || 0), 0)
      });

      // Get today's prayer times
      const today = new Date().toISOString().split('T')[0];
      const todayPrayers = prayerTimesData.find(p => p.date === today);
      if (todayPrayers) {
        setPrayerTimes(todayPrayers);
      }

      // Set recent activities
      setRecentActivities([
        { id: 1, type: 'donation', message: 'New donation received: $250', time: '1 hour ago' },
        { id: 2, type: 'event', message: 'Quran study circle scheduled', time: '3 hours ago' },
        { id: 3, type: 'audio', message: 'New lecture added to library', time: '5 hours ago' },
        { id: 4, type: 'volunteer', message: 'New volunteer registered', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Community Members',
      value: stats.totalMembers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      change: '+25',
      changeType: 'positive'
    },
    {
      title: 'Monthly Donations',
      value: `$${stats.monthlyDonations.toLocaleString()}`,
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-green-500',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Active Programs',
      value: stats.activePrograms,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-purple-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Audio Library',
      value: stats.audioLibraryItems,
      icon: <Volume2 className="w-8 h-8" />,
      color: 'bg-amber-500',
      change: '+12',
      changeType: 'positive'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-orange-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Volunteer Hours',
      value: stats.volunteerHours,
      icon: <UserCheck className="w-8 h-8" />,
      color: 'bg-indigo-500',
      change: '+45',
      changeType: 'positive'
    }
  ];

  const managementSections = [
    {
      title: 'Prayer Management',
      description: 'Manage prayer times, schedules, and notifications',
      icon: <Clock className="w-12 h-12" />,
      actions: [
        { name: 'Prayer Times', href: '/masjid/admin/prayer-times', icon: <Clock className="w-4 h-4" /> },
        { name: 'Prayer Notifications', href: '/masjid/admin/notifications', icon: <Bell className="w-4 h-4" /> },
        { name: 'Iqamah Schedule', href: '/masjid/admin/iqamah', icon: <Calendar className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Audio Library',
      description: 'Manage lectures, Quran recitations, and audio content',
      icon: <Volume2 className="w-12 h-12" />,
      actions: [
        { name: 'Manage Audio', href: '/masjid/admin/audio', icon: <Volume2 className="w-4 h-4" /> },
        { name: 'Add New Content', href: '/masjid/admin/audio/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Categories', href: '/masjid/admin/audio/categories', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Events & Programs',
      description: 'Organize community events and educational programs',
      icon: <Calendar className="w-12 h-12" />,
      actions: [
        { name: 'View All Events', href: '/masjid/admin/events', icon: <Calendar className="w-4 h-4" /> },
        { name: 'Create Event', href: '/masjid/admin/events/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Event Reports', href: '/masjid/admin/reports/events', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Donations',
      description: 'Track donations, manage campaigns, and generate receipts',
      icon: <Heart className="w-12 h-12" />,
      actions: [
        { name: 'Donation Records', href: '/masjid/admin/donations', icon: <Heart className="w-4 h-4" /> },
        { name: 'Campaigns', href: '/masjid/admin/campaigns', icon: <TrendingUp className="w-4 h-4" /> },
        { name: 'Receipts', href: '/masjid/admin/receipts', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Community Management',
      description: 'Manage members, volunteers, and community services',
      icon: <Users className="w-12 h-12" />,
      actions: [
        { name: 'Members', href: '/masjid/admin/members', icon: <Users className="w-4 h-4" /> },
        { name: 'Volunteers', href: '/masjid/admin/volunteers', icon: <UserCheck className="w-4 h-4" /> },
        { name: 'Services', href: '/masjid/admin/services', icon: <Settings className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Content Management',
      description: 'Manage website content, announcements, and blog posts',
      icon: <FileText className="w-12 h-12" />,
      actions: [
        { name: 'Announcements', href: '/masjid/admin/announcements', icon: <Bell className="w-4 h-4" /> },
        { name: 'Blog Posts', href: '/masjid/admin/blog', icon: <FileText className="w-4 h-4" /> },
        { name: 'Pages', href: '/masjid/admin/pages', icon: <BookOpen className="w-4 h-4" /> }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Masjid Administration</h1>
          <p className="text-gray-600">Manage all aspects of Minhaajulhudaa Islamic Center</p>
        </div>

        {/* Prayer Times Quick View */}
        {Object.keys(prayerTimes).length > 0 && (
          <ModernCard variant="gradient" className="mb-8 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Prayer Times</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                <div key={prayer} className="text-center">
                  <div className="text-sm text-gray-600 capitalize">{prayer}</div>
                  <div className="font-bold text-lg text-gray-800">
                    {prayerTimes[prayer]?.iqamah || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>
        )}

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
                { name: 'Update Prayer Times', icon: <Clock className="w-5 h-5" />, href: '/masjid/admin/prayer-times' },
                { name: 'Add Audio', icon: <Mic className="w-5 h-5" />, href: '/masjid/admin/audio/new' },
                { name: 'Create Event', icon: <Calendar className="w-5 h-5" />, href: '/masjid/admin/events/new' },
                { name: 'Send Announcement', icon: <Bell className="w-5 h-5" />, href: '/masjid/admin/announcements/new' },
                { name: 'View Donations', icon: <Heart className="w-5 h-5" />, href: '/masjid/admin/donations' },
                { name: 'Generate Report', icon: <BarChart3 className="w-5 h-5" />, href: '/masjid/admin/reports' }
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

export default MasjidAdmin;
