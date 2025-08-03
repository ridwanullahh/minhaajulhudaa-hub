import React from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { BookOpen, Users, Award, Heart, Target, Globe } from 'lucide-react';

const SchoolAbout = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            About <span className="text-amber-600">Minhaajulhudaa School</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Established with a vision to provide comprehensive Islamic education, 
            we nurture young minds with knowledge, character, and spiritual growth.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <ModernCard variant="glass" className="p-8">
            <div className="text-amber-600 mb-4">
              <Target className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide exceptional Islamic education that integrates traditional Islamic values 
              with modern academic excellence, preparing students to be confident, knowledgeable, 
              and righteous leaders in their communities.
            </p>
          </ModernCard>

          <ModernCard variant="glass" className="p-8">
            <div className="text-amber-600 mb-4">
              <Globe className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To be a leading Islamic educational institution that produces graduates who are 
              academically excellent, spiritually grounded, and morally upright, contributing 
              positively to society while maintaining their Islamic identity.
            </p>
          </ModernCard>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Knowledge",
                description: "Pursuing excellence in both Islamic and secular education"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Character",
                description: "Building strong moral character based on Islamic principles"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community",
                description: "Fostering a supportive and inclusive learning environment"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Excellence",
                description: "Striving for the highest standards in all endeavors"
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-amber-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <ModernCard variant="glass" className="p-8 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our History</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Founded in 2008, Minhaajulhudaa Islamic School began as a small community initiative 
              with a big vision. Our founders recognized the need for quality Islamic education 
              that would prepare Muslim children for success in both this world and the hereafter.
            </p>
            <p className="mb-4">
              Starting with just 25 students in a modest facility, we have grown to serve over 
              500 students across multiple grade levels. Our growth reflects the trust that 
              families place in our educational approach and the success of our graduates.
            </p>
            <p>
              Today, we continue to evolve and expand our programs while staying true to our 
              founding principles of academic excellence, Islamic values, and character development.
            </p>
          </div>
        </ModernCard>

        {/* Call to Action */}
        <div className="text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Join Our Educational Community
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Discover how we can help your child grow academically, spiritually, and personally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg">
                Schedule a Visit
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Learn About Admissions
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolAbout;
