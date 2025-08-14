import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  User,
  Star,
  Eye,
  Download,
  Bookmark,
  Share2,
  Tag,
  Clock,
  FileText,
  Video,
  Headphones,
  Image,
  ExternalLink
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  type: 'book' | 'ebook' | 'video' | 'audio' | 'document' | 'resource';
  category: string;
  author: string;
  publishDate: string;
  language: string;
  pages?: number;
  duration?: string;
  fileSize?: string;
  format?: string;
  isbn?: string;
  publisher?: string;
  tags: string[];
  image: string;
  fileUrl?: string;
  externalUrl?: string;
  rating: number;
  reviews: number;
  views: number;
  downloads: number;
  featured: boolean;
  available: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  chapters?: Array<{
    title: string;
    duration?: string;
    pages?: number;
  }>;
  preview?: string;
  tableOfContents?: string[];
}

const SchoolLibrary = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedType, selectedCategory, selectedLevel, sortBy]);

  const loadItems = async () => {
    try {
      const data = await schoolDB.get('library_items');

      if (data.length === 0) {
        // Initialize with sample library items
        const sampleItems = [
          {
            title: 'Quranic Studies for Young Learners',
            description: 'Comprehensive guide to Quranic education for children and beginners',
            fullDescription: 'This beautifully illustrated book provides a comprehensive introduction to Quranic studies for young learners. It covers basic Arabic, Quranic stories, and fundamental Islamic concepts in an age-appropriate manner.',
            type: 'book',
            category: 'Islamic Studies',
            author: 'Dr. Amina Rahman',
            publishDate: '2023-01-15',
            language: 'English',
            pages: 156,
            fileSize: '15.2 MB',
            format: 'PDF',
            isbn: '978-3-16-148410-0',
            publisher: 'Islamic Education Press',
            tags: ['quran', 'children', 'beginner', 'arabic'],
            image: '/images/quranic-studies.jpg',
            fileUrl: '/files/quranic-studies.pdf',
            rating: 4.8,
            reviews: 127,
            views: 2341,
            downloads: 892,
            featured: true,
            available: true,
            level: 'beginner',
            subject: 'Quranic Studies',
            chapters: [
              { title: 'Introduction to the Quran', pages: 12 },
              { title: 'Arabic Alphabet', pages: 20 },
              { title: 'Basic Quranic Vocabulary', pages: 25 },
              { title: 'Stories from the Quran', pages: 45 },
              { title: 'Islamic Manners', pages: 18 },
              { title: 'Practice Exercises', pages: 36 }
            ],
            preview: 'Chapter 1: Introduction to the Quran\n\nThe Quran is the holy book of Islam, revealed to Prophet Muhammad (peace be upon him) over a period of 23 years...',
            tableOfContents: ['Introduction', 'Arabic Alphabet', 'Basic Vocabulary', 'Quranic Stories', 'Islamic Manners', 'Practice Exercises', 'Glossary', 'Index']
          },
          {
            title: 'Islamic History: The Golden Age',
            description: 'Explore the remarkable achievements of Islamic civilization during its golden age',
            fullDescription: 'This comprehensive video series explores the golden age of Islamic civilization (8th-14th centuries), highlighting the remarkable contributions to science, mathematics, medicine, philosophy, and culture.',
            type: 'video',
            category: 'History',
            author: 'Dr. Khalid Al-Mansoori',
            publishDate: '2023-06-20',
            language: 'English',
            duration: '2 hours 45 minutes',
            fileSize: '1.2 GB',
            format: 'MP4',
            publisher: 'Islamic Heritage Foundation',
            tags: ['history', 'golden-age', 'civilization', 'documentary'],
            image: '/images/islamic-history-video.jpg',
            fileUrl: '/videos/islamic-history.mp4',
            rating: 4.9,
            reviews: 89,
            views: 3456,
            downloads: 567,
            featured: true,
            available: true,
            level: 'intermediate',
            subject: 'Islamic History',
            chapters: [
              { title: 'Introduction to the Golden Age', duration: '15:30' },
              { title: 'Scientific Contributions', duration: '25:45' },
              { title: 'Mathematical Innovations', duration: '22:15' },
              { title: 'Medical Advances', duration: '28:00' },
              { title: 'Architectural Marvels', duration: '20:30' },
              { title: 'Cultural Legacy', duration: '18:45' },
              { title: 'Conclusion and Impact', duration: '15:00' }
            ],
            preview: 'The Islamic Golden Age (8th-14th centuries) represents one of the most remarkable periods in human history...'
          },
          {
            title: 'Arabic Grammar Made Simple',
            description: 'Step-by-step guide to mastering Arabic grammar for Quranic understanding',
            fullDescription: 'This comprehensive guide breaks down Arabic grammar into simple, easy-to-understand lessons. Perfect for students who want to understand the Quran in its original language.',
            type: 'ebook',
            category: 'Language',
            author: 'Sheikh Abdullah Hassan',
            publishDate: '2023-03-10',
            language: 'English',
            pages: 289,
            fileSize: '8.7 MB',
            format: 'PDF',
            isbn: '978-1-23-456789-7',
            publisher: 'Arabic Learning Center',
            tags: ['arabic', 'grammar', 'quran', 'language'],
            image: '/images/arabic-grammar.jpg',
            fileUrl: '/files/arabic-grammar.pdf',
            rating: 4.7,
            reviews: 156,
            views: 1892,
            downloads: 1234,
            featured: false,
            available: true,
            level: 'intermediate',
            subject: 'Arabic Language',
            chapters: [
              { title: 'Introduction to Arabic Grammar', pages: 15 },
              { title: 'Nouns and Pronouns', pages: 35 },
              { title: 'Verbs and Tenses', pages: 45 },
              { title: 'Sentence Structure', pages: 28 },
              { title: 'Advanced Grammar Rules', pages: 52 },
              { title: 'Practice Exercises', pages: 67 },
              { title: 'Answer Key', pages: 47 }
            ],
            preview: 'Chapter 1: Introduction to Arabic Grammar\n\nArabic grammar is the foundation of understanding the Quran in its original language...',
            tableOfContents: ['Introduction', 'Nouns and Pronouns', 'Verbs and Tenses', 'Sentence Structure', 'Advanced Rules', 'Practice Exercises', 'Answer Key', 'Appendix']
          },
          {
            title: 'Prophet Muhammad (PBUH) Biography',
            description: 'Comprehensive audio biography of the Prophet Muhammad (peace be upon him)',
            fullDescription: 'This extensive audio series covers the complete life of Prophet Muhammad (PBUH), from his birth in Mecca to his passing in Medina. Based on authentic sources and presented in an engaging narrative style.',
            type: 'audio',
            category: 'Seerah',
            author: 'Sheikh Yusuf Estes',
            publishDate: '2023-05-01',
            language: 'English',
            duration: '8 hours 30 minutes',
            fileSize: '450 MB',
            format: 'MP3',
            publisher: 'Seerah Productions',
            tags: ['seerah', 'prophet', 'biography', 'audio'],
            image: '/images/prophet-biography.jpg',
            fileUrl: '/audio/prophet-biography.mp3',
            rating: 4.9,
            reviews: 234,
            views: 4567,
            downloads: 1789,
            featured: true,
            available: true,
            level: 'beginner',
            subject: 'Prophet\'s Life',
            chapters: [
              { title: 'Birth and Early Life', duration: '45:30' },
              { title: 'Marriage to Khadijah', duration: '38:15' },
              { title: 'First Revelation', duration: '42:00' },
              { title: 'Early Persecution', duration: '55:45' },
              { title: 'Migration to Abyssinia', duration: '35:30' },
              { title: 'Hijra to Medina', duration: '48:00' },
              { title: 'Establishment of Islamic State', duration: '52:15' },
              { title: 'Major Battles', duration: '1:15:30' },
              { title: 'Conquest of Mecca', duration: '42:45' },
              { title: 'Farewell Pilgrimage', duration: '38:00' },
              { title: 'Final Illness and Passing', duration: '45:00' }
            ],
            preview: 'Chapter 1: Birth and Early Life\n\nProphet Muhammad (peace be upon him) was born in the Year of the Elephant, approximately 570 CE...'
          },
          {
            title: 'Islamic Science and Medicine',
            description: 'Documentary exploring the contributions of Islamic scholars to science and medicine',
            fullDescription: 'This fascinating documentary explores how Islamic scholars preserved and expanded upon ancient knowledge, making groundbreaking contributions to various fields including medicine, mathematics, astronomy, and chemistry.',
            type: 'video',
            category: 'Science',
            author: 'Dr. Fatima Ahmed',
            publishDate: '2023-07-15',
            language: 'English',
            duration: '1 hour 30 minutes',
            fileSize: '750 MB',
            format: 'MP4',
            publisher: 'Islamic Science Network',
            tags: ['science', 'medicine', 'history', 'documentary'],
            image: '/images/islamic-science.jpg',
            fileUrl: '/videos/islamic-science.mp4',
            rating: 4.8,
            reviews: 178,
            views: 2890,
            downloads: 890,
            featured: false,
            available: true,
            level: 'intermediate',
            subject: 'Islamic Science',
            chapters: [
              { title: 'Introduction to Islamic Science', duration: '12:30' },
              { title: 'House of Wisdom', duration: '18:45' },
              { title: 'Medical Innovations', duration: '22:15' },
              { title: 'Mathematical Contributions', duration: '20:00' },
              { title: 'Astronomical Discoveries', duration: '15:30' },
              { title: 'Chemical Advances', duration: '18:00' },
              { title: 'Legacy and Influence', duration: '15:00' }
            ],
            preview: 'During the Islamic Golden Age, scholars made remarkable contributions to science and medicine...'
          },
          {
            title: 'Islamic Art and Architecture Guide',
            description: 'Comprehensive guide to Islamic art traditions and architectural marvels',
            fullDescription: 'This beautifully illustrated guide explores the rich traditions of Islamic art and architecture, from geometric patterns and calligraphy to magnificent mosques and palaces across the Muslim world.',
            type: 'ebook',
            category: 'Art',
            author: 'Prof. Layla Hassan',
            publishDate: '2023-04-20',
            language: 'English',
            pages: 342,
            fileSize: '25.6 MB',
            format: 'PDF',
            isbn: '978-2-34-567890-1',
            publisher: 'Islamic Heritage Publications',
            tags: ['art', 'architecture', 'culture', 'design'],
            image: '/images/islamic-art.jpg',
            fileUrl: '/files/islamic-art.pdf',
            rating: 4.9,
            reviews: 145,
            views: 2156,
            downloads: 987,
            featured: false,
            available: true,
            level: 'advanced',
            subject: 'Islamic Culture',
            chapters: [
              { title: 'Introduction to Islamic Art', pages: 20 },
              { title: 'Geometric Patterns', pages: 45 },
              { title: 'Islamic Calligraphy', pages: 38 },
              { title: 'Architectural Elements', pages: 52 },
              { title: 'Regional Styles', pages: 67 },
              { title: 'Famous Structures', pages: 78 },
              { title: 'Modern Islamic Art', pages: 42 }
            ],
            preview: 'Chapter 1: Introduction to Islamic Art\n\nIslamic art encompasses the visual arts produced in the Islamic world...',
            tableOfContents: ['Introduction', 'Geometric Patterns', 'Calligraphy', 'Architecture', 'Regional Styles', 'Famous Structures', 'Modern Art', 'Glossary', 'Bibliography']
          },
          {
            title: 'Daily Dua Collection',
            description: 'Essential daily prayers and supplications for Muslims',
            fullDescription: 'A comprehensive collection of daily duas (supplications) for various occasions including morning and evening prayers, before and after eating, traveling, and other important moments in a Muslim\'s life.',
            type: 'document',
            category: 'Prayer',
            author: 'Islamic Scholars Council',
            publishDate: '2023-02-10',
            language: 'English',
            pages: 89,
            fileSize: '2.3 MB',
            format: 'PDF',
            publisher: 'Islamic Prayer Resources',
            tags: ['dua', 'prayer', 'supplication', 'daily'],
            image: '/images/daily-dua.jpg',
            fileUrl: '/files/daily-dua.pdf',
            rating: 4.9,
            reviews: 267,
            views: 3456,
            downloads: 1567,
            featured: false,
            available: true,
            level: 'beginner',
            subject: 'Islamic Practices',
            chapters: [
              { title: 'Morning and Evening Duas', pages: 15 },
              { title: 'Duas Before and After Eating', pages: 8 },
              { title: 'Travel Duas', pages: 12 },
              { title: 'Duas for Study and Work', pages: 10 },
              { title: 'Duas for Health and Healing', pages: 14 },
              { title: 'Duas for Protection', pages: 18 },
              { title: 'Special Occasion Duas', pages: 12 }
            ],
            preview: 'Chapter 1: Morning and Evening Duas\n\nStarting the day with the remembrance of Allah is a blessed practice...',
            tableOfContents: ['Morning Duas', 'Evening Duas', 'Meal-related Duas', 'Travel Duas', 'Study Duas', 'Health Duas', 'Protection Duas', 'Special Occasions', 'Index']
          },
          {
            title: 'Islamic Finance Principles',
            description: 'Understanding the fundamentals of Islamic finance and banking',
            fullDescription: 'This comprehensive resource explains the principles of Islamic finance, including prohibition of interest (riba), risk-sharing, and ethical investment. Essential for understanding modern Islamic banking systems.',
            type: 'resource',
            category: 'Finance',
            author: 'Dr. Ibrahim Ahmed',
            publishDate: '2023-08-01',
            language: 'English',
            pages: 156,
            fileSize: '5.8 MB',
            format: 'PDF',
            publisher: 'Islamic Finance Institute',
            tags: ['finance', 'banking', 'economics', 'islamic-principles'],
            image: '/images/islamic-finance.jpg',
            fileUrl: '/files/islamic-finance.pdf',
            rating: 4.7,
            reviews: 89,
            views: 1234,
            downloads: 567,
            featured: false,
            available: true,
            level: 'advanced',
            subject: 'Islamic Economics',
            chapters: [
              { title: 'Introduction to Islamic Finance', pages: 18 },
              { title: 'Prohibition of Riba (Interest)', pages: 25 },
              { title: 'Risk-Sharing Principles', pages: 22 },
              { title: 'Islamic Banking Models', pages: 35 },
              { title: 'Islamic Investment', pages: 28 },
              { title: 'Modern Applications', pages: 28 }
            ],
            preview: 'Chapter 1: Introduction to Islamic Finance\n\nIslamic finance is a financial system that operates according to Islamic law (Shariah)...',
            tableOfContents: ['Introduction', 'Riba and Its Prohibition', 'Risk-Sharing', 'Banking Models', 'Investment Principles', 'Modern Applications', 'Case Studies', 'Glossary']
          }
        ];

        for (const item of sampleItems) {
          await schoolDB.insert('library_items', item);
        }
        setItems(sampleItems as LibraryItem[]);
      } else {
        setItems(data);
      }
    } catch (error) {
      console.error('Error loading library items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    // Filter by available items only
    filtered = filtered.filter(item => item.available);

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'downloads':
          return b.downloads - a.downloads;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'ebook':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'resource':
        return <ExternalLink className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const handleDownload = async (item: LibraryItem) => {
    if (item.fileUrl) {
      // In a real app, this would trigger an actual download
      alert(`Downloading: ${item.title}`);
      
      // Update download count
      try {
        await schoolDB.update('library_items', item.id, {
          ...item,
          downloads: item.downloads + 1
        });
        
        setItems(prev => 
          prev.map(i => 
            i.id === item.id ? { ...i, downloads: i.downloads + 1 } : i
          )
        );
      } catch (error) {
        console.error('Error updating download count:', error);
      }
    }
  };

  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'book', name: 'Books' },
    { id: 'ebook', name: 'E-books' },
    { id: 'video', name: 'Videos' },
    { id: 'audio', name: 'Audio' },
    { id: 'document', name: 'Documents' },
    { id: 'resource', name: 'Resources' }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Islamic Studies', name: 'Islamic Studies' },
    { id: 'History', name: 'History' },
    { id: 'Language', name: 'Language' },
    { id: 'Science', name: 'Science' },
    { id: 'Art', name: 'Art' },
    { id: 'Prayer', name: 'Prayer' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Seerah', name: 'Seerah' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' },
    { id: 'downloads', name: 'Most Downloaded' },
    { id: 'title', name: 'Title A-Z' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading library resources...</p>
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
            School <span className="text-amber-600">Library</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Access our comprehensive collection of Islamic educational resources including books, 
            videos, audio materials, and documents. Everything you need for your Islamic education journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

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

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>

            <div className="md:col-span-2 text-sm text-gray-600">
              Showing {filteredItems.length} of {items.length} resources
            </div>
          </div>
        </div>

        {/* Featured Items */}
        {filteredItems.filter(item => item.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Featured Resources</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredItems.filter(item => item.featured).slice(0, 2).map((item) => (
                <ModernCard
                  key={item.id}
                  variant="glass"
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                      <div className="text-amber-600/30">
                        {getTypeIcon(item.type)}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-amber-600 font-medium">
                        {item.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {item.rating} ({item.reviews})
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        {item.author}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(item.publishDate)}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {item.duration || `${item.pages} pages`}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Eye className="w-4 h-4 mr-2" />
                        {item.views} views • {item.downloads} downloads
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                          {item.level}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {item.language}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        {item.fileUrl && (
                          <ModernButton
                            size="sm"
                            onClick={() => handleDownload(item)}
                            leftIcon={<Download className="w-4 h-4" />}
                          >
                            Download
                          </ModernButton>
                        )}
                        <Link to={`/school/library/${item.id}`}>
                          <ModernButton size="sm">
                            View Details
                          </ModernButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>
        )}

        {/* All Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <ModernCard
              key={item.id}
              variant="glass"
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                  <div className="text-amber-600/30">
                    {getTypeIcon(item.type)}
                  </div>
                </div>

                {item.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-amber-600 font-medium">
                    {item.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                    {item.rating} ({item.reviews})
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {item.author}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(item.publishDate)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {item.duration || `${item.pages} pages`}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    {item.views} views • {item.downloads} downloads
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                      {item.level}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {item.language}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {item.fileUrl && (
                      <ModernButton
                        size="sm"
                        onClick={() => handleDownload(item)}
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        Download
                      </ModernButton>
                    )}
                    <Link to={`/school/library/${item.id}`}>
                      <ModernButton size="sm">
                        View Details
                      </ModernButton>
                    </Link>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Library Statistics */}
        <div className="mt-16">
          <ModernCard variant="gradient" padding="xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {items.length}
                </div>
                <div className="text-gray-700">Total Resources</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {items.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                </div>
                <div className="text-gray-700">Total Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {items.reduce((sum, item) => sum + item.downloads, 0).toLocaleString()}
                </div>
                <div className="text-gray-700">Total Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-gray-700">Categories</div>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolLibrary;