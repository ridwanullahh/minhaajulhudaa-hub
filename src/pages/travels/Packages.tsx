import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  Plane,
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  Heart,
  Share2,
  Filter,
  Search,
  Bookmark,
  Award,
  Shield,
  Wifi,
  Utensils,
  Car
} from 'lucide-react';
import { travelsDB } from '@/lib/platform-db';

interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  destination: string;
  type: 'hajj' | 'umrah' | 'heritage' | 'educational';
  rating: number;
  reviews: number;
  maxTravelers: number;
  availableSpots: number;
  departureDate: string;
  returnDate: string;
  includes: string[];
  highlights: string[];
  image: string;
  featured: boolean;
  popular: boolean;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

const TravelsPackages = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, selectedType, priceRange, searchTerm, sortBy]);

  const loadPackages = async () => {
    try {
      const data = await travelsDB.get('packages');

      if (data.length === 0) {
        // Initialize with sample packages
        const samplePackages = [
          {
            title: 'Premium Hajj Package 2024',
            description: 'Complete Hajj pilgrimage with 5-star accommodation, expert guides, and comprehensive support throughout your spiritual journey.',
            price: 6500,
            originalPrice: 7200,
            duration: '14 days',
            destination: 'Makkah & Madinah',
            type: 'hajj',
            rating: 4.9,
            reviews: 127,
            maxTravelers: 50,
            availableSpots: 12,
            departureDate: '2024-06-15',
            returnDate: '2024-06-29',
            includes: ['5-star hotels', 'All meals', 'Transportation', 'Expert guides', 'Visa processing', 'Group coordination'],
            highlights: ['Close to Haram', 'Experienced guides', 'Small group size', 'VIP services'],
            image: '/images/hajj-package.jpg',
            featured: true,
            popular: true,
            difficulty: 'moderate'
          },
          {
            title: 'Umrah Express - 7 Days',
            description: 'Quick and comfortable Umrah package perfect for busy professionals seeking spiritual renewal.',
            price: 2200,
            duration: '7 days',
            destination: 'Makkah & Madinah',
            type: 'umrah',
            rating: 4.7,
            reviews: 89,
            maxTravelers: 30,
            availableSpots: 8,
            departureDate: '2024-04-10',
            returnDate: '2024-04-17',
            includes: ['4-star hotels', 'Breakfast & dinner', 'Airport transfers', 'Ziyarat tours', 'Visa assistance'],
            highlights: ['Quick turnaround', 'Professional service', 'Flexible dates', 'Affordable pricing'],
            image: '/images/umrah-package.jpg',
            featured: true,
            popular: false,
            difficulty: 'easy'
          },
          {
            title: 'Islamic Spain Heritage Tour',
            description: 'Explore the rich Islamic heritage of Andalusia, visiting historic mosques, palaces, and cultural sites.',
            price: 3800,
            duration: '10 days',
            destination: 'Spain (Cordoba, Granada, Seville)',
            type: 'heritage',
            rating: 4.8,
            reviews: 64,
            maxTravelers: 25,
            availableSpots: 15,
            departureDate: '2024-05-20',
            returnDate: '2024-05-30',
            includes: ['Boutique hotels', 'All meals', 'Private bus', 'Expert historian guide', 'Museum entries'],
            highlights: ['Alhambra Palace', 'Cordoba Mosque', 'Cultural immersion', 'Historical insights'],
            image: '/images/spain-heritage.jpg',
            featured: false,
            popular: true,
            difficulty: 'easy'
          },
          {
            title: 'Turkey Islamic Heritage',
            description: 'Discover the Ottoman Islamic heritage in Istanbul and beyond, including historic mosques and cultural sites.',
            price: 2800,
            duration: '8 days',
            destination: 'Istanbul, Bursa, Konya',
            type: 'heritage',
            rating: 4.6,
            reviews: 45,
            maxTravelers: 20,
            availableSpots: 7,
            departureDate: '2024-06-01',
            returnDate: '2024-06-09',
            includes: ['Historic hotels', 'Traditional meals', 'Local transportation', 'Cultural guide', 'Site entries'],
            highlights: ['Blue Mosque', 'Hagia Sophia', 'Sufi culture', 'Ottoman history'],
            image: '/images/turkey-heritage.jpg',
            featured: false,
            popular: false,
            difficulty: 'moderate'
          },
          {
            title: 'Family Umrah Package',
            description: 'Family-friendly Umrah package with special arrangements for children and elderly travelers.',
            price: 2800,
            duration: '10 days',
            destination: 'Makkah & Madinah',
            type: 'umrah',
            rating: 4.8,
            reviews: 73,
            maxTravelers: 40,
            availableSpots: 22,
            departureDate: '2024-03-25',
            returnDate: '2024-04-04',
            includes: ['Family rooms', 'Kid-friendly meals', 'Stroller rental', 'Medical support', 'Flexible schedule'],
            highlights: ['Family-focused', 'Child care', 'Elderly support', 'Flexible timing'],
            image: '/images/family-umrah.jpg',
            featured: true,
            popular: true,
            difficulty: 'easy'
          },
          {
            title: 'Educational Islamic Tour - Egypt',
            description: 'Educational journey through Islamic Egypt, visiting Al-Azhar, historic mosques, and learning centers.',
            price: 3200,
            duration: '12 days',
            destination: 'Cairo, Alexandria, Aswan',
            type: 'educational',
            rating: 4.7,
            reviews: 38,
            maxTravelers: 15,
            availableSpots: 9,
            departureDate: '2024-07-15',
            returnDate: '2024-07-27',
            includes: ['Educational hotels', 'Scholar lectures', 'Library visits', 'Academic guides', 'Research materials'],
            highlights: ['Al-Azhar University', 'Islamic manuscripts', 'Scholar meetings', 'Academic focus'],
            image: '/images/egypt-educational.jpg',
            featured: false,
            popular: false,
            difficulty: 'moderate'
          }
        ];

        for (const pkg of samplePackages) {
          await travelsDB.insert('packages', pkg);
        }
        setPackages(samplePackages as TravelPackage[]);
      } else {
        setPackages(data);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(pkg => pkg.type === selectedType);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'budget':
          filtered = filtered.filter(pkg => pkg.price < 3000);
          break;
        case 'mid':
          filtered = filtered.filter(pkg => pkg.price >= 3000 && pkg.price < 5000);
          break;
        case 'premium':
          filtered = filtered.filter(pkg => pkg.price >= 5000);
          break;
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredPackages(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const packageTypes = [
    { id: 'all', name: 'All Packages' },
    { id: 'hajj', name: 'Hajj' },
    { id: 'umrah', name: 'Umrah' },
    { id: 'heritage', name: 'Heritage Tours' },
    { id: 'educational', name: 'Educational' }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Under $3,000' },
    { id: 'mid', name: '$3,000 - $5,000' },
    { id: 'premium', name: 'Above $5,000' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading travel packages...</p>
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
            Travel <span className="text-platform-primary">Packages</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Embark on transformative spiritual journeys with our carefully curated travel packages.
            From Hajj and Umrah to Islamic heritage tours, we make your sacred journey unforgettable.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
            >
              {packageTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPackages.length} of {packages.length} packages
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <ModernCard
              key={pkg.id}
              variant="glass"
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Package Image */}
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-platform-primary/10 to-platform-secondary/10 flex items-center justify-center">
                  <Plane className="w-16 h-16 text-platform-primary/30" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {pkg.featured && (
                    <span className="bg-platform-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                  {pkg.popular && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular
                    </span>
                  )}
                  {pkg.originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Save ${pkg.originalPrice - pkg.price}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-platform-primary font-medium capitalize">
                    {pkg.type}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({pkg.reviews})</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-platform-primary transition-colors">
                  {pkg.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {pkg.destination}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(pkg.departureDate)} - {formatDate(pkg.returnDate)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {pkg.availableSpots} spots available
                  </div>
                </div>

                {/* Package Includes */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Includes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pkg.includes.slice(0, 3).map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                    {pkg.includes.length > 3 && (
                      <span className="text-xs text-platform-primary">
                        +{pkg.includes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {pkg.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatCurrency(pkg.originalPrice)}
                      </div>
                    )}
                    <div className="text-2xl font-bold text-platform-primary">
                      {formatCurrency(pkg.price)}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    pkg.availableSpots > 10
                      ? 'bg-green-100 text-green-800'
                      : pkg.availableSpots > 5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pkg.availableSpots > 10 ? 'Available' :
                     pkg.availableSpots > 5 ? 'Limited' : 'Few Left'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <ModernButton
                    className="flex-1"
                    leftIcon={<Calendar className="w-4 h-4" />}
                  >
                    Book Now
                  </ModernButton>
                  <ModernButton
                    variant="outline"
                    size="sm"
                  >
                    Details
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* No Results */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No packages found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all packages
            </p>
            <ModernButton
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setPriceRange('all');
              }}
            >
              Clear Filters
            </ModernButton>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Need a Custom Package?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Can't find exactly what you're looking for? Our travel experts can create
              a personalized package tailored to your specific needs and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton size="lg">
                Request Custom Package
              </ModernButton>
              <ModernButton variant="outline" size="lg">
                Speak to Expert
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default TravelsPackages;