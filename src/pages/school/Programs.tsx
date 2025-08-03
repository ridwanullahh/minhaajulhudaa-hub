import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { BookOpen, Clock, Users, Award } from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

const SchoolPrograms = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await schoolDB.get('programs');
        setPrograms(data);
      } catch (error) {
        console.error('Error loading programs:', error);
        // Fallback data
        setPrograms([
          {
            id: '1',
            title: 'Elementary Islamic Studies',
            description: 'Comprehensive Islamic education for young learners',
            duration: '6 years',
            ageGroup: '5-11 years',
            subjects: ['Quran', 'Arabic', 'Islamic History', 'Math', 'Science', 'English']
          },
          {
            id: '2', 
            title: 'Middle School Program',
            description: 'Balanced curriculum combining Islamic and secular subjects',
            duration: '3 years',
            ageGroup: '12-14 years',
            subjects: ['Advanced Quran', 'Fiqh', 'Hadith', 'Literature', 'Sciences', 'Social Studies']
          },
          {
            id: '3',
            title: 'High School Diploma',
            description: 'College preparatory program with Islamic foundation',
            duration: '4 years', 
            ageGroup: '15-18 years',
            subjects: ['Islamic Theology', 'Advanced Arabic', 'College Prep', 'Leadership', 'Community Service']
          }
        ]);
      }
    };

    loadPrograms();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Our <span className="text-amber-600">Academic Programs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Comprehensive Islamic education programs designed to nurture academic excellence 
            and spiritual growth at every stage of development.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => (
            <ModernCard key={program.id || index} variant="glass" className="p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-amber-600 mb-6">
                <BookOpen className="w-12 h-12" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{program.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 text-amber-600 mr-3" />
                  <span>Duration: {program.duration}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 text-amber-600 mr-3" />
                  <span>Age Group: {program.ageGroup}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Core Subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {program.subjects?.map((subject, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <ModernButton className="w-full">
                Learn More
              </ModernButton>
            </ModernCard>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Program Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Integrated Curriculum",
                description: "Islamic studies seamlessly integrated with academic subjects"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Small Class Sizes",
                description: "Personalized attention with low student-to-teacher ratios"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Qualified Teachers",
                description: "Expert educators with Islamic knowledge and teaching credentials"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Flexible Scheduling",
                description: "Full-time and part-time options to accommodate families"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-amber-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Ready to Enroll Your Child?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join our community of learners and give your child the gift of Islamic education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg">
                Start Application
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Schedule Visit
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolPrograms;
