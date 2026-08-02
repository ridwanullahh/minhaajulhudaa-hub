import React, { useMemo } from 'react';
import { charityDB } from '@/lib/platform-db';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { useListData } from '@/hooks/useListData';
import {
  TrendingUp,
  Users,
  Target,
  Heart,
  DollarSign,
  Calendar,
  Award,
  Activity,
} from 'lucide-react';

/**
 * ImpactDashboard
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Charity admin dashboard showing real-time impact metrics: total
 * raised, recurring vs one-time donations, campaign progress,
 * beneficiary count, volunteer hours, and recent donation activity.
 *
 * Addresses PRODUCTION_GAPS.md item 4.3 (Charity donation tracking
 * incomplete - impact metrics).
 */
const ImpactDashboard: React.FC = () => {
  const { data: donations, isLoading: donLoading, error: donError, refetch: refetchDon } = useListData(() => charityDB.get('donations'));
  const { data: campaigns } = useListData(() => charityDB.get('campaigns'));
  const { data: beneficiaries } = useListData(() => charityDB.get('beneficiaries'));
  const { data: volunteers } = useListData(() => charityDB.get('volunteers'));

  const metrics = useMemo(() => {
    const totalRaised = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const recurringDonations = donations.filter((d: any) => d.recurring);
    const recurringAmount = recurringDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const oneTimeAmount = totalRaised - recurringAmount;
    const uniqueDonors = new Set(donations.map((d: any) => d.donorEmail).filter(Boolean)).size;
    const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
    const totalBeneficiaries = beneficiaries.length;
    const totalVolunteerHours = volunteers.reduce((sum: number, v: any) => sum + (v.hoursLogged || 0), 0);

    // Monthly breakdown (last 6 months)
    const now = new Date();
    const monthly: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const monthDonations = donations.filter((don: any) => {
        if (!don.createdAt) return false;
        const donDate = new Date(don.createdAt);
        return donDate.getFullYear() === d.getFullYear() && donDate.getMonth() === d.getMonth();
      });
      monthly.push({
        month: monthName,
        amount: monthDonations.reduce((s: number, don: any) => s + (don.amount || 0), 0),
      });
    }

    return {
      totalRaised,
      recurringAmount,
      oneTimeAmount,
      recurringCount: recurringDonations.length,
      uniqueDonors,
      activeCampaigns,
      totalBeneficiaries,
      totalVolunteerHours,
      monthly,
    };
  }, [donations, campaigns, beneficiaries, volunteers]);

  const formatNaira = (amount: number) => {
    if (amount >= 1000000) return `NGN ${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `NGN ${(amount / 1000).toFixed(0)}K`;
    return `NGN ${amount.toLocaleString()}`;
  };

  const maxMonthly = Math.max(...metrics.monthly.map((m) => m.amount), 1);

  const statCards = [
    { label: 'Total Raised', value: formatNaira(metrics.totalRaised), icon: DollarSign, color: 'text-platform-accent' },
    { label: 'Recurring Donations', value: formatNaira(metrics.recurringAmount), sub: `${metrics.recurringCount} donors`, icon: Calendar, color: 'text-platform-accent' },
    { label: 'One-time Donations', value: formatNaira(metrics.oneTimeAmount), icon: Heart, color: 'text-platform-accent' },
    { label: 'Unique Donors', value: metrics.uniqueDonors, icon: Users, color: 'text-platform-accent' },
    { label: 'Active Campaigns', value: metrics.activeCampaigns, icon: Target, color: 'text-platform-accent' },
    { label: 'Beneficiaries', value: metrics.totalBeneficiaries, icon: Award, color: 'text-platform-accent' },
    { label: 'Volunteer Hours', value: metrics.totalVolunteerHours, icon: Activity, color: 'text-platform-accent' },
    { label: 'Avg Donation', value: formatNaira(donations.length > 0 ? metrics.totalRaised / donations.length : 0), icon: TrendingUp, color: 'text-platform-accent' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Impact Dashboard</h1>
          <p className="text-muted-foreground">Real-time metrics on donations, campaigns, and community impact</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
                <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                {stat.sub && <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>}
              </div>
            );
          })}
        </div>

        {/* Monthly chart */}
        <ModernCard className="mb-8">
          <h2 className="font-semibold text-foreground mb-4">Donation Trend (Last 6 Months)</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {metrics.monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-medium text-foreground">{m.amount > 0 ? formatNaira(m.amount) : ''}</div>
                <div className="w-full bg-secondary rounded-t-md overflow-hidden flex items-end" style={{ height: '120px' }}>
                  <div
                    className="w-full bg-platform-accent rounded-t-md transition-all"
                    style={{ height: `${(m.amount / maxMonthly) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">{m.month}</div>
              </div>
            ))}
          </div>
        </ModernCard>

        {/* Campaign progress + Recent donations */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Campaign progress */}
          <ModernCard>
            <h2 className="font-semibold text-foreground mb-4">Campaign Progress</h2>
            <DataState
              isLoading={false}
              error={null}
              isEmpty={campaigns.length === 0}
              emptyTitle="No campaigns"
              emptyMessage="Create campaigns to track progress."
            >
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((c: any) => {
                  const progress = c.target > 0 ? Math.min((c.raised / c.target) * 100, 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground truncate">{c.title}</span>
                        <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-platform-accent rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </DataState>
          </ModernCard>

          {/* Recent donations */}
          <ModernCard>
            <h2 className="font-semibold text-foreground mb-4">Recent Donations</h2>
            <DataState
              isLoading={donLoading}
              error={donError}
              isEmpty={!donLoading && !donError && donations.length === 0}
              onRetry={refetchDon}
              emptyTitle="No donations yet"
              emptyMessage="Donations will appear here once received."
            >
              <div className="space-y-3">
                {donations.slice(0, 8).map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {d.anonymous ? 'Anonymous' : d.donor || 'Unknown'}
                      </div>
                      {d.recurring && (
                        <span className="text-xs text-platform-accent">Recurring ({d.frequency || 'monthly'})</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-foreground">{formatNaira(d.amount || 0)}</div>
                  </div>
                ))}
              </div>
            </DataState>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
