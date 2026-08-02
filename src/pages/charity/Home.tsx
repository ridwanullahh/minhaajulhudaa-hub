import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Users,
  Target,
  TrendingUp,
  ArrowRight,
  HandHeart,
  Award,
  Quote,
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { charityDB } from '@/lib/platform-db';

/**
 * Charity Home page
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Cohesive palette with rose platform accent (applied via
 * .platform-charity on the layout wrapper). Shows active campaigns,
 * impact stats, testimonials, and quick donation CTA.
 */
const CharityHome: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRaised: 0, beneficiaries: 0, campaigns: 0, volunteers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [camp, test, donations, volunteers] = await Promise.all([
          charityDB.get('campaigns'),
          charityDB.get('testimonials'),
          charityDB.get('donations'),
          charityDB.get('volunteers'),
        ]);
        setCampaigns(camp.filter((c: any) => c.status === 'active').slice(0, 3));
        setTestimonials(test.filter((t: any) => t.approved).slice(0, 3));
        const totalRaised = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
        setStats({
          totalRaised,
          beneficiaries: 5000,
          campaigns: camp.length,
          volunteers: volunteers.length,
        });
      } catch (error) {
        console.error('Error loading charity data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatNaira = (amount: number) => {
    if (amount >= 1000000) return `NGN ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `NGN ${(amount / 1000).toFixed(0)}K`;
    return `NGN ${amount}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border bg-platform-accent-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-platform-accent mb-3">
              Sadaqah Jariyah
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Compassion in Action
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Serving the Ummah with transparency and accountability. Every
              donation reaches those in need, tracked from donor to beneficiary.
              May Allah accept from us and you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <ModernButton size="lg" onClick={() => (window.location.href = '/charity/campaigns')}>
                Donate Now
                <ArrowRight className="h-4 w-4" />
              </ModernButton>
              <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/charity/volunteer')}>
                Become a Volunteer
              </ModernButton>
            </div>
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Total Raised', value: loading ? '-' : formatNaira(stats.totalRaised), icon: TrendingUp },
              { label: 'Beneficiaries', value: stats.beneficiaries.toLocaleString() + '+', icon: Users },
              { label: 'Active Campaigns', value: stats.campaigns, icon: Target },
              { label: 'Volunteers', value: stats.volunteers, icon: HandHeart },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-platform-accent mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active campaigns */}
      {campaigns.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Active Campaigns</h2>
                <p className="text-muted-foreground">Your donation can make a difference today</p>
              </div>
              <Link to="/charity/campaigns" className="text-sm font-medium text-platform-accent hover:underline hidden sm:inline">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const progress = campaign.target > 0 ? Math.min((campaign.raised / campaign.target) * 100, 100) : 0;
                return (
                  <div key={campaign.id} className="rounded-lg border border-border bg-card p-6">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-platform-accent-soft text-platform-accent mb-3">
                      {campaign.category || 'Campaign'}
                    </span>
                    <h3 className="font-semibold text-foreground mb-2">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>
                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{formatNaira(campaign.raised || 0)}</span>
                        <span className="text-muted-foreground">of {formatNaira(campaign.target || 0)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-platform-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <Link to={`/charity/campaigns/${campaign.id}`} className="text-sm font-medium text-platform-accent hover:underline">
                      Donate now
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-20 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Voices of Impact</h2>
              <p className="text-muted-foreground">Stories from those we serve</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-lg border border-border bg-card p-6">
                  <Quote className="h-6 w-6 text-platform-accent mb-3" />
                  <p className="text-sm text-foreground leading-relaxed mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-platform-accent-soft text-platform-accent font-medium">
                      {t.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-platform-accent-soft border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-10 w-10 text-platform-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Be a Source of Sadaqah Jariyah
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            When you give to Minhaajulhudaa Charity, you invest in a continuous
            chain of benefit. Every well built, every orphan sponsored, every
            family fed is a reward that keeps growing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ModernButton size="lg" onClick={() => (window.location.href = '/charity/campaigns')}>
              Browse Campaigns
              <ArrowRight className="h-4 w-4" />
            </ModernButton>
            <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/charity/contact')}>
              Contact Us
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CharityHome;
