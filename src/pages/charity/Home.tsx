import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Target, 
  TrendingUp, 
  Droplets,
  GraduationCap,
  Home as HomeIcon,
  Utensils,
  HandHeart,
  Globe,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { charityDB } from '@/lib/platform-db';

const CharityHome = () => {
  const [impactStats, setImpactStats] = useState({
    totalRaised: 0,
    familiesHelped: 0,
    projectsCompleted: 0,
    volunteers: 0
  });
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    // Load real-time data
    const loadData = async () => {
      try {
        const [campaigns, projects, donations, volunteers] = await Promise.all([
          charityDB.get('campaigns'),
          charityDB.get('projects'),
          charityDB.get('donations'),
          charityDB.get('volunteers')
        ]);

        const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
        const completedProjects = projects.filter(p => p.status === 'completed').length;

        setImpactStats({
          totalRaised,
          familiesHelped: 1250, // This would be calculated from beneficiaries
          projectsCompleted: completedProjects,
          volunteers: volunteers.length
        });

        setActiveCampaigns(campaigns.filter(c => c.status === 'active').slice(0, 3));
        setRecentProjects(projects.slice(0, 3));
      } catch (error) {
        console.error('Error loading charity data:', error);
      }
    };

    loadData();
  }, []);

  const causes = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Clean Water Projects",
      description: "Providing access to clean, safe drinking water in underserved communities",
      color: "from-blue-500 to-cyan-500",
      raised: 45000,
      target: 60000
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Education Support",
      description: "Funding schools, scholarships, and educational resources for children",
      color: "from-green-500 to-emerald-500",
      raised: 32000,
      target: 50000
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Food Security",
      description: "Fighting hunger through food distribution and sustainable farming",
      color: "from-orange-500 to-red-500",
      raised: 28000,
      target: 40000
    },
    {
      icon: <HomeIcon className="w-8 h-8" />,
      title: "Emergency Relief",
      description: "Rapid response to natural disasters and humanitarian crises",
      color: "from-purple-500 to-pink-500",
      raised: 55000,
      target: 75000
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Compassion",
      description: "Driven by love and empathy for those in need"
    },
    {
      icon: <HandHeart className="w-6 h-6" />,
      title: "Transparency",
      description: "Open and accountable in all our operations"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Impact",
      description: "Reaching communities worldwide with aid"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Building stronger, more resilient communities"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-pink-800 to-red-900 text-white">
        <div className="absolute inset-0 bg-[url('/charity-pattern.svg')] opacity-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full blur-xl animate-ping" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-2xl">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Compassion
              </span>
              <br />
              <span className="text-white">in Action</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-rose-100 mb-8 leading-relaxed max-w-4xl mx-auto">
              Making a difference through charitable works and community support. 
              Together, we can transform lives and build a better world for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <ModernButton 
                size="lg" 
                rightIcon={<Heart className="w-5 h-5" />}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-xl"
              >
                Donate Now
              </ModernButton>
              <ModernButton 
                variant="outline" 
                size="lg"
                className="border-rose-400 text-rose-400 hover:bg-rose-400/10"
              >
                Become a Volunteer
              </ModernButton>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: "Total Raised", value: formatCurrency(impactStats.totalRaised), icon: <DollarSign className="w-6 h-6" /> },
                { label: "Families Helped", value: `${impactStats.familiesHelped.toLocaleString()}+`, icon: <Users className="w-6 h-6" /> },
                { label: "Projects Completed", value: `${impactStats.projectsCompleted}+`, icon: <Target className="w-6 h-6" /> },
                { label: "Active Volunteers", value: `${impactStats.volunteers}+`, icon: <HandHeart className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-rose-400/20">
                  <div className="text-rose-300 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-rose-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Current <span className="text-rose-600">Campaigns</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in making an immediate impact on lives around the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {causes.map((cause, index) => (
              <ModernCard 
                key={index} 
                variant="glass" 
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="mb-6">
                  <div className={`bg-gradient-to-r ${cause.color} p-4 rounded-2xl text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300 w-fit`}>
                    {cause.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {cause.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {cause.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Raised: {formatCurrency(cause.raised)}</span>
                    <span className="text-gray-600">Goal: {formatCurrency(cause.target)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${cause.color} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${(cause.raised / cause.target) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round((cause.raised / cause.target) * 100)}% Complete
                    </span>
                  </div>
                </div>

                <ModernButton 
                  size="sm" 
                  className={`w-full bg-gradient-to-r ${cause.color} hover:shadow-lg`}
                >
                  Donate Now
                </ModernButton>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide our charitable mission</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-100 group-hover:border-rose-200">
                  <div className="text-rose-600 mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Be the Change You Want to See
          </h2>
          <p className="text-xl text-rose-100 mb-8 leading-relaxed">
            Every donation, no matter the size, creates ripples of positive change. 
            Join our mission to build a more compassionate world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton 
              size="lg" 
              className="bg-white text-rose-600 hover:bg-rose-50 shadow-lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Donating Today
            </ModernButton>
            <ModernButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Learn About Our Work
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CharityHome;
