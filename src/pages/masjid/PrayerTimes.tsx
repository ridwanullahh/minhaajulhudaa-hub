import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  Clock,
  Calendar,
  MapPin,
  Bell,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Download,
  Share2,
  Settings
} from 'lucide-react';
import { masjidDB } from '@/lib/platform-db';

interface PrayerTime {
  name: string;
  adhan: string;
  iqamah: string;
  icon: React.ReactNode;
  isNext?: boolean;
}

const MasjidPrayerTimes = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrayerTimes();
    const interval = setInterval(() => {
      setCurrentDate(new Date());
      calculateNextPrayer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadPrayerTimes = async () => {
    try {
      const data = await masjidDB.get('prayer_times');
      const today = new Date().toISOString().split('T')[0];

      let todayPrayers = data.find(p => p.date === today);

      if (!todayPrayers) {
        // Create default prayer times for today
        todayPrayers = {
          date: today,
          fajr: { adhan: '5:30 AM', iqamah: '5:45 AM' },
          dhuhr: { adhan: '12:45 PM', iqamah: '1:00 PM' },
          asr: { adhan: '4:15 PM', iqamah: '4:30 PM' },
          maghrib: { adhan: '6:30 PM', iqamah: '6:35 PM' },
          isha: { adhan: '8:00 PM', iqamah: '8:15 PM' },
          jumah: { adhan: '1:00 PM', iqamah: '1:15 PM' }
        };

        await masjidDB.insert('prayer_times', todayPrayers);
      }

      const prayers: PrayerTime[] = [
        {
          name: 'Fajr',
          adhan: todayPrayers.fajr.adhan,
          iqamah: todayPrayers.fajr.iqamah,
          icon: <Sunrise className="w-6 h-6" />
        },
        {
          name: 'Dhuhr',
          adhan: todayPrayers.dhuhr.adhan,
          iqamah: todayPrayers.dhuhr.iqamah,
          icon: <Sun className="w-6 h-6" />
        },
        {
          name: 'Asr',
          adhan: todayPrayers.asr.adhan,
          iqamah: todayPrayers.asr.iqamah,
          icon: <Sun className="w-6 h-6" />
        },
        {
          name: 'Maghrib',
          adhan: todayPrayers.maghrib.adhan,
          iqamah: todayPrayers.maghrib.iqamah,
          icon: <Sunset className="w-6 h-6" />
        },
        {
          name: 'Isha',
          adhan: todayPrayers.isha.adhan,
          iqamah: todayPrayers.isha.iqamah,
          icon: <Moon className="w-6 h-6" />
        }
      ];

      // Add Jumah if it's Friday
      if (currentDate.getDay() === 5) {
        prayers.splice(1, 1, {
          name: 'Jumah',
          adhan: todayPrayers.jumah.adhan,
          iqamah: todayPrayers.jumah.iqamah,
          icon: <Sun className="w-6 h-6" />
        });
      }

      setPrayerTimes(prayers);
      calculateNextPrayer(prayers);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextPrayer = (prayers = prayerTimes) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      const prayerTime = convertTimeToMinutes(prayer.iqamah);
      if (currentTime < prayerTime) {
        setNextPrayer(prayer.name);
        const minutesUntil = prayerTime - currentTime;
        const hours = Math.floor(minutesUntil / 60);
        const minutes = minutesUntil % 60;
        setTimeUntilNext(`${hours}h ${minutes}m`);

        // Mark as next prayer
        const updatedPrayers = prayers.map(p => ({
          ...p,
          isNext: p.name === prayer.name
        }));
        setPrayerTimes(updatedPrayers);
        return;
      }
    }

    // If no prayer found for today, next is Fajr tomorrow
    setNextPrayer('Fajr (Tomorrow)');
    const fajrTomorrow = convertTimeToMinutes(prayers[0].iqamah) + (24 * 60);
    const minutesUntil = fajrTomorrow - currentTime;
    const hours = Math.floor(minutesUntil / 60);
    const minutes = minutesUntil % 60;
    setTimeUntilNext(`${hours}h ${minutes}m`);
  };

  const convertTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (period === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === 'AM' && hours === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prayer times...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Prayer <span className="text-platform-primary">Times</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Stay connected with your daily prayers. Never miss a prayer with our accurate timing system.
          </p>
        </div>

        {/* Current Time & Date */}
        <div className="text-center mb-12">
          <ModernCard variant="glass" className="inline-block p-8">
            <div className="text-4xl font-bold text-platform-primary mb-2">
              {formatTime(currentDate)}
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {formatDate(currentDate)}
            </div>
            <div className="flex items-center justify-center text-platform-secondary">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Minhaajulhudaa Islamic Center</span>
            </div>
          </ModernCard>
        </div>

        {/* Next Prayer Countdown */}
        <div className="text-center mb-16">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Next Prayer</h2>
            <div className="text-4xl font-bold text-platform-primary mb-2">{nextPrayer}</div>
            <div className="text-xl text-gray-700">in {timeUntilNext}</div>
          </ModernCard>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {prayerTimes.map((prayer, index) => (
            <ModernCard
              key={index}
              variant="glass"
              className={`text-center p-6 transition-all duration-300 ${
                prayer.isNext
                  ? 'ring-2 ring-platform-primary bg-platform-primary/5 transform scale-105'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className={`mb-4 flex justify-center ${
                prayer.isNext ? 'text-platform-primary' : 'text-gray-600'
              }`}>
                {prayer.icon}
              </div>

              <h3 className={`text-xl font-bold mb-3 ${
                prayer.isNext ? 'text-platform-primary' : 'text-gray-800'
              }`}>
                {prayer.name}
              </h3>

              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-600">Adhan</div>
                  <div className="text-lg font-semibold text-gray-800">{prayer.adhan}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Iqamah</div>
                  <div className="text-lg font-semibold text-platform-primary">{prayer.iqamah}</div>
                </div>
              </div>

              {prayer.isNext && (
                <div className="mt-4 flex items-center justify-center text-platform-primary">
                  <Bell className="w-4 h-4 mr-1 animate-pulse" />
                  <span className="text-sm font-medium">Next Prayer</span>
                </div>
              )}
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasjidPrayerTimes;