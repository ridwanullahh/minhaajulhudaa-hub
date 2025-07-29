
import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { BookOpen, Users, Award, Calendar } from 'lucide-react';

const SchoolIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/10 to-yellow-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-600 bg-clip-text text-transparent">
              Excellence in Islamic Education
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nurturing minds and souls with comprehensive Islamic education that prepares students for success in this world and the hereafter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg" rightIcon={<BookOpen className="w-5 h-5" />}>
                Explore Programs
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Apply for Admission
              </ModernButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold platform-primary mb-4">
              Why Choose Minhaajulhudaa School?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our holistic approach combines traditional Islamic values with modern educational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Islamic Curriculum",
                description: "Comprehensive Islamic studies integrated with modern subjects"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Teachers",
                description: "Qualified educators passionate about Islamic education"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Academic Excellence",
                description: "Outstanding results and university preparation"
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Rich Activities",
                description: "Extracurricular programs for holistic development"
              }
            ].map((feature, index) => (
              <ModernCard key={index} variant="glass" className="text-center group">
                <div className="platform-secondary mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold platform-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
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
              Ready to Begin Your Islamic Education Journey?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join our community of learners and discover the beauty of Islamic knowledge.
            </p>
            <ModernButton size="lg" className="mr-4">
              Start Application
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              Schedule Visit
            </ModernButton>
          </ModernCard>
        </div>
      </section>
    </div>
  );
};

export default SchoolIndex;
