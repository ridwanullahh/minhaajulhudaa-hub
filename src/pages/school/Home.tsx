import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  GraduationCap,
  Heart,
  Globe,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { schoolDB } from '@/lib/platform-db';

/**
 * School Home page
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Uses the cohesive palette: warm off-white bg, soft slate text,
 * per-platform amber accent (applied via .platform-school on the
 * layout wrapper). No heavy gradients.
 */
const SchoolHome: React.FC = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, programs: 0, years: 0 });
  const [featuredPrograms, setFeaturedPrograms] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [programs, blogPosts, students] = await Promise.all([
          schoolDB.get('programs'),
          schoolDB.get('blog_posts'),
          schoolDB.get('students'),
        ]);
        setStats({
          students: students.length,
          teachers: 25,
          programs: programs.length,
          years: 15,
        });
        setFeaturedPrograms(programs.slice(0, 3));
        setRecentNews(blogPosts.filter((post: any) => post.status === 'published').slice(0, 3));
      } catch (error) {
        console.error('Error loading school data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const values = [
    { icon: Shield, title: 'Islamic Values', desc: 'Rooted in Quran and Sunnah with authentic methodology' },
    { icon: GraduationCap, title: 'Academic Excellence', desc: 'High educational standards across all programs' },
    { icon: Globe, title: 'Global Perspective', desc: 'Preparing students for the modern world' },
    { icon: Heart, title: 'Character Building', desc: 'Moral and ethical development alongside academics' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-platform-accent-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-medium text-platform-accent mb-3">
                  BismiLLAH Ar-Rahman Ar-Roheem
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                  Excellence in Islamic Education
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                  Nurturing minds and souls with comprehensive Islamic education
                  that prepares students for success in this world and the hereafter.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ModernButton size="lg" onClick={() => (window.location.href = '/school/programs')}>
                    Explore Programs
                    <ArrowRight className="h-4 w-4" />
                  </ModernButton>
                  <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/school/admissions')}>
                    Apply for Admission
                  </ModernButton>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Students', value: stats.students, suffix: '+' },
                    { label: 'Teachers', value: stats.teachers, suffix: '+' },
                    { label: 'Programs', value: stats.programs, suffix: '' },
                    { label: 'Years', value: stats.years, suffix: '+' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-bold text-platform-accent mb-1">
                        {loading ? '-' : `${stat.value}${stat.suffix}`}
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

      {/* Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Foundation principles that guide our educational mission
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-platform-accent-soft text-platform-accent mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section className="py-16 sm:py-20 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Featured Programs</h2>
                <p className="text-muted-foreground">Discover our most popular educational programs</p>
              </div>
              <Link to="/school/programs" className="text-sm font-medium text-platform-accent hover:underline hidden sm:inline">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPrograms.map((program) => (
                <div key={program.id} className="rounded-lg border border-border bg-card p-6 hover:border-platform-accent/40 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-platform-accent" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {program.category || 'Program'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{program.duration}</span>
                    {program.fee > 0 && (
                      <span className="font-medium text-foreground">NGN {program.fee.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent News */}
      {recentNews.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Latest News</h2>
                <p className="text-muted-foreground">Stay updated with school announcements and events</p>
              </div>
              <Link to="/school/blog" className="text-sm font-medium text-platform-accent hover:underline hidden sm:inline">
                Read all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentNews.map((post) => (
                <Link
                  key={post.id}
                  to={`/school/blog/${post.id}`}
                  className="rounded-lg border border-border bg-card p-6 hover:border-platform-accent/40 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt || post.content}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-platform-accent-soft border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to Begin Your Islamic Education Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of learners and discover the beauty of Islamic
            knowledge combined with academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ModernButton size="lg" onClick={() => (window.location.href = '/school/admissions')}>
              Start Application
              <ArrowRight className="h-4 w-4" />
            </ModernButton>
            <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/school/contact')}>
              Contact Us
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolHome;
