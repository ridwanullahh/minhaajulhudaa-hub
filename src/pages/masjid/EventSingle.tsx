import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';

const EventSingle = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadEvent = async () => {
        setIsLoading(true);
        try {
          const allItems = await masjidDB.get('events');
          const foundItem = allItems.find(p => p.id === id);
          setEvent(foundItem);
        } catch (error) {
          console.error('Error loading event:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadEvent();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading Event...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl mb-4">Event Not Found</h1>
        <Link to="/masjid/events"><ModernButton>Back to Events</ModernButton></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/masjid/events">
            <ModernButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to All Events
            </ModernButton>
          </Link>
        </div>

        <ModernCard variant="glass" className="p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mb-6">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2"/>{formatDate(event.date)}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/>{event.location}</div>
            </div>
            <div className="prose max-w-none text-foreground/90">
                <p>{event.description}</p>
            </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default EventSingle;
