import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

const MasjidEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const data = await masjidDB.get('events');
        setEvents(data);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading Events...</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Community <span className="text-primary">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for educational, spiritual, and community-building events.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <ModernCard key={event.id} variant="glass" className="p-6 flex flex-col group">
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 text-sm font-semibold rounded-full">
                    {event.category || 'General'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 flex-grow group-hover:text-primary transition-colors">
                {event.title}
              </h3>

              <div className="space-y-3 text-muted-foreground text-sm mb-6">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location || 'Main Hall'}</span>
                </div>
              </div>

              <p className="text-foreground/80 mb-6">{event.description}</p>

              <Link to={`/masjid/events/${event.id}`} className="mt-auto">
                <ModernButton className="w-full">
                  View Details
                </ModernButton>
              </Link>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasjidEvents;