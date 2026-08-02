import React, { useState, useMemo } from 'react';
import { travelsDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { useListData } from '@/hooks/useListData';
import { toast } from 'sonner';
import {
  Calculator,
  Users,
  Calendar,
  Plane,
  TrendingUp,
  Percent,
  DollarSign,
  Save,
} from 'lucide-react';

/**
 * DynamicPricingEngine
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Admin tool for calculating dynamic package prices based on:
 *   - Base price
 *   - Number of travelers (group discount tiers)
 *   - Seasonal multiplier (peak/off-peak)
 *   - Early-bird discount (days before departure)
 *   - Room type surcharge
 *
 * Also manages payment plans: splits the total into installments
 * (deposit + balance, or 3-installment plan).
 *
 * Addresses PRODUCTION_GAPS.md item 4.4 (Travels booking engine -
 * dynamic pricing, payment plan management).
 */

const SEASON_MULTIPLIERS = {
  off_peak: { label: 'Off-Peak', multiplier: 0.9 },
  standard: { label: 'Standard', multiplier: 1.0 },
  peak: { label: 'Peak (Ramadan/Hajj)', multiplier: 1.25 },
  high_peak: { label: 'High Peak (Hajj Season)', multiplier: 1.5 },
};

const ROOM_SURCHARGES = {
  shared: { label: 'Shared Room (4 pax)', surcharge: 0 },
  double: { label: 'Double Room', surcharge: 50000 },
  single: { label: 'Single Room', surcharge: 150000 },
  suite: { label: 'Suite', surcharge: 300000 },
};

// Group discount tiers: more travelers = bigger discount
function getGroupDiscount(travelerCount: number): number {
  if (travelerCount >= 10) return 0.15; // 15% off
  if (travelerCount >= 6) return 0.10; // 10% off
  if (travelerCount >= 4) return 0.07; // 7% off
  if (travelerCount >= 2) return 0.05; // 5% off
  return 0;
}

// Early bird discount: book earlier = bigger discount
function getEarlyBirdDiscount(daysBeforeDeparture: number): number {
  if (daysBeforeDeparture >= 90) return 0.10; // 10% off for 90+ days
  if (daysBeforeDeparture >= 60) return 0.07; // 7% off for 60+ days
  if (daysBeforeDeparture >= 30) return 0.05; // 5% off for 30+ days
  return 0;
}

interface PaymentPlan {
  installments: { label: string; amount: number; dueDate: string }[];
  total: number;
}

function calculatePaymentPlan(total: number, planType: 'deposit_balance' | 'three_installments' | 'monthly'): PaymentPlan {
  const now = new Date();
  if (planType === 'deposit_balance') {
    const deposit = total * 0.4;
    const balance = total - deposit;
    return {
      installments: [
        { label: 'Deposit (40%)', amount: deposit, dueDate: now.toISOString().split('T')[0] },
        { label: 'Balance (60%)', amount: balance, dueDate: new Date(now.getTime() + 30 * 86400000).toISOString().split('T')[0] },
      ],
      total,
    };
  }
  if (planType === 'three_installments') {
    const each = total / 3;
    return {
      installments: [
        { label: '1st Installment', amount: each, dueDate: now.toISOString().split('T')[0] },
        { label: '2nd Installment', amount: each, dueDate: new Date(now.getTime() + 30 * 86400000).toISOString().split('T')[0] },
        { label: '3rd Installment', amount: each, dueDate: new Date(now.getTime() + 60 * 86400000).toISOString().split('T')[0] },
      ],
      total,
    };
  }
  // monthly: 6 installments
  const each = total / 6;
  const installments = [];
  for (let i = 0; i < 6; i++) {
    installments.push({
      label: `Month ${i + 1}`,
      amount: each,
      dueDate: new Date(now.getTime() + i * 30 * 86400000).toISOString().split('T')[0],
    });
  }
  return { installments, total };
}

const DynamicPricingEngine: React.FC = () => {
  const { data: packages } = useListData(() => travelsDB.get('packages'));

  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [travelerCount, setTravelerCount] = useState(1);
  const [season, setSeason] = useState<keyof typeof SEASON_MULTIPLIERS>('standard');
  const [roomType, setRoomType] = useState<keyof typeof ROOM_SURCHARGES>('shared');
  const [departureDate, setDepartureDate] = useState('');
  const [paymentPlanType, setPaymentPlanType] = useState<'deposit_balance' | 'three_installments' | 'monthly'>('deposit_balance');
  const [saving, setSaving] = useState(false);

  const selectedPackage = packages.find((p: any) => p.id === selectedPackageId);

  const pricing = useMemo(() => {
    if (!selectedPackage) return null;
    const basePrice = selectedPackage.price || 0;

    const daysBeforeDeparture = departureDate
      ? Math.max(0, Math.ceil((new Date(departureDate).getTime() - Date.now()) / 86400000))
      : 0;

    const groupDiscount = getGroupDiscount(travelerCount);
    const earlyBirdDiscount = getEarlyBirdDiscount(daysBeforeDeparture);
    const seasonMultiplier = SEASON_MULTIPLIERS[season].multiplier;
    const roomSurcharge = ROOM_SURCHARGES[roomType].surcharge;

    // Per-person price calculation
    const seasonalPrice = basePrice * seasonMultiplier;
    const withRoom = seasonalPrice + roomSurcharge;
    const afterGroupDiscount = withRoom * (1 - groupDiscount);
    const afterEarlyBird = afterGroupDiscount * (1 - earlyBirdDiscount);
    const perPersonPrice = Math.round(afterEarlyBird);

    const totalPrice = perPersonPrice * travelerCount;

    const paymentPlan = calculatePaymentPlan(totalPrice, paymentPlanType);

    return {
      basePrice,
      seasonalPrice: Math.round(seasonalPrice),
      roomSurcharge,
      groupDiscountPercent: groupDiscount * 100,
      earlyBirdDiscountPercent: earlyBirdDiscount * 100,
      earlyBirdDays: daysBeforeDeparture,
      perPersonPrice,
      totalPrice,
      paymentPlan,
      seasonMultiplier,
    };
  }, [selectedPackage, travelerCount, season, roomType, departureDate, paymentPlanType]);

  const formatNaira = (amount: number) => `NGN ${amount.toLocaleString()}`;

  const handleSaveBooking = async () => {
    if (!pricing || !selectedPackage) return;
    setSaving(true);
    try {
      await travelsDB.insert('bookings', {
        packageId: selectedPackage.id,
        customerId: 'walk-in',
        platform: 'travels',
        status: 'pending',
        totalAmount: pricing.totalPrice,
        paidAmount: 0,
        travelers: Array(travelerCount).fill({ name: '' }),
        specialRequests: `Season: ${SEASON_MULTIPLIERS[season].label}, Room: ${ROOM_SURCHARGES[roomType].label}`,
        bookingDate: new Date().toISOString(),
        travelDate: departureDate || undefined,
        paymentPlan: pricing.paymentPlan.installments,
      });
      toast.success('Quote saved as pending booking');
    } catch (err: any) {
      console.error('Error saving booking:', err);
      toast.error('Failed to save booking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-6 w-6 text-platform-accent" />
            <h1 className="text-3xl font-bold text-foreground">Dynamic Pricing Engine</h1>
          </div>
          <p className="text-muted-foreground">Calculate package prices with seasonal, group, and early-bird adjustments</p>
        </div>

        {/* Package selection + inputs */}
        <ModernCard className="mb-6">
          <h2 className="font-semibold text-foreground mb-4">Booking Parameters</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Package</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a package...</option>
                {packages.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.title} ({formatNaira(p.price || 0)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Number of Travelers</label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(SEASON_MULTIPLIERS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label} ({val.multiplier}x)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(ROOM_SURCHARGES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label} (+{formatNaira(val.surcharge)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Departure Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Payment Plan</label>
              <select
                value={paymentPlanType}
                onChange={(e) => setPaymentPlanType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="deposit_balance">Deposit (40%) + Balance (60%)</option>
                <option value="three_installments">3 Equal Installments</option>
                <option value="monthly">6 Monthly Payments</option>
              </select>
            </div>
          </div>
        </ModernCard>

        {/* Pricing breakdown */}
        <DataState
          isLoading={false}
          error={null}
          isEmpty={!pricing}
          emptyTitle="Select a package to calculate pricing"
          emptyMessage="Choose a travel package above to see the dynamic pricing breakdown."
          emptyIcon={<Plane className="h-6 w-6" />}
        >
          {pricing && (
            <>
              <ModernCard className="mb-6">
                <h2 className="font-semibold text-foreground mb-4">Price Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price (per person)</span>
                    <span className="text-foreground">{formatNaira(pricing.basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Seasonal adjustment ({SEASON_MULTIPLIERS[season].label})
                    </span>
                    <span className="text-foreground">{formatNaira(pricing.seasonalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room surcharge ({ROOM_SURCHARGES[roomType].label})</span>
                    <span className="text-foreground">+ {formatNaira(pricing.roomSurcharge)}</span>
                  </div>
                  {pricing.groupDiscountPercent > 0 && (
                    <div className="flex justify-between text-sm text-platform-accent">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Group discount ({travelerCount} travelers)</span>
                      <span>- {pricing.groupDiscountPercent}%</span>
                    </div>
                  )}
                  {pricing.earlyBirdDiscountPercent > 0 && (
                    <div className="flex justify-between text-sm text-platform-accent">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Early-bird discount ({pricing.earlyBirdDays} days before)</span>
                      <span>- {pricing.earlyBirdDiscountPercent}%</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-semibold text-foreground">Per-person price</span>
                    <span className="font-bold text-foreground">{formatNaira(pricing.perPersonPrice)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-platform-accent">
                    <span className="font-semibold text-foreground">Total ({travelerCount} travelers)</span>
                    <span className="text-2xl font-bold text-platform-accent">{formatNaira(pricing.totalPrice)}</span>
                  </div>
                </div>
              </ModernCard>

              {/* Payment plan */}
              <ModernCard className="mb-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-platform-accent" />
                  Payment Plan
                </h2>
                <div className="space-y-3">
                  {pricing.paymentPlan.installments.map((inst, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <div className="font-medium text-foreground">{inst.label}</div>
                        <div className="text-xs text-muted-foreground">Due: {inst.dueDate}</div>
                      </div>
                      <div className="text-lg font-semibold text-foreground">{formatNaira(inst.amount)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-foreground">{formatNaira(pricing.paymentPlan.total)}</span>
                  </div>
                </div>
              </ModernCard>

              <ModernButton size="lg" className="w-full" onClick={handleSaveBooking} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save as Pending Booking'}
              </ModernButton>
            </>
          )}
        </DataState>
      </div>
    </div>
  );
};

export default DynamicPricingEngine;
