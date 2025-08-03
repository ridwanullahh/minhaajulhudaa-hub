import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { 
  Users, 
  Heart, 
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  Globe,
  UserCheck,
  Award,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  HandHeart,
  PieChart
} from 'lucide-react';
import { charityDB } from '@/lib/platform-db';

const CharityAdmin = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeCampaigns: 0,
    totalVolunteers: 0,
    beneficiariesHelped: 0,
    completedProjects: 0,
    impactScore: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [campaignProgress, setCampaignProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load various data for dashboard
      const [donations, campaigns, volunteers, projects, beneficiaries] = await Promise.all([
        charityDB.get('donations'),
        charityDB.get('campaigns'),
        charityDB.get('volunteers'),
        charityDB.get('projects'),
        charityDB.get('beneficiaries')
      ]);

      const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;

      setStats({
        totalDonations,
        activeCampaigns,
        totalVolunteers: volunteers.length,
        beneficiariesHelped: beneficiaries.length,
        completedProjects,
        impactScore: Math.round((completedProjects * 10 + beneficiaries.length * 2) / 10)
      });

      // Set campaign progress
      setCampaignProgress(
        campaigns.slice(0, 5).map(campaign => ({
          name: campaign.title,
          raised: campaign.raised || 0,
          goal: campaign.goal || 1,
          progress: Math.round(((campaign.raised || 0) / (campaign.goal || 1)) * 100)
        }))
      );

      // Set recent activities
      setRecentActivities([
        { id: 1, type: 'donation', message: 'New donation of $500 received', time: '30 minutes ago' },
        { id: 2, type: 'volunteer', message: 'New volunteer registered', time: '2 hours ago' },
        { id: 3, type: 'campaign', message: 'Water well campaign reached 80%', time: '4 hours ago' },
        { id: 4, type: 'project', message: 'Education project completed', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Donations',
      value: `$${stats.totalDonations.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-green-500',
      change: '+22%',
      changeType: 'positive'
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: <Target className="w-8 h-8" />,
      color: 'bg-blue-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Volunteers',
      value: stats.totalVolunteers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500',
      change: '+18',
      changeType: 'positive'
    },
    {
      title: 'People Helped',
      value: stats.beneficiariesHelped,
      icon: <HandHeart className="w-8 h-8" />,
      color: 'bg-pink-500',
      change: '+156',
      changeType: 'positive'
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
      icon: <Award className="w-8 h-8" />,
      color: 'bg-amber-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Impact Score',
      value: stats.impactScore,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-indigo-500',
      change: '+12%',
      changeType: 'positive'
    }
  ];

  const managementSections = [
    {
      title: 'Campaign Management',
      description: 'Create and manage fundraising campaigns',
      icon: <Target className="w-12 h-12" />,
      actions: [
        { name: 'View All Campaigns', href: '/charity/admin/campaigns', icon: <Target className="w-4 h-4" /> },
        { name: 'Create Campaign', href: '/charity/admin/campaigns/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Campaign Analytics', href: '/charity/admin/analytics/campaigns', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Donation Management',
      description: 'Track donations, process payments, and manage donors',
      icon: <Heart className="w-12 h-12" />,
      actions: [
        { name: 'Donation Records', href: '/charity/admin/donations', icon: <Heart className="w-4 h-4" /> },
        { name: 'Donor Management', href: '/charity/admin/donors', icon: <Users className="w-4 h-4" /> },
        { name: 'Receipts', href: '/charity/admin/receipts', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Project Management',
      description: 'Manage charitable projects and track progress',
      icon: <Globe className="w-12 h-12" />,
      actions: [
        { name: 'All Projects', href: '/charity/admin/projects', icon: <Globe className="w-4 h-4" /> },
        { name: 'Create Project', href: '/charity/admin/projects/new', icon: <Plus className="w-4 h-4" /> },
        { name: 'Project Reports', href: '/charity/admin/reports/projects', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Volunteer Management',
      description: 'Coordinate volunteers and manage assignments',
      icon: <UserCheck className="w-12 h-12" />,
      actions: [
        { name: 'All Volunteers', href: '/charity/admin/volunteers', icon: <UserCheck className="w-4 h-4" /> },
        { name: 'Assignments', href: '/charity/admin/assignments', icon: <Calendar className="w-4 h-4" /> },
        { name: 'Volunteer Hours', href: '/charity/admin/volunteer-hours', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Beneficiary Management',
      description: 'Manage beneficiaries and track impact',
      icon: <HandHeart className="w-12 h-12" />,
      actions: [
        { name: 'Beneficiaries', href: '/charity/admin/beneficiaries', icon: <HandHeart className="w-4 h-4" /> },
        { name: 'Impact Tracking', href: '/charity/admin/impact', icon: <TrendingUp className="w-4 h-4" /> },
        { name: 'Success Stories', href: '/charity/admin/stories', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Financial Management',
      description: 'Handle finances, budgets, and reporting',
      icon: <DollarSign className="w-12 h-12" />,
      actions: [
        { name: 'Financial Overview', href: '/charity/admin/finances', icon: <DollarSign className="w-4 h-4" /> },
        { name: 'Budget Planning', href: '/charity/admin/budgets', icon: <PieChart className="w-4 h-4" /> },
        { name: 'Financial Reports', href: '/charity/admin/reports/financial', icon: <BarChart3 className="w-4 h-4" /> }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Charity Administration</h1>
          <p className="text-gray-600">Manage all aspects of Minhaajulhudaa Charity Foundation</p>
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

        {/* Campaign Progress */}
        {campaignProgress.length > 0 && (
          <ModernCard variant="glass" className="mb-8 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Active Campaign Progress</h3>
            <div className="space-y-4">
              {campaignProgress.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{campaign.name}</span>
                      <span className="text-gray-600">{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-platform-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
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
                { name: 'New Campaign', icon: <Plus className="w-5 h-5" />, href: '/charity/admin/campaigns/new' },
                { name: 'Add Project', icon: <Globe className="w-5 h-5" />, href: '/charity/admin/projects/new' },
                { name: 'View Donations', icon: <Heart className="w-5 h-5" />, href: '/charity/admin/donations' },
                { name: 'Impact Report', icon: <BarChart3 className="w-5 h-5" />, href: '/charity/admin/reports/impact' },
                { name: 'Send Update', icon: <Bell className="w-5 h-5" />, href: '/charity/admin/updates/new' },
                { name: 'Export Data', icon: <Download className="w-5 h-5" />, href: '/charity/admin/export' }
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

export default CharityAdmin;
