import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Compass,
  Mountain,
  Camera,
  Shield,
  Clock,
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { travelsDB } from '@/lib/platform-db';

const TravelsHome = () => {
  const [travelStats, setTravelStats] = useState({
    totalTravelers: 0,
    packagesOffered: 0,
    yearsExperience: 15,
    satisfaction: 98
  });
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Load real-time data
    const loadData = async () => {
      try {
        const [packages, bookings, reviews] = await Promise.all([
          travelsDB.get('packages'),
          travelsDB.get('bookings'),
          travelsDB.get('reviews')
        ]);

        const totalTravelers = bookings.reduce((sum, booking) => sum + (booking.travelers || 1), 0);
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 5;

        setTravelStats({
          totalTravelers,
          packagesOffered: packages.length,
          yearsExperience: 15,
          satisfaction: Math.round(avgRating * 20) // Convert 5-star to percentage
        });

        setFeaturedPackages(packages.filter(p => p.available).slice(0, 3));
        setTestimonials(reviews.slice(0, 3));
      } catch (error) {
        console.error('Error loading travels data:', error);
      }
    };

    loadData();
  }, []);

  const whyChooseUs = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Experience",
      description: "15+ years of organizing spiritual journeys"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Licensed & Certified",
      description: "Fully licensed travel agency with all certifications"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Guides",
      description: "Knowledgeable Islamic scholars and tour guides"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance during your journey"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/travel-pattern.svg')] opacity-10" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="p-4 bg-gradient-to-r from-secondary to-primary rounded-full shadow-2xl">
                  <Plane className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                      Minhaajulhudaa
                    </span>
                  </h1>
                  <p className="text-lg text-primary-foreground/80">Travels & Tours</p>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-primary-foreground">Sacred</span>
                <br />
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Journeys Await
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
                Your trusted partner for Hajj, Umrah, and Islamic heritage tours. 
                Experience spiritual transformation with comfort and peace of mind.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <ModernButton 
                  size="lg" 
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl"
                >
                  Explore Packages
                </ModernButton>
                <ModernButton 
                  variant="outline" 
                  size="lg"
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  Book Consultation
                </ModernButton>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="relative">
              <ModernCard variant="glass" className="bg-background/10 backdrop-blur-md border-secondary/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-secondary mb-2">Our Journey So Far</h3>
                  <p className="text-secondary/80 text-sm">Trusted by thousands of pilgrims</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Happy Travelers", value: `${travelStats.totalTravelers.toLocaleString()}+` },
                    { label: "Tour Packages", value: `${travelStats.packagesOffered}+` },
                    { label: "Years Experience", value: `${travelStats.yearsExperience}+` },
                    { label: "Satisfaction Rate", value: `${travelStats.satisfaction}%` }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Your peace of mind is our priority</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group-hover:border-blue-200">
                  <div className="text-blue-600 mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sacred Destinations</h2>
            <p className="text-xl text-gray-600">Explore the most holy places in Islam</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Makkah & Madinah",
                description: "The holiest cities in Islam",
                image: "bg-gradient-to-br from-green-600 to-emerald-600",
                highlight: "Hajj & Umrah"
              },
              {
                name: "Al-Aqsa Mosque",
                description: "Third holiest mosque in Islam",
                image: "bg-gradient-to-br from-blue-600 to-cyan-600",
                highlight: "Jerusalem Tours"
              },
              {
                name: "Islamic Spain",
                description: "Rich Islamic heritage and history",
                image: "bg-gradient-to-br from-orange-600 to-red-600",
                highlight: "Heritage Tours"
              }
            ].map((destination, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`${destination.image} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 min-h-[300px] flex flex-col justify-end relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="relative z-10">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium mb-4 w-fit">
                      {destination.highlight}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                    <p className="text-white/90 mb-4">{destination.description}</p>
                    <ModernButton size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
                      Explore Tours
                    </ModernButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Begin Your Sacred Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Let us guide you on a transformative spiritual experience with comfort, 
            safety, and deep Islamic knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Book Your Journey
            </ModernButton>
            <ModernButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Get Free Consultation
            </ModernButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelsHome;
