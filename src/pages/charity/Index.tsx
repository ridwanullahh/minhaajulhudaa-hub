
import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Heart, Users, Target, TrendingUp } from 'lucide-react';

const CharityIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-pink-800/10 to-red-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-800 via-pink-700 to-red-600 bg-clip-text text-transparent">
              Compassion in Action
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Making a difference through charitable works and community support. Together, we can transform lives and build a better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg" rightIcon={<Heart className="w-5 h-5" />}>
                Donate Now
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                View Projects
              </ModernButton>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold platform-primary mb-4">
              Our Impact So Far
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your contributions are making a real difference in people's lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { number: '5,000+', label: 'Families Helped', icon: <Users className="w-6 h-6" /> },
              { number: '50,000+', label: 'Meals Provided', icon: <Heart className="w-6 h-6" /> },
              { number: '25', label: 'Active Projects', icon: <Target className="w-6 h-6" /> },
              { number: '$2.5M+', label: 'Funds Raised', icon: <TrendingUp className="w-6 h-6" /> }
            ].map((stat, index) => (
              <ModernCard key={index} variant="glass" className="text-center">
                <div className="platform-accent mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold platform-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </ModernCard>
            ))}
          </div>

          {/* Featured Projects */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Emergency Food Relief',
                description: 'Providing nutritious meals to families in crisis',
                progress: 75,
                raised: '$45,000',
                goal: '$60,000'
              },
              {
                title: 'Clean Water Initiative',
                description: 'Building wells in underserved communities',
                progress: 60,
                raised: '$30,000',
                goal: '$50,000'
              },
              {
                title: 'Education Support',
                description: 'Scholarships for underprivileged students',
                progress: 90,
                raised: '$18,000',
                goal: '$20,000'
              }
            ].map((project, index) => (
              <ModernCard key={index} variant="elevated" className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold platform-primary mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-platform-accent h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Raised: <strong>{project.raised}</strong></span>
                  <span className="text-sm text-gray-600">Goal: <strong>{project.goal}</strong></span>
                </div>
                
                <ModernButton className="w-full">Support Project</ModernButton>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl md:text-4xl font-bold platform-primary mb-6">
              Be the Change You Want to See
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Your generosity can transform lives. Join us in making a lasting impact on communities in need.
            </p>
            <ModernButton size="lg" className="mr-4">
              Start Donating
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              Become Volunteer
            </ModernButton>
          </ModernCard>
        </div>
      </section>
    </div>
  );
};

export default CharityIndex;
