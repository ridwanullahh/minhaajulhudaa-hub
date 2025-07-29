
import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { Plane, MapPin, Star, Shield } from 'lucide-react';

const TravelsIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-sky-800/10 to-cyan-700/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-800 via-sky-700 to-cyan-600 bg-clip-text text-transparent">
              Sacred Journeys Await
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for Hajj, Umrah, and Islamic heritage tours. Experience spiritual journeys with comfort, guidance, and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg" rightIcon={<Plane className="w-5 h-5" />}>
                Book Umrah
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                View Packages
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
              Popular Travel Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carefully crafted spiritual journeys designed for your comfort and spiritual enrichment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Premium Umrah Package',
                duration: '10 Days / 9 Nights',
                price: '$2,499',
                features: ['5-Star Hotels', 'VIP Transportation', 'English Guide', 'Group Size: 20'],
                image: 'bg-gradient-to-br from-blue-100 to-sky-100'
              },
              {
                title: 'Family Hajj Package',
                duration: '15 Days / 14 Nights',
                price: '$4,999',
                features: ['Family Rooms', 'Kid-Friendly', 'Medical Support', 'All Inclusive'],
                image: 'bg-gradient-to-br from-cyan-100 to-blue-100'
              },
              {
                title: 'Turkey Islamic Heritage',
                duration: '8 Days / 7 Nights',
                price: '$1,799',
                features: ['Historical Sites', 'Cultural Tours', 'Local Cuisine', 'Expert Guide'],
                image: 'bg-gradient-to-br from-sky-100 to-cyan-100'
              }
            ].map((pkg, index) => (
              <ModernCard key={index} variant="elevated" className="overflow-hidden">
                <div className={`aspect-w-16 aspect-h-9 ${pkg.image} rounded-xl mb-6 flex items-center justify-center`}>
                  <MapPin className="w-12 h-12 text-blue-400" />
                </div>
                
                <h3 className="text-2xl font-bold platform-primary mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.duration}</p>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold platform-accent mb-4">
                    {pkg.price}
                    <span className="text-sm text-gray-500 font-normal"> per person</span>
                  </div>
                  
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <ModernButton className="w-full">Book Now</ModernButton>
              </ModernCard>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Licensed & Trusted",
                description: "Fully licensed tour operator with 15+ years experience"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Knowledgeable guides fluent in Islamic history and practices"
              },
              {
                icon: <Plane className="w-8 h-8" />,
                title: "Comfortable Travel",
                description: "Premium accommodations and transportation arrangements"
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Complete Packages",
                description: "All-inclusive packages with no hidden costs or surprises"
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
              Let us help you create memories that will last a lifetime. Contact us to plan your perfect Islamic travel experience.
            </p>
            <ModernButton size="lg" className="mr-4">
              Get Quote
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              Contact Agent
            </ModernButton>
          </ModernCard>
        </div>
      </section>
    </div>
  );
};

export default TravelsIndex;
