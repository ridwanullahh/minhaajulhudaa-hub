import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { BookOpen, Clock, Users, Award } from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

const SchoolPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      setIsLoading(true);
      try {
        const data = await schoolDB.get('programs');
        setPrograms(data);
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Academic Programs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Comprehensive Islamic education programs designed to nurture academic excellence 
            and spiritual growth at every stage of development.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => (
            <ModernCard key={program.id || index} variant="glass" className="p-8 hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="text-primary mb-6">
                <BookOpen className="w-12 h-12" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">{program.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">{program.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-foreground">
                  <Clock className="w-5 h-5 text-primary mr-3" />
                  <span>Duration: {program.duration}</span>
                </div>
                <div className="flex items-center text-foreground">
                  <Users className="w-5 h-5 text-primary mr-3" />
                  <span>Age Group: {program.ageGroup}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Core Subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {program.subjects?.map((subject, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <Link to={`/school/programs/${program.slug || program.id}`} className="mt-auto">
                <ModernButton className="w-full">
                  Learn More
                </ModernButton>
              </Link>
            </ModernCard>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Enroll Your Child?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of learners and give your child the gift of Islamic education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/school/admissions">
                <ModernButton size="lg">
                  Start Application
                </ModernButton>
              </Link>
              <Link to="/school/contact">
                <ModernButton variant="outline" size="lg">
                  Schedule Visit
                </ModernButton>
              </Link>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolPrograms;
