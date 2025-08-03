import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  Heart,
  Target,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import { charityDB } from '@/lib/platform-db';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  category: string;
  image: string;
  location: string;
  urgent: boolean;
  featured: boolean;
}

const CharityCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await charityDB.get('campaigns');

      if (data.length === 0) {
        // Initialize with sample campaigns
        const sampleCampaigns = [
          {
            title: 'Emergency Water Wells',
            description: 'Providing clean water access to drought-affected communities in East Africa',
            goal: 50000,
            raised: 32500,
            donors: 245,
            daysLeft: 15,
            category: 'water',
            image: '/images/water-well.jpg',
            location: 'East Africa',
            urgent: true,
            featured: true
          },
          {
            title: 'Orphan Education Fund',
            description: 'Supporting education for orphaned children with school supplies and tuition',
            goal: 25000,
            raised: 18750,
            donors: 156,
            daysLeft: 30,
            category: 'education',
            image: '/images/orphan-education.jpg',
            location: 'Global',
            urgent: false,
            featured: true
          },
          {
            title: 'Ramadan Food Packages',
            description: 'Distributing food packages to needy families during the holy month of Ramadan',
            goal: 15000,
            raised: 12300,
            donors: 89,
            daysLeft: 8,
            category: 'food',
            image: '/images/ramadan-food.jpg',
            location: 'Local Community',
            urgent: true,
            featured: false
          },
          {
            title: 'Medical Aid for Gaza',
            description: 'Emergency medical supplies and healthcare support for families in Gaza',
            goal: 75000,
            raised: 45600,
            donors: 312,
            daysLeft: 22,
            category: 'medical',
            image: '/images/medical-aid.jpg',
            location: 'Gaza, Palestine',
            urgent: true,
            featured: true
          },
          {
            title: 'Masjid Construction',
            description: 'Building a new community masjid to serve growing Muslim population',
            goal: 200000,
            raised: 85000,
            donors: 178,
            daysLeft: 90,
            category: 'infrastructure',
            image: '/images/masjid-construction.jpg',
            location: 'Local Community',
            urgent: false,
            featured: false
          },
          {
            title: 'Winter Clothing Drive',
            description: 'Warm clothing and blankets for homeless individuals during winter months',
            goal: 8000,
            raised: 6200,
            donors: 67,
            daysLeft: 12,
            category: 'clothing',
            image: '/images/winter-clothing.jpg',
            location: 'Local Community',
            urgent: false,
            featured: false
          }
        ];

        for (const campaign of sampleCampaigns) {
          await charityDB.insert('campaigns', campaign);
        }
        setCampaigns(sampleCampaigns as Campaign[]);
      } else {
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonation = async (campaignId: string) => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      await charityDB.insert('donations', {
        campaignId,
        amount: parseFloat(donationAmount),
        donorName: 'Anonymous', // In real app, this would come from user auth
        donorEmail: '',
        message: '',
        paymentMethod: 'card',
        status: 'completed'
      });

      // Update campaign raised amount
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        const updatedCampaigns = campaigns.map(c =>
          c.id === campaignId
            ? { ...c, raised: c.raised + parseFloat(donationAmount), donors: c.donors + 1 }
            : c
        );
        setCampaigns(updatedCampaigns);
      }

      alert(`Thank you for your donation of $${donationAmount}!`);
      setDonationAmount('');
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Error processing donation. Please try again.');
    }
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCampaigns = campaigns
    .filter(campaign => selectedCategory === 'all' || campaign.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured ? 1 : -1;
        case 'urgent':
          return b.urgent ? 1 : -1;
        case 'progress':
          return getProgressPercentage(b.raised, b.goal) - getProgressPercentage(a.raised, a.goal);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

  const categories = [
    { id: 'all', name: 'All Campaigns' },
    { id: 'water', name: 'Clean Water' },
    { id: 'education', name: 'Education' },
    { id: 'food', name: 'Food Security' },
    { id: 'medical', name: 'Medical Aid' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'clothing', name: 'Clothing' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Active <span className="text-platform-primary">Campaigns</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join us in making a difference. Every donation, no matter the size,
            creates ripples of positive change in communities around the world.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
          >
            <option value="featured">Featured First</option>
            <option value="urgent">Most Urgent</option>
            <option value="progress">Highest Progress</option>
            <option value="newest">Newest First</option>
          </select>

          <div className="flex items-center text-gray-600">
            <span className="mr-2">Showing {filteredCampaigns.length} campaigns</span>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <ModernCard
              key={campaign.id}
              variant="glass"
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Campaign Image */}
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-platform-primary/10 to-platform-secondary/10 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-platform-primary/30" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {campaign.featured && (
                    <span className="bg-platform-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                  {campaign.urgent && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Urgent
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-platform-primary font-medium capitalize">
                    {campaign.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {campaign.daysLeft} days left
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-platform-primary transition-colors">
                  {campaign.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {campaign.description}
                </p>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {campaign.location}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{Math.round(getProgressPercentage(campaign.raised, campaign.goal))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-platform-primary to-platform-secondary h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-platform-primary">
                      {formatCurrency(campaign.raised)}
                    </div>
                    <div className="text-xs text-gray-600">Raised</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(campaign.goal)}
                    </div>
                    <div className="text-xs text-gray-600">Goal</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {campaign.donors}
                    </div>
                    <div className="text-xs text-gray-600">Donors</div>
                  </div>
                </div>

                {/* Donation Section */}
                {selectedCampaign === campaign.id ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Enter amount ($)"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <ModernButton
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDonation(campaign.id)}
                      >
                        Donate Now
                      </ModernButton>
                      <ModernButton
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCampaign(null)}
                      >
                        Cancel
                      </ModernButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <ModernButton
                      className="flex-1"
                      onClick={() => setSelectedCampaign(campaign.id)}
                      leftIcon={<Heart className="w-4 h-4" />}
                    >
                      Donate
                    </ModernButton>
                    <ModernButton
                      variant="outline"
                      size="sm"
                    >
                      Learn More
                    </ModernButton>
                  </div>
                )}
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Have a specific cause in mind? Contact us to discuss creating a new campaign
              or learn about other ways to make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg">
                Suggest a Campaign
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Contact Us
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default CharityCampaigns;