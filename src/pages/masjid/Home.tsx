import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Volume2,
  Heart,
  Users,
  BookOpen,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { masjidDB } from '@/lib/platform-db';

/**
 * Masjid Home page
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Cohesive palette with teal platform accent (applied via
 * .platform-masjid on the layout wrapper). Shows prayer times,
 * upcoming events, and quick links to audio library and donations.
 */
const MasjidHome: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pt, events, ann] = await Promise.all([
          masjidDB.get('prayer_times'),
          masjidDB.get('events'),
          masjidDB.get('announcements'),
        ]);
        // Today's prayer times
        const today = new Date().toISOString().split('T')[0];
        setPrayerTimes(pt.find((p: any) => p.date === today) || pt[0] || null);
        setUpcomingEvents(events.slice(0, 3));
        setAnnouncements(ann.filter((a: any) => a.status === 'active').slice(0, 3));
      } catch (error) {
        console.error('Error loading masjid data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const prayers = prayerTimes
    ? [
        { name: 'Fajr', time: prayerTimes.fajr, iqamah: prayerTimes.fajrIqamah },
        { name: 'Dhuhr', time: prayerTimes.dhuhr, iqamah: prayerTimes.dhuhrIqamah },
        { name: 'Asr', time: prayerTimes.asr, iqamah: prayerTimes.asrIqamah },
        { name: 'Maghrib', time: prayerTimes.maghrib, iqamah: prayerTimes.maghribIqamah },
        { name: 'Isha', time: prayerTimes.isha, iqamah: prayerTimes.ishaIqamah },
      ]
    : [];

  const quickLinks = [
    { icon: Clock, label: 'Prayer Times', href: '/masjid/prayer-times', desc: 'Daily and Jumah schedule' },
    { icon: Volume2, label: 'Audio Library', href: '/masjid/audio', desc: 'Lectures and Quran recitations' },
    { icon: Heart, label: 'Donate', href: '/masjid/donations', desc: 'Support the masjid' },
    { icon: Calendar, label: 'Events', href: '/masjid/events', desc: 'Community gatherings' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero with prayer times */}
      <section className="border-b border-border bg-platform-accent-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-platform-accent mb-3">
                Assalamu alaykum wa rahmatullah
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                Minhaajulhudaa Masjid
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                A community anchored in worship and knowledge. Join us for daily
                prayers, weekly halaqahs, and community events throughout the year.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Lagos, Nigeria
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> 500+ daily worshippers
                </span>
              </div>
              <ModernButton size="lg" onClick={() => (window.location.href = '/masjid/donations')}>
                Support the Masjid
                <ArrowRight className="h-4 w-4" />
              </ModernButton>
            </div>

            {/* Prayer times card */}
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Today's Prayer Times</h2>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 rounded-md bg-secondary animate-pulse" />
                  ))}
                </div>
              ) : prayers.length > 0 ? (
                <div className="space-y-2">
                  {prayers.map((prayer) => (
                    <div
                      key={prayer.name}
                      className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                    >
                      <span className="font-medium text-foreground">{prayer.name}</span>
                      <div className="text-right">
                        <span className="text-foreground">{prayer.time}</span>
                        {prayer.iqamah && (
                          <span className="ml-2 text-sm text-muted-foreground">IQ: {prayer.iqamah}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {prayerTimes?.jumah && (
                    <div className="flex items-center justify-between py-2.5 mt-2 rounded-md bg-platform-accent-soft px-3">
                      <span className="font-medium text-platform-accent">Jumah</span>
                      <span className="text-platform-accent">{prayerTimes.jumah}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Prayer times not available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-lg border border-border bg-card p-5 hover:border-platform-accent/40 hover:shadow-sm transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-platform-accent-soft text-platform-accent mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{link.label}</h3>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="py-12 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Announcements</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="rounded-lg border border-border bg-card p-5">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-platform-accent-soft text-platform-accent mb-2">
                    {ann.category || 'Announcement'}
                  </span>
                  <h3 className="font-medium text-foreground mb-2">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
              <Link to="/masjid/events" className="text-sm font-medium text-platform-accent hover:underline">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-platform-accent" />
                    <span className="text-sm text-muted-foreground">
                      {event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {event.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-platform-accent-soft border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-10 w-10 text-platform-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Join Our Community
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Subscribe to our announcements, attend our events, or volunteer your
            time. Everyone is welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ModernButton size="lg" onClick={() => (window.location.href = '/masjid/contact')}>
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </ModernButton>
            <ModernButton variant="outline" size="lg" onClick={() => (window.location.href = '/masjid/donations')}>
              Donate
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MasjidHome;
