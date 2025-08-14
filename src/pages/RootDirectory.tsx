
import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Plane, Building } from 'lucide-react';

const RootDirectory = () => {
  const navigate = useNavigate();

  const platforms = [
    {
      name: 'Islamic School',
      slug: 'school',
      description: 'Excellence in Islamic Education - Nurturing minds and souls with comprehensive Islamic education',
      icon: <BookOpen className="w-12 h-12" />,
      color: 'from-amber-400 to-orange-500',
      features: ['LMS', 'Admissions', 'Student Portal', 'E-Library', 'Online Shop']
    },
    {
      name: 'Masjid',
      slug: 'masjid',
      description: 'Your Spiritual Home - Building community through worship, knowledge, and service',
      icon: <Building className="w-12 h-12" />,
      color: 'from-emerald-400 to-teal-500',
      features: ['Prayer Times', 'Audio Library', 'Quran Player', 'Events', 'Donations']
    },
    {
      name: 'Charity Foundation',
      slug: 'charity',
      description: 'Compassion in Action - Making a difference through charitable works and community support',
      icon: <Heart className="w-12 h-12" />,
      color: 'from-rose-400 to-pink-500',
      features: ['Campaigns', 'Donations', 'Volunteer Management', 'Impact Tracking']
    },
    {
      name: 'Travels & Tours',
      slug: 'travels',
      description: 'Sacred Journeys Await - Your trusted partner for Hajj, Umrah, and Islamic heritage tours',
      icon: <Plane className="w-12 h-12" />,
      color: 'from-blue-400 to-indigo-500',
      features: ['Hajj Packages', 'Umrah Services', 'Tours', 'Booking System']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/10 to-yellow-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-600 bg-clip-text text-transparent">
              Minhaajulhudaa
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Comprehensive Islamic Platform - Education, Spirituality, Charity & Sacred Journeys
            </p>
            <div className="flex justify-center">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-amber-200/50">
                <p className="text-lg text-amber-900 font-semibold">
                  Choose Your Platform to Begin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map((platform, index) => (
              <ModernCard 
                key={index} 
                variant="glass" 
                className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate(`/${platform.slug}`)}
              >
                <div className={`mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-r ${platform.color} p-4 rounded-2xl text-white shadow-lg`}>
                    {platform.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#552c20' }}>
                  {platform.name}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {platform.description}
                </p>
                
                <ModernButton 
                  className="w-full"
                  onClick={() => navigate(`/${platform.slug}`)}
                >
                  Enter Platform
                </ModernButton>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-amber-900 mb-4">
              © 2024 Minhaajulhudaa Platform. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                YouTube
              </a>
            </div>
            <div className="flex justify-center space-x-6">
              <span className="text-sm text-gray-600">All platforms share the same brand identity</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">Powered by GitHub Database</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootDirectory;
