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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/charity-pattern.svg')] opacity-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl animate-ping" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-secondary to-primary rounded-full shadow-2xl">
                <Heart className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                Compassion
              </span>
              <br />
              <span className="text-primary-foreground">in Action</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-8 leading-relaxed max-w-4xl mx-auto">
              Making a difference through charitable works and community support. 
              Together, we can transform lives and build a better world for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <ModernButton 
                size="lg" 
                rightIcon={<Heart className="w-5 h-5" />}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl"
              >
                Donate Now
              </ModernButton>
              <ModernButton 
                variant="outline" 
                size="lg"
                className="border-secondary text-secondary hover:bg-secondary/10"
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
                <div key={index} className="bg-background/10 backdrop-blur-md rounded-2xl p-6 text-center border border-secondary/20">
                  <div className="text-secondary/90 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
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
