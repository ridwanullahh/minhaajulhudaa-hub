import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Star,
  GraduationCap,
  Heart,
  Globe,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  Play
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { schoolDB } from '@/lib/platform-db';

const SchoolHome = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    programs: 0,
    years: 0
  });
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    // Load real-time data
    const loadData = async () => {
      try {
        const [programs, blogPosts, students] = await Promise.all([
          schoolDB.get('programs'),
          schoolDB.get('blog_posts'),
          schoolDB.get('students')
        ]);

        setStats({
          students: students.length,
          teachers: 25, // This would come from staff collection
          programs: programs.length,
          years: 15
        });

        setFeaturedPrograms(programs.slice(0, 3));
        setRecentNews(blogPosts.filter(post => post.status === 'published').slice(0, 3));
      } catch (error) {
        console.error('Error loading school data:', error);
      }
    };

    loadData();
  }, []);

  const values = [
    { icon: <Shield className="w-6 h-6" />, title: "Islamic Values", desc: "Rooted in Quran & Sunnah" },
    { icon: <GraduationCap className="w-6 h-6" />, title: "Academic Excellence", desc: "High educational standards" },
    { icon: <Globe className="w-6 h-6" />, title: "Global Perspective", desc: "Preparing for modern world" },
    { icon: <Heart className="w-6 h-6" />, title: "Character Building", desc: "Moral and ethical development" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Excellence in
                </span>
                <br />
                <span className="text-foreground">Islamic Education</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                Nurturing minds and souls with comprehensive Islamic education that prepares students 
                for success in this world and the hereafter.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <ModernButton 
                  size="lg" 
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Explore Programs
                </ModernButton>
                <ModernButton 
                  variant="outline" 
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Apply for Admission
                </ModernButton>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-background/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Students", value: stats.students, suffix: "+" },
                    { label: "Teachers", value: stats.teachers, suffix: "+" },
                    { label: "Programs", value: stats.programs, suffix: "" },
                    { label: "Years", value: stats.years, suffix: "+" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">Foundation principles that guide our educational mission</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
                <div className="text-amber-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Begin Your Islamic Education Journey?
          </h2>
          <p className="text-xl text-amber-100 mb-8 leading-relaxed">
            Join our community of learners and discover the beauty of Islamic knowledge combined with academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton 
              size="lg" 
              className="bg-white text-amber-600 hover:bg-amber-50 shadow-lg"
            >
              Start Application
            </ModernButton>
            <ModernButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Schedule Visit
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolHome;
