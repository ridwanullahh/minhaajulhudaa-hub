import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  BookOpen,
  Building2,
  Heart,
  Plane,
  ArrowRight,
  Search,
  Menu,
  X,
  Sparkles,
  Users,
  GraduationCap,
  Calendar,
  Globe2,
  ChevronRight,
} from 'lucide-react';

/**
 * RootDirectory - Main landing page
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * The front door to the Minhaajulhudaa Hub. Shows all four platforms
 * with frictionless navigation: one click to enter any platform, plus
 * a global search bar that routes to the right platform's search.
 *
 * Design principles:
 *   - Generous whitespace, restrained color
 *   - Per-platform accent colors via the .platform-NAME classes
 *   - No heavy gradients; subtle tints and borders
 *   - Progressive disclosure: hero -> platforms -> features -> CTA
 *   - Mobile-first responsive
 */
const RootDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const platforms = [
    {
      name: 'Islamic School',
      slug: 'school',
      tagline: 'Authentic Islamic education with academic excellence',
      description:
        'A comprehensive learning management system nurturing minds and souls with Quran memorization, Tajweed, Arabic language, and Islamic studies, taught by qualified instructors.',
      icon: BookOpen,
      platformClass: 'platform-school',
      features: ['Student Portal', 'LMS', 'Admissions', 'E-Library', 'Online Shop', 'Exams'],
      stats: { label: 'Programs', value: '12+' },
      accentText: 'text-amber-600',
      accentBg: 'bg-amber-50',
      accentBorder: 'border-amber-200',
    },
    {
      name: 'Masjid',
      slug: 'masjid',
      tagline: 'A community anchored in worship and knowledge',
      description:
        'Daily prayer times, Friday khutbah archive, Quran recitations from renowned qaris, Islamic lectures, community events, and a digital library of authentic resources.',
      icon: Building2,
      platformClass: 'platform-masjid',
      features: ['Prayer Times', 'Quran Player', 'Audio Library', 'Events', 'Donations', 'Announcements'],
      stats: { label: 'Daily worshippers', value: '500+' },
      accentText: 'text-teal-600',
      accentBg: 'bg-teal-50',
      accentBorder: 'border-teal-200',
    },
    {
      name: 'Charity Foundation',
      slug: 'charity',
      tagline: 'Serving the Ummah with compassion and accountability',
      description:
        'Transparent donation campaigns, zakat calculator, volunteer management, beneficiary tracking, and impact reporting. Every naira is accounted for and reaches those in need.',
      icon: Heart,
      platformClass: 'platform-charity',
      features: ['Campaigns', 'Zakat Calculator', 'Volunteer', 'Impact Reports', 'Beneficiaries', 'Sadaqah Jariyah'],
      stats: { label: 'Lives impacted', value: '5,000+' },
      accentText: 'text-rose-600',
      accentBg: 'bg-rose-50',
      accentBorder: 'border-rose-200',
    },
    {
      name: 'Travels & Tours',
      slug: 'travels',
      tagline: 'Your companion for Hajj, Umrah, and spiritual journeys',
      description:
        'Curated Hajj and Umrah packages with vetted accommodation, experienced guides, visa assistance, and end-to-end booking management. Focus on your ibadah, we handle the logistics.',
      icon: Plane,
      platformClass: 'platform-travels',
      features: ['Hajj Packages', 'Umrah Services', 'Booking System', 'Visa Assistance', 'Itineraries', 'Reviews'],
      stats: { label: 'Pilgrims served', value: '1,200+' },
      accentText: 'text-indigo-600',
      accentBg: 'bg-indigo-50',
      accentBorder: 'border-indigo-200',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to the school search as a default; each platform has its
    // own search. For now, navigate to the school blog search which
    // is the broadest content type.
    navigate(`/school/blog?q=${encodeURIComponent(searchQuery)}`);
  };

  const enterPlatform = (slug: string) => {
    navigate(`/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ================================================================
          Top Navigation Bar
          ================================================================ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-lg font-semibold text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">Minhaajulhudaa</span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {platforms.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => enterPlatform(p.slug)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                >
                  {p.name}
                </button>
              ))}
            </nav>

            {/* CTA + mobile menu */}
            <div className="flex items-center gap-2">
              <ModernButton
                size="sm"
                variant="default"
                onClick={() => enterPlatform('school')}
                className="hidden sm:inline-flex"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </ModernButton>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-3">
              {platforms.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => enterPlatform(p.slug)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-md"
                >
                  {p.name}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ================================================================
          Hero Section
          ================================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* BismiLLAH */}
            <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wide">
              BismiLLAH Ar-Rahman Ar-Roheem
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Minhaajulhudaa Hub
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              A unified Islamic platform bringing together education, worship,
              charity, and sacred journeys - serving the Ummah with excellence,
              integrity, and accountability.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search across all platforms..."
                  className="w-full h-12 pl-11 pr-4 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </form>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">Platforms</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">6,700+</div>
                <div className="text-sm text-muted-foreground">Community served</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Sadaqah-driven</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Platform Cards
          ================================================================ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Choose Your Platform
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each platform is tailored to a specific need, yet shares the same
              account, design language, and commitment to authentic Islamic
              values.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.slug}
                  className={`${platform.platformClass} group relative rounded-xl border border-border bg-card p-6 sm:p-8 transition-all duration-200 hover:border-platform-accent/40 hover:shadow-sm cursor-pointer`}
                  onClick={() => enterPlatform(platform.slug)}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${platform.accentBg} ${platform.accentBorder} border`}>
                        <Icon className={`h-6 w-6 ${platform.accentText}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {platform.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {platform.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${platform.accentText}`}>
                        {platform.stats.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {platform.stats.label}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {platform.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {platform.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${platform.accentText} group-hover:underline`}>
                      Enter platform
                    </span>
                    <ArrowRight className={`h-4 w-4 ${platform.accentText} transition-transform group-hover:translate-x-1`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          Features Section
          ================================================================ */}
      <section className="py-16 sm:py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Built for the Modern Muslim Community
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade technology with an Islamic soul. Every feature is
              designed to bring benefit to the Ummah.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'Authentic Curriculum',
                description:
                  'Courses designed by qualified scholars, covering Quran, Hadith, Fiqh, Seerah, and Arabic language with proper isnad and methodology.',
              },
              {
                icon: Users,
                title: 'Community-First',
                description:
                  'Real-time prayer times, community events, volunteer coordination, and announcements keep everyone connected and engaged.',
              },
              {
                icon: Heart,
                title: 'Transparent Charity',
                description:
                  'Every donation is tracked from donor to beneficiary. Public impact reports ensure accountability and build trust.',
              },
              {
                icon: Calendar,
                title: 'Hajj & Umrah Ready',
                description:
                  'Complete travel management with vetted packages, experienced guides, visa assistance, and end-to-end booking support.',
              },
              {
                icon: Globe2,
                title: 'Accessible Everywhere',
                description:
                  'Mobile-responsive design works on any device. Access your courses, prayer times, and donations from anywhere in the world.',
              },
              {
                icon: Sparkles,
                title: 'Secure & Private',
                description:
                  'Server-side password hashing, encrypted sessions, and strict access controls protect your data and your community.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA Section
          ================================================================ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Begin Your Journey Today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Muslims who are learning, worshipping, giving, and
            travelling with Minhaajulhudaa. May Allah accept from us and you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ModernButton size="lg" onClick={() => enterPlatform('school')}>
              Explore the School
              <ArrowRight className="h-4 w-4" />
            </ModernButton>
            <ModernButton size="lg" variant="outline" onClick={() => enterPlatform('masjid')}>
              Visit the Masjid
            </ModernButton>
            <ModernButton size="lg" variant="outline" onClick={() => enterPlatform('charity')}>
              Support Charity
            </ModernButton>
          </div>
        </div>
      </section>

      {/* ================================================================
          Footer
          ================================================================ */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="font-semibold text-foreground">Minhaajulhudaa Hub</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                A unified Islamic platform serving the Ummah with education,
                worship, charity, and sacred journeys.
              </p>
            </div>

            {/* Platform links */}
            {platforms.slice(0, 3).map((p) => (
              <div key={p.slug}>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {p.name}
                </h4>
                <ul className="space-y-2">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f}>
                      <button
                        onClick={() => enterPlatform(p.slug)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {f}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Minhaajulhudaa Hub. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Wa baarokaLLAHU feekum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootDirectory;
