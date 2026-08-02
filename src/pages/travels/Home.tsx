import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  MapPin,
  Star,
  ArrowRight,
  Calendar,
  Users,
  CheckCircle,
  Compass,
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { travelsDB } from '@/lib/platform-db';

/**
 * Travels Home page
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Cohesive palette with indigo platform accent (applied via
 * .platform-travels on the layout wrapper). Shows featured packages,
 * reviews, and booking CTA.
 */
const TravelsHome: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pkgs, revs] = await Promise.all([
          travelsDB.get('packages'),
          travelsDB.get('reviews'),
        ]);
        setPackages(pkgs.filter((p: any) => p.available).slice(0, 3));
        setReviews(revs.filter((r: any) => r.verified).slice(0, 3));
      } catch (error) {
        console.error('Error loading travels data:', error);
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
              BismiLLAH Ar-Rahman Ar-Roheem
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Sacred Journeys Await
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Your trusted partner for Hajj, Umrah, and Islamic heritage tours.
              Vetted accommodation, experienced guides, and end-to-end booking
              management. Focus on your ibadah, we handle the logistics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <ModernButton size="lg" onClick={() => (window.location.href = '/travels/packages')}>
                View Packages
                <ArrowRight className="h-4 w-4" />
              </ModernButton>
              <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/travels/booking')}>
                Book Now
              </ModernButton>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Pilgrims served', value: '1,200+', icon: Users },
              { label: 'Years of service', value: '10+', icon: Calendar },
              { label: 'Average rating', value: '4.9/5', icon: Star },
              { label: 'Licensed operator', value: 'TL-xxxxx', icon: CheckCircle },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-platform-accent mb-2" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured packages */}
      {packages.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Featured Packages</h2>
                <p className="text-muted-foreground">Curated Hajj and Umrah packages</p>
              </div>
              <Link to="/travels/packages" className="text-sm font-medium text-platform-accent hover:underline hidden sm:inline">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="rounded-lg border border-border bg-card overflow-hidden hover:border-platform-accent/40 transition-colors">
                  <div className="bg-platform-accent-soft p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-platform-accent text-platform-accent-foreground uppercase">
                        {pkg.type}
                      </span>
                      <span className="text-sm text-muted-foreground">{pkg.duration} days</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{pkg.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pkg.description}</p>
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {pkg.features.slice(0, 3).map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-platform-accent flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="text-lg font-bold text-foreground">{formatNaira(pkg.price)}</div>
                      </div>
                      <Link
                        to={`/travels/packages/${pkg.id}`}
                        className="text-sm font-medium text-platform-accent hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 sm:py-20 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Pilgrim Reviews</h2>
              <p className="text-muted-foreground">What our pilgrims say about their journey</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-platform-accent fill-current' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4">"{review.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-platform-accent-soft text-platform-accent font-medium">
                      {review.customerName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{review.customerName}</div>
                      <div className="text-xs text-muted-foreground">Verified pilgrim</div>
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
          <Compass className="h-10 w-10 text-platform-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Begin Your Sacred Journey
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Let us handle the logistics while you focus on your ibadah. Our
            experienced team will guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ModernButton size="lg" onClick={() => (window.location.href = '/travels/packages')}>
              Explore Packages
              <ArrowRight className="h-4 w-4" />
            </ModernButton>
            <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/travels/contact')}>
              Contact Us
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelsHome;
