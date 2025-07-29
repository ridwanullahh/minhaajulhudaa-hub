
import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Plane, MapPin, Calendar, Star, Users, Shield } from 'lucide-react';

const TravelsIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-800/10 to-purple-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Sacred Journeys Await
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for Hajj, Umrah, and Islamic heritage tours. Experience the spiritual journey of a lifetime with expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg" rightIcon={<Plane className="w-5 h-5" />}>
                View Packages
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Plan Your Journey
              </ModernButton>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold platform-primary mb-4">
              Featured Travel Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carefully curated spiritual journeys designed for comfort, convenience, and spiritual fulfillment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Premium Hajj Package',
                duration: '14 Days',
                price: '$4,500',
                image: '🕋',
                features: ['5-star accommodation', 'Expert guides', 'All meals included', 'Transportation', 'Spiritual guidance']
              },
              {
                title: 'Umrah Excellence',
                duration: '10 Days',
                price: '$2,200',
                image: '🌙',
                features: ['4-star hotels', 'Ziyarah tours', 'Group coordination', 'Visa assistance', 'Religious lectures']
              },
              {
                title: 'Islamic Heritage Tour',
                duration: '12 Days',
                price: '$3,800',
                image: '🏛️',
                features: ['Historical sites', 'Cultural immersion', 'Expert historians', 'Comfortable travel', 'Educational program']
              }
            ].map((pkg, index) => (
              <ModernCard key={index} variant="elevated" className="overflow-hidden group">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-6 p-8 text-center">
                  <div className="text-6xl mb-4">{pkg.image}</div>
                  <div className="text-2xl font-bold platform-primary">{pkg.title}</div>
                  <div className="text-lg text-gray-600 mt-2">{pkg.duration}</div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold platform-secondary mb-4">{pkg.price}</div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <ModernButton className="w-full">
                  Book Now
                </ModernButton>
              </ModernCard>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Trusted Experience",
                description: "Over 15 years of organizing successful pilgrimages"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Guides",
                description: "Knowledgeable scholars and experienced tour leaders"
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Prime Locations",
                description: "Accommodation close to Haram and holy sites"
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Flexible Dates",
                description: "Multiple departure dates throughout the year"
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
              Ready for Your Spiritual Journey?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Let us help you plan the pilgrimage of a lifetime. Contact our experts today.
            </p>
            <ModernButton size="lg" className="mr-4">
              Get Started
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              Contact Us
            </ModernButton>
          </ModernCard>
        </div>
      </section>
    </div>
  );
};

export default TravelsIndex;
