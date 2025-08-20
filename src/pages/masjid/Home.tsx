import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Volume2, 
  Heart, 
  Users, 
  BookOpen,
  Home as Mosque,
  Star,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { masjidDB } from '@/lib/platform-db';

const MasjidHome = () => {
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: { adhan: '5:30 AM', iqamah: '5:45 AM' },
    dhuhr: { adhan: '12:45 PM', iqamah: '1:00 PM' },
    asr: { adhan: '4:15 PM', iqamah: '4:30 PM' },
    maghrib: { adhan: '6:30 PM', iqamah: '6:35 PM' },
    isha: { adhan: '8:00 PM', iqamah: '8:15 PM' },
    jumah: { adhan: '1:00 PM', iqamah: '1:15 PM' }
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isQuranPlaying, setIsQuranPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState('Sheikh Abdul Rahman Al-Sudais');
  const [currentSurah, setCurrentSurah] = useState('Surah Al-Fatiha');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audioInstance = new Audio('https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/001.mp3');
    audioInstance.loop = true;
    setAudio(audioInstance);

    return () => {
      // Cleanup audio element on component unmount
      audioInstance.pause();
      setAudio(null);
    };
  }, []);

  useEffect(() => {
    // Load real-time data
    const loadData = async () => {
      try {
        const [events, prayers] = await Promise.all([
          masjidDB.get('events'),
          masjidDB.get('prayer_times')
        ]);

        setUpcomingEvents(events.slice(0, 3));
        
        // Get today's prayer times if available
        const today = new Date().toISOString().split('T')[0];
        const todayPrayers = prayers.find(p => p.date === today);
        if (todayPrayers) {
          setPrayerTimes(todayPrayers);
        }
      } catch (error) {
        console.error('Error loading masjid data:', error);
      }
    };

    loadData();
  }, []);

  const facilities = [
    { name: "Main Prayer Hall", capacity: "500 worshippers" },
    { name: "Women's Section", capacity: "200 worshippers" },
    { name: "Islamic Library", capacity: "1000+ books" },
    { name: "Community Center", capacity: "150 people" },
    { name: "Children's Area", capacity: "50 children" },
    { name: "Ablution Facilities", capacity: "Modern & clean" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Prayer Times */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/mosque-pattern.svg')] opacity-10" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Mosque className="w-12 h-12 text-secondary mr-4" />
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">
                      Minhaajulhudaa
                    </span>
                  </h1>
                  <p className="text-xl text-secondary/80">Islamic Center & Masjid</p>
                </div>
              </div>
              
              <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
                Your spiritual home in the community. Building bridges through worship, 
                knowledge, and service to Allah and humanity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <ModernButton 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Join Our Community
                </ModernButton>
                <ModernButton 
                  variant="outline" 
                  size="lg"
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  Donate Now
                </ModernButton>
              </div>
            </div>
            
            {/* Prayer Times Card */}
            <div className="lg:col-span-1">
              <ModernCard variant="glass" className="bg-background/10 backdrop-blur-md border-secondary/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-secondary mb-2">Today's Prayer Times</h3>
                  <p className="text-secondary/80 text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Fajr', time: prayerTimes.fajr, next: true },
                    { name: 'Dhuhr', time: prayerTimes.dhuhr },
                    { name: 'Asr', time: prayerTimes.asr },
                    { name: 'Maghrib', time: prayerTimes.maghrib },
                    { name: 'Isha', time: prayerTimes.isha },
                    { name: 'Jumah', time: prayerTimes.jumah, special: true }
                  ].map((prayer, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        prayer.next 
                          ? 'bg-secondary/20 border border-secondary/30'
                          : prayer.special 
                          ? 'bg-primary/20 border border-primary/30'
                          : 'bg-background/5'
                      }`}
                    >
                      <span className="font-medium text-primary-foreground">{prayer.name}</span>
                      <div className="text-right">
                        <div className="text-primary-foreground/80 font-mono text-sm">{prayer.time.adhan}</div>
                        <div className="text-secondary/90 font-mono text-xs">{prayer.time.iqamah}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </div>
          </div>
        </div>
      </section>

      {/* Quran Player Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModernCard variant="glass" className="bg-background/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">24/7 Quran Recitation</h3>
              <p className="text-muted-foreground">Listen to beautiful Quran recitation anytime</p>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => {
                  if (audio) {
                    if (isQuranPlaying) {
                      audio.pause();
                    } else {
                      audio.play();
                    }
                    setIsQuranPlaying(!isQuranPlaying);
                  }
                }}
                className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center text-primary-foreground hover:from-secondary/90 hover:to-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isQuranPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              
              <div className="flex-1 max-w-md">
                <div className="text-center mb-2">
                  <p className="font-medium text-foreground">{currentReciter}</p>
                  <p className="text-sm text-muted-foreground">{currentSurah}</p>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full w-1/3"></div>
                </div>
              </div>
              
              <button className="w-12 h-12 bg-muted/80 rounded-full flex items-center justify-center text-muted-foreground hover:bg-border transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </ModernCard>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-700 mb-4">Our Facilities</h2>
            <p className="text-xl text-neutral-500">Modern amenities for comfortable worship and learning</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-accent-400/10">
                <h3 className="font-semibold text-primary-700 mb-2">{facility.name}</h3>
                <p className="text-sm text-accent-500">{facility.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-500 via-primary-500 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our Spiritual Community
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Experience the warmth of Islamic brotherhood and grow in faith together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton 
              size="lg" 
              className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
            >
              Visit Us Today
            </ModernButton>
            <ModernButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Support Our Masjid
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MasjidHome;
