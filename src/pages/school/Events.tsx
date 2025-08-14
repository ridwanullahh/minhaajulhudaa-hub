import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
  Eye,
  User,
  Tag,
  Plus,
  ChevronRight
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

interface Event {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location: string;
  venue: string;
  category: string;
  tags: string[];
  image: string;
  maxAttendees: number;
  registeredAttendees: number;
  price: number;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  organizer: string;
  organizerContact: string;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  requirements: string[];
  agenda: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  speakers: Array<{
    name: string;
    title: string;
    bio: string;
    image: string;
  }>;
}

const SchoolEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, sortBy]);

  const loadEvents = async () => {
    try {
      const data = await schoolDB.get('events');

      if (data.length === 0) {
        // Initialize with sample events
        const sampleEvents = [
          {
            title: 'Annual Science Fair 2024',
            description: 'Showcasing innovative science projects from our talented students',
            fullDescription: 'Join us for our Annual Science Fair where students from all grades will showcase their innovative science projects. This event highlights our commitment to STEM education and encourages students to explore scientific concepts through hands-on experimentation.',
            date: '2024-02-15',
            time: '09:00',
            endDate: '2024-02-15',
            endTime: '15:00',
            location: 'School Auditorium',
            venue: 'Main Building, 1st Floor',
            category: 'academic',
            tags: ['science', 'fair', 'exhibition', 'stem'],
            image: '/images/science-fair.jpg',
            maxAttendees: 300,
            registeredAttendees: 156,
            price: 0,
            organizer: 'Science Department',
            organizerContact: 'science@minhaajulhudaaschool.edu',
            featured: true,
            status: 'upcoming',
            requirements: ['Project display board', 'Safety equipment', 'Presentation materials'],
            agenda: [
              { time: '09:00', title: 'Opening Ceremony', description: 'Welcome address and introduction' },
              { time: '09:30', title: 'Project Presentations', description: 'Students present their projects' },
              { time: '12:00', title: 'Lunch Break', description: 'Networking and refreshments' },
              { time: '13:00', title: 'Judging Session', description: 'External judges evaluate projects' },
              { time: '15:00', title: 'Awards Ceremony', description: 'Recognition of outstanding projects' }
            ],
            speakers: [
              {
                name: 'Dr. Sarah Johnson',
                title: 'Guest Scientist',
                bio: 'Renowned scientist with 15 years of experience in educational outreach',
                image: '/images/speaker-sarah.jpg'
              }
            ]
          },
          {
            title: 'Parent-Teacher Conference',
            description: 'Essential meeting to discuss student progress and development',
            fullDescription: 'This important conference provides an opportunity for parents and teachers to discuss student progress, address concerns, and collaborate on strategies for academic success. Individual appointments will be scheduled.',
            date: '2024-02-20',
            time: '14:00',
            endDate: '2024-02-22',
            endTime: '18:00',
            location: 'School Classrooms',
            venue: 'Various Classrooms',
            category: 'academic',
            tags: ['parent-teacher', 'conference', 'progress', 'development'],
            image: '/images/parent-teacher.jpg',
            maxAttendees: 500,
            registeredAttendees: 342,
            price: 0,
            organizer: 'Administration Office',
            organizerContact: 'admin@minhaajulhudaaschool.edu',
            featured: false,
            status: 'upcoming',
            requirements: ['Student progress reports', 'Questions prepared', 'Note-taking materials'],
            agenda: [
              { time: '14:00', title: 'Welcome Session', description: 'Introduction and schedule overview' },
              { time: '14:30', title: 'Individual Meetings', description: 'One-on-one discussions' },
              { time: '16:00', title: 'Break', description: 'Short refreshment break' },
              { time: '16:30', title: 'Individual Meetings', description: 'Continued discussions' },
              { time: '18:00', title: 'Closing', description: 'Summary and next steps' }
            ],
            speakers: []
          },
          {
            title: 'Islamic Cultural Festival',
            description: 'Celebrating Islamic heritage through art, food, and performances',
            fullDescription: 'Immerse yourself in the rich tapestry of Islamic culture at our annual festival. Experience traditional arts, authentic cuisine, educational exhibits, and inspiring performances that showcase the beauty and diversity of Islamic heritage.',
            date: '2024-03-10',
            time: '10:00',
            endDate: '2024-03-10',
            endTime: '20:00',
            location: 'School Grounds',
            venue: 'Outdoor Pavilion',
            category: 'cultural',
            tags: ['islamic-culture', 'festival', 'heritage', 'celebration'],
            image: '/images/islamic-festival.jpg',
            maxAttendees: 1000,
            registeredAttendees: 678,
            price: 5,
            earlyBirdPrice: 3,
            earlyBirdDeadline: '2024-02-20',
            organizer: 'Cultural Committee',
            organizerContact: 'culture@minhaajulhudaaschool.edu',
            featured: true,
            status: 'upcoming',
            requirements: ['Modest dress code', 'Family-friendly attire', 'Cash for food stalls'],
            agenda: [
              { time: '10:00', title: 'Opening Ceremony', description: 'Traditional welcome and Quran recitation' },
              { time: '11:00', title: 'Cultural Exhibits', description: 'Islamic art and heritage displays' },
              { time: '13:00', title: 'Lunch & Food Festival', description: 'Traditional Islamic cuisine' },
              { time: '15:00', title: 'Student Performances', description: 'Nasheeds and cultural presentations' },
              { time: '17:00', title: 'Guest Speaker', description: 'Islamic heritage presentation' },
              { time: '19:00', title: 'Closing Ceremony', description: 'Prayers and conclusion' }
            ],
            speakers: [
              {
                name: 'Sheikh Abdul Rahman',
                title: 'Islamic Scholar',
                bio: 'Expert in Islamic history and cultural heritage',
                image: '/images/speaker-abdul.jpg'
              }
            ]
          },
          {
            title: 'Quran Competition Finals',
            description: 'Annual Quran memorization and recitation competition',
            fullDescription: 'Witness the culmination of our annual Quran competition as students showcase their memorization and recitation skills. This event celebrates the importance of Quranic education in our curriculum.',
            date: '2024-03-15',
            time: '16:00',
            endDate: '2024-03-15',
            endTime: '20:00',
            location: 'School Mosque',
            venue: 'Prayer Hall',
            category: 'religious',
            tags: ['quran', 'competition', 'memorization', 'recitation'],
            image: '/images/quran-competition.jpg',
            maxAttendees: 200,
            registeredAttendees: 189,
            price: 0,
            organizer: 'Islamic Studies Department',
            organizerContact: 'islamic@minhaajulhudaaschool.edu',
            featured: true,
            status: 'upcoming',
            requirements: ['Modest attire', 'Respectful behavior', 'Prayer mat'],
            agenda: [
              { time: '16:00', title: 'Opening Duas', description: 'Prayers and introduction' },
              { time: '16:30', title: 'Junior Category', description: 'Quran recitation by younger students' },
              { time: '17:30', title: 'Senior Category', description: 'Advanced memorization showcase' },
              { time: '18:30', title: 'Maghrib Prayer', description: 'Congregational prayer' },
              { time: '19:00', title: 'Awards Ceremony', description: 'Recognition and prizes' }
            ],
            speakers: [
              {
                name: 'Qari Mohammad Ali',
                title: 'Chief Judge',
                bio: 'Renowned Quran reciter with international recognition',
                image: '/images/speaker-qari.jpg'
              }
            ]
          },
          {
            title: 'Sports Day 2024',
            description: 'Annual athletic competition promoting physical fitness and teamwork',
            fullDescription: 'Join us for an exciting day of athletic competitions, team sports, and physical challenges. Sports Day promotes physical fitness, teamwork, and healthy competition among students of all ages.',
            date: '2024-04-05',
            time: '08:00',
            endDate: '2024-04-05',
            endTime: '17:00',
            location: 'Sports Field',
            venue: 'School Sports Complex',
            category: 'sports',
            tags: ['sports', 'athletics', 'competition', 'fitness'],
            image: '/images/sports-day.jpg',
            maxAttendees: 800,
            registeredAttendees: 456,
            price: 0,
            organizer: 'Physical Education Department',
            organizerContact: 'sports@minhaajulhudaaschool.edu',
            featured: false,
            status: 'upcoming',
            requirements: ['Sports attire', 'Water bottle', 'Towel', 'Sun protection'],
            agenda: [
              { time: '08:00', title: 'Opening Ceremony', description: 'March past and warm-up' },
              { time: '09:00', title: 'Track Events', description: 'Running and relay races' },
              { time: '12:00', title: 'Lunch Break', description: 'Meals and rest' },
              { time: '13:00', title: 'Team Sports', description: 'Football, basketball, volleyball' },
              { time: '16:00', title: 'Awards Ceremony', description: 'Medals and trophies' }
            ],
            speakers: []
          },
          {
            title: 'Career Guidance Workshop',
            description: 'Helping students explore future career paths and educational opportunities',
            fullDescription: 'This comprehensive workshop helps students explore various career paths, understand educational requirements, and make informed decisions about their future. Industry professionals and university representatives will provide valuable insights.',
            date: '2024-04-20',
            time: '09:00',
            endDate: '2024-04-20',
            endTime: '15:00',
            location: 'School Hall',
            venue: 'Main Auditorium',
            category: 'academic',
            tags: ['career', 'guidance', 'workshop', 'future'],
            image: '/images/career-workshop.jpg',
            maxAttendees: 150,
            registeredAttendees: 98,
            price: 10,
            earlyBirdPrice: 7,
            earlyBirdDeadline: '2024-04-10',
            organizer: 'Career Counseling Office',
            organizerContact: 'careers@minhaajulhudaaschool.edu',
            featured: false,
            status: 'upcoming',
            requirements: ['Notebook', 'Pen', 'Resume (for senior students)', 'Questions prepared'],
            agenda: [
              { time: '09:00', title: 'Welcome & Overview', description: 'Introduction to career planning' },
              { time: '09:30', title: 'Industry Panel', description: 'Professionals share experiences' },
              { time: '11:00', title: 'University Fair', description: 'Higher education options' },
              { time: '13:00', title: 'Lunch & Networking', description: 'Informal discussions' },
              { time: '14:00', title: 'Skill Development', description: 'Career readiness skills' },
              { time: '15:00', title: 'Q&A Session', description: 'Final questions and guidance' }
            ],
            speakers: [
              {
                name: 'Dr. Ahmed Hassan',
                title: 'Career Counselor',
                bio: '20+ years of experience in educational counseling',
                image: '/images/speaker-ahmed.jpg'
              },
              {
                name: 'Ms. Fatima Ali',
                title: 'HR Professional',
                bio: 'HR manager at leading multinational company',
                image: '/images/speaker-fatima.jpg'
              }
            ]
          }
        ];

        for (const event of sampleEvents) {
          await schoolDB.insert('events', event);
        }
        setEvents(sampleEvents as Event[]);
      } else {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by upcoming events only
    filtered = filtered.filter(event => event.status === 'upcoming');

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popularity':
          return b.registeredAttendees - a.registeredAttendees;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEarlyBird = (event: Event) => {
    if (!event.earlyBirdDeadline) return false;
    return new Date() < new Date(event.earlyBirdDeadline);
  };

  const getRegistrationProgress = (event: Event) => {
    return Math.min((event.registeredAttendees / event.maxAttendees) * 100, 100);
  };

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'academic', name: 'Academic' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'religious', name: 'Religious' },
    { id: 'sports', name: 'Sports' }
  ];

  const sortOptions = [
    { id: 'date', name: 'Date (Earliest First)' },
    { id: 'popularity', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
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
            School <span className="text-amber-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover upcoming events, competitions, and activities at our Islamic school. 
            Join us in celebrating learning, culture, and community spirit.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} upcoming events
          </div>
        </div>

        {/* Featured Events */}
        {filteredEvents.filter(event => event.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Featured Events</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredEvents.filter(event => event.featured).slice(0, 2).map((event) => (
                <ModernCard
                  key={event.id}
                  variant="glass"
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-amber-600/30" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-amber-600 font-medium capitalize">
                        {event.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(event.time)} - {event.endTime ? formatTime(event.endTime) : 'Ongoing'}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registeredAttendees}/{event.maxAttendees} registered
                      </div>
                    </div>

                    {/* Registration Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Registration</span>
                        <span className="font-medium">{Math.round(getRegistrationProgress(event))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${getRegistrationProgress(event)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-amber-600">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                        {isEarlyBird(event) && (
                          <span className="text-sm text-green-600 ml-2">
                            Early Bird: ${event.earlyBirdPrice}
                          </span>
                        )}
                      </div>

                      <Link to={`/school/events/${event.id}`}>
                        <ModernButton size="sm">
                          Learn More
                        </ModernButton>
                      </Link>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>
        )}

        {/* All Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <ModernCard
              key={event.id}
              variant="glass"
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-amber-600/30" />
                </div>

                {event.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}

                {event.price > 0 && isEarlyBird(event) && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Early Bird
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-amber-600 font-medium capitalize">
                    {event.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event.date)}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                  {event.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(event.time)} - {event.endTime ? formatTime(event.endTime) : 'Ongoing'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {event.registeredAttendees}/{event.maxAttendees} registered
                  </div>
                </div>

                {/* Registration Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Registration</span>
                    <span className="font-medium">{Math.round(getRegistrationProgress(event))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${getRegistrationProgress(event)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-amber-600">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                    {isEarlyBird(event) && (
                      <span className="text-sm text-green-600 ml-2">
                        Early Bird: ${event.earlyBirdPrice}
                      </span>
                    )}
                  </div>

                  <Link to={`/school/events/${event.id}`}>
                    <ModernButton size="sm">
                      Learn More
                    </ModernButton>
                  </Link>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Event Calendar CTA */}
        <div className="mt-16 text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Stay Updated with Our Events
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Subscribe to our events calendar and never miss an important school activity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
              <ModernButton size="lg">
                Subscribe
              </ModernButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolEvents;