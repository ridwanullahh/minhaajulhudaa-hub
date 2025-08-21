import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { schoolDB } from '@/lib/platform-db';
import { ArrowLeft, BookOpen, Clock, Users, CheckCircle } from 'lucide-react';

const SchoolProgramSingle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const loadProgram = async () => {
        setIsLoading(true);
        try {
          const allPrograms = await schoolDB.get('programs');
          const foundProgram = allPrograms.find(p => (p.slug || p.id) === slug);
          setProgram(foundProgram);
        } catch (error) {
          console.error('Error loading program:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadProgram();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Program Not Found</h1>
        <Link to="/school/programs">
          <ModernButton>Back to Programs</ModernButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/school/programs">
            <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Programs
            </ModernButton>
          </Link>
        </div>

        <ModernCard variant="glass" className="p-8">
          <div className="flex items-center mb-6">
            <div className="p-4 bg-primary/10 text-primary rounded-xl mr-6">
              <BookOpen className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{program.title}</h1>
              <p className="text-lg text-muted-foreground">{program.excerpt || 'Detailed Program Information'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8 text-foreground">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-primary mr-3" />
              <div>
                <span className="font-semibold">Duration:</span> {program.duration}
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-6 h-6 text-primary mr-3" />
              <div>
                <span className="font-semibold">Age Group:</span> {program.ageGroup}
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-foreground/90 mb-8">
            <p>{program.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Core Subjects</h3>
            <div className="flex flex-wrap gap-3">
              {program.subjects?.map((subject: string, index: number) => (
                <div key={index} className="flex items-center bg-primary/10 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mr-2" />
                  <span className="text-primary font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/school/admissions">
              <ModernButton size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Apply Now
              </ModernButton>
            </Link>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default SchoolProgramSingle;
