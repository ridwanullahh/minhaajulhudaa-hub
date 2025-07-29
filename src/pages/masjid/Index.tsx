
import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Clock, Heart, BookOpen, Calendar } from 'lucide-react';

const MasjidIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-800/10 to-green-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-800 via-teal-700 to-green-600 bg-clip-text text-transparent">
              Your Spiritual Home
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Building community through worship, knowledge, and service. Join us in strengthening our bond with Allah and each other.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg" rightIcon={<Clock className="w-5 h-5" />}>
                Prayer Times
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Support Masjid
              </ModernButton>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Times Card */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <ModernCard variant="glass" padding="lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold platform-primary mb-2">Today's Prayer Times</h2>
                <p className="text-gray-600">Stay connected with your daily prayers</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: 'Fajr', time: '5:30 AM' },
                  { name: 'Dhuhr', time: '1:15 PM' },
                  { name: 'Asr', time: '4:45 PM' },
                  { name: 'Maghrib', time: '6:30 PM' },
                  { name: 'Isha', time: '8:15 PM' }
                ].map((prayer, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-teal-50 border border-emerald-100">
                    <h3 className="font-semibold platform-primary text-lg">{prayer.name}</h3>
                    <p className="text-2xl font-bold text-emerald-700">{prayer.time}</p>
                  </div>
                ))}
              </div>
            </ModernCard>
          </div>

          {/* Features Grid */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold platform-primary mb-4">
              Community Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the various ways our masjid serves the Muslim community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Daily Prayers",
                description: "Five daily prayers with community congregation"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Islamic Library",
                description: "Extensive collection of Islamic books and audio resources"
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Educational Programs",
                description: "Weekly classes, lectures, and Islamic courses"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Community Support",
                description: "Counseling, charity, and community assistance"
              }
            ].map((feature, index) => (
              <ModernCard key={index} variant="glass" className="text-center group">
                <div className="platform-secondary mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold platform-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl md:text-4xl font-bold platform-primary mb-6">
              Join Our Masjid Community
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Be part of a vibrant Islamic community dedicated to worship, learning, and service.
            </p>
            <ModernButton size="lg" className="mr-4">
              Get Involved
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              Make Donation
            </ModernButton>
          </ModernCard>
        </div>
      </section>
    </div>
  );
};

export default MasjidIndex;
