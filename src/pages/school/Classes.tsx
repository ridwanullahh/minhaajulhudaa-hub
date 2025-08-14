import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  BookOpen,
  Users,
  Clock,
  Star,
  Search,
  Filter,
  Calendar,
  User,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

interface Class {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  subject: string;
  grade: string;
  teacher: string;
  teacherBio: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  duration: string;
  maxStudents: number;
  enrolledStudents: number;
  price: number;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  prerequisites: string[];
  learningObjectives: string[];
  curriculum: Array<{
    week: number;
    topic: string;
    description: string;
  }>;
  materials: string[];
  assessment: string;
  certificate: boolean;
  featured: boolean;
  status: 'enrolling' | 'in-progress' | 'completed' | 'upcoming';
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
}

const SchoolClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm, selectedSubject, selectedGrade, sortBy]);

  const loadClasses = async () => {
    try {
      const data = await schoolDB.get('classes');

      if (data.length === 0) {
        // Initialize with sample classes
        const sampleClasses = [
          {
            title: 'Quranic Arabic - Beginner Level',
            description: 'Learn to read and understand Quranic Arabic with proper tajweed',
            fullDescription: 'This comprehensive course introduces students to the fundamentals of Quranic Arabic, focusing on proper pronunciation (tajweed), basic vocabulary, and understanding of Quranic verses. Perfect for beginners who want to connect deeply with the Quran.',
            subject: 'Islamic Studies',
            grade: 'Elementary',
            teacher: 'Sheikh Abdullah Hassan',
            teacherBio: 'Certified Quran teacher with 15 years of experience in teaching Arabic and Islamic studies',
            schedule: {
              days: ['Monday', 'Wednesday', 'Friday'],
              startTime: '08:00',
              endTime: '09:30'
            },
            duration: '12 weeks',
            maxStudents: 20,
            enrolledStudents: 16,
            price: 150,
            earlyBirdPrice: 120,
            earlyBirdDeadline: '2024-02-01',
            prerequisites: ['Basic Arabic alphabet knowledge'],
            learningObjectives: [
              'Master proper Quranic pronunciation (tajweed)',
              'Learn 200 essential Quranic vocabulary words',
              'Understand basic Quranic grammar',
              'Read selected Quranic verses fluently'
            ],
            curriculum: [
              { week: 1, topic: 'Arabic Alphabet Review', description: 'Proper pronunciation and recognition' },
              { week: 2, topic: 'Basic Tajweed Rules', description: 'Essential rules for Quran recitation' },
              { week: 3, topic: 'Quranic Vocabulary', description: 'Common words and their meanings' },
              { week: 4, topic: 'Simple Grammar', description: 'Basic sentence structure' }
            ],
            materials: ['Quran textbook', 'Workbook', 'Audio materials', 'Tajweed guide'],
            assessment: 'Weekly quizzes, midterm exam, final recitation assessment',
            certificate: true,
            featured: true,
            status: 'enrolling',
            rating: 4.8,
            reviews: 45,
            image: '/images/quranic-arabic.jpg',
            tags: ['quran', 'arabic', 'tajweed', 'beginner']
          },
          {
            title: 'Islamic History - Golden Age',
            description: 'Explore the rich history of Islamic civilization during its golden age',
            fullDescription: 'Journey through the golden age of Islamic civilization (8th-14th centuries) and discover the remarkable contributions to science, mathematics, medicine, philosophy, and culture. This course brings history to life through engaging stories and interactive learning.',
            subject: 'Social Studies',
            grade: 'Middle School',
            teacher: 'Dr. Amina Khan',
            teacherBio: 'Historian specializing in Islamic civilization with PhD from Oxford University',
            schedule: {
              days: ['Tuesday', 'Thursday'],
              startTime: '10:00',
              endTime: '11:30'
            },
            duration: '16 weeks',
            maxStudents: 25,
            enrolledStudents: 19,
            price: 200,
            prerequisites: ['Basic world history knowledge'],
            learningObjectives: [
              'Understand key Islamic historical periods',
              'Learn about major Islamic scholars and their contributions',
              'Analyze the impact of Islamic civilization on world history',
              'Develop critical thinking about historical events'
            ],
            curriculum: [
              { week: 1, topic: 'Introduction to Islamic History', description: 'Overview and timeline' },
              { week: 2, topic: 'The Abbasid Caliphate', description: 'Golden age beginnings' },
              { week: 3, topic: 'Islamic Science', description: 'Contributions to various fields' },
              { week: 4, topic: 'Islamic Art and Architecture', description: 'Cultural achievements' }
            ],
            materials: ['History textbook', 'Primary source documents', 'Map materials', 'Project supplies'],
            assessment: 'Research projects, presentations, unit tests, final essay',
            certificate: true,
            featured: true,
            status: 'enrolling',
            rating: 4.9,
            reviews: 38,
            image: '/images/islamic-history.jpg',
            tags: ['history', 'islamic-civilization', 'golden-age', 'culture']
          },
          {
            title: 'Mathematics - Algebra Foundations',
            description: 'Build strong algebraic skills with Islamic mathematical heritage',
            fullDescription: 'Master the fundamentals of algebra while learning about the rich Islamic mathematical heritage. This course combines modern algebraic concepts with historical context, showing how Muslim mathematicians contributed to the development of algebra.',
            subject: 'Mathematics',
            grade: 'Middle School',
            teacher: 'Mr. Ahmed Ibrahim',
            teacherBio: 'Mathematics educator with 10 years of experience and passion for Islamic mathematical history',
            schedule: {
              days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
              startTime: '11:00',
              endTime: '12:00'
            },
            duration: '18 weeks',
            maxStudents: 30,
            enrolledStudents: 24,
            price: 250,
            prerequisites: ['Pre-algebra completion'],
            learningObjectives: [
              'Solve linear equations and inequalities',
              'Work with polynomials and factoring',
              'Understand quadratic equations',
              'Apply algebraic concepts to real-world problems'
            ],
            curriculum: [
              { week: 1, topic: 'Variables and Expressions', description: 'Introduction to algebraic thinking' },
              { week: 2, topic: 'Linear Equations', description: 'Solving one-step and multi-step equations' },
              { week: 3, topic: 'Inequalities', description: 'Solving and graphing inequalities' },
              { week: 4, topic: 'Polynomials', description: 'Operations with polynomials' }
            ],
            materials: ['Algebra textbook', 'Graphing calculator', 'Workbook', 'Islamic math history reader'],
            assessment: 'Daily homework, weekly quizzes, chapter tests, final exam',
            certificate: true,
            featured: false,
            status: 'enrolling',
            rating: 4.6,
            reviews: 32,
            image: '/images/algebra-foundations.jpg',
            tags: ['mathematics', 'algebra', 'islamic-math', 'foundations']
          },
          {
            title: 'Science - Islamic Medicine',
            description: 'Discover the contributions of Islamic scholars to medical science',
            fullDescription: 'Explore the fascinating world of Islamic medicine and the pioneering contributions of Muslim physicians like Ibn Sina (Avicenna), Al-Razi, and others. This course combines medical history with basic health science concepts.',
            subject: 'Science',
            grade: 'High School',
            teacher: 'Dr. Fatima Ahmed',
            teacherBio: 'Medical doctor and science educator with expertise in medical history',
            schedule: {
              days: ['Monday', 'Wednesday', 'Friday'],
              startTime: '14:00',
              endTime: '15:30'
            },
            duration: '14 weeks',
            maxStudents: 20,
            enrolledStudents: 15,
            price: 280,
            prerequisites: ['Basic biology knowledge'],
            learningObjectives: [
              'Understand key Islamic medical discoveries',
              'Learn about major Muslim physicians and their work',
              'Explore the development of hospitals and medical education',
              'Connect historical medical knowledge to modern practices'
            ],
            curriculum: [
              { week: 1, topic: 'Introduction to Islamic Medicine', description: 'Overview and significance' },
              { week: 2, topic: 'Ibn Sina and The Canon of Medicine', description: 'Life and contributions' },
              { week: 3, topic: 'Islamic Hospitals', description: 'Development and organization' },
              { week: 4, topic: 'Pharmacology and Surgery', description: 'Advances in medical treatment' }
            ],
            materials: ['Medical history textbook', 'Primary source readings', 'Anatomy charts', 'Research materials'],
            assessment: 'Research papers, presentations, debates, final project',
            certificate: true,
            featured: false,
            status: 'enrolling',
            rating: 4.7,
            reviews: 28,
            image: '/images/islamic-medicine.jpg',
            tags: ['science', 'medicine', 'history', 'islamic-scholars']
          },
          {
            title: 'English Literature - Islamic Perspectives',
            description: 'Study English literature through Islamic lens and values',
            fullDescription: 'This unique course explores English literature while incorporating Islamic perspectives and values. Students will analyze classic and contemporary works through the framework of Islamic ethics, morality, and worldview.',
            subject: 'Language Arts',
            grade: 'High School',
            teacher: 'Ms. Sarah Johnson',
            teacherBio: 'Literature teacher with expertise in comparative literature and Islamic studies',
            schedule: {
              days: ['Tuesday', 'Thursday'],
              startTime: '13:00',
              endTime: '14:30'
            },
            duration: '16 weeks',
            maxStudents: 25,
            enrolledStudents: 18,
            price: 220,
            prerequisites: ['Grade 10 English completion'],
            learningObjectives: [
              'Analyze literature from Islamic perspective',
              'Develop critical thinking and writing skills',
              'Understand Islamic literary traditions',
              'Connect Western literature to Islamic values'
            ],
            curriculum: [
              { week: 1, topic: 'Islamic Literary Theory', description: 'Framework for analysis' },
              { week: 2, topic: 'Classic Literature Analysis', description: 'Traditional works through Islamic lens' },
              { week: 3, topic: 'Contemporary Literature', description: 'Modern works and Islamic values' },
              { week: 4, topic: 'Islamic Literary Traditions', description: 'Rich heritage of Muslim literature' }
            ],
            materials: ['Literature anthology', 'Islamic literary theory texts', 'Writing journal', 'Research materials'],
            assessment: 'Essays, presentations, creative writing, final research paper',
            certificate: true,
            featured: false,
            status: 'enrolling',
            rating: 4.5,
            reviews: 22,
            image: '/images/english-literature.jpg',
            tags: ['literature', 'english', 'islamic-perspective', 'critical-thinking']
          },
          {
            title: 'Computer Science - Islamic Applications',
            description: 'Learn programming while developing Islamic-themed applications',
            fullDescription: 'Combine modern computer science education with Islamic values by developing applications that serve the Muslim community. Students will learn programming fundamentals while working on projects like prayer time calculators, Quran apps, and Islamic educational tools.',
            subject: 'Technology',
            grade: 'High School',
            teacher: 'Mr. Yusuf Mohammed',
            teacherBio: 'Software developer and educator with passion for Islamic technology applications',
            schedule: {
              days: ['Monday, Wednesday, Friday'],
              startTime: '15:00',
              endTime: '16:30'
            },
            duration: '20 weeks',
            maxStudents: 15,
            enrolledStudents: 12,
            price: 350,
            earlyBirdPrice: 300,
            earlyBirdDeadline: '2024-02-15',
            prerequisites: ['Basic computer literacy'],
            learningObjectives: [
              'Master programming fundamentals',
              'Develop Islamic-themed applications',
              'Understand software development lifecycle',
              'Apply technology to serve Islamic purposes'
            ],
            curriculum: [
              { week: 1, topic: 'Programming Basics', description: 'Introduction to coding concepts' },
              { week: 2, topic: 'Islamic App Concepts', description: 'Ideas for beneficial applications' },
              { week: 3, topic: 'Prayer Time Algorithms', description: 'Calculating prayer times programmatically' },
              { week: 4, topic: 'Quran App Development', description: 'Building Quran study tools' }
            ],
            materials: ['Laptop required', 'Programming software', 'Islamic reference materials', 'Development tools'],
            assessment: 'Coding assignments, projects, presentations, final application',
            certificate: true,
            featured: true,
            status: 'enrolling',
            rating: 4.9,
            reviews: 19,
            image: '/images/computer-science.jpg',
            tags: ['programming', 'technology', 'islamic-apps', 'development']
          }
        ];

        for (const cls of sampleClasses) {
          await schoolDB.insert('classes', cls);
        }
        setClasses(sampleClasses as Class[]);
      } else {
        setClasses(data);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(cls => cls.subject === selectedSubject);
    }

    // Filter by grade
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(cls => cls.grade === selectedGrade);
    }

    // Filter by enrolling classes only
    filtered = filtered.filter(cls => cls.status === 'enrolling');

    // Sort classes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.enrolledStudents - a.enrolledStudents;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredClasses(filtered);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEarlyBird = (cls: Class) => {
    if (!cls.earlyBirdDeadline) return false;
    return new Date() < new Date(cls.earlyBirdDeadline);
  };

  const getEnrollmentProgress = (cls: Class) => {
    return Math.min((cls.enrolledStudents / cls.maxStudents) * 100, 100);
  };

  const isClassFull = (cls: Class) => {
    return cls.enrolledStudents >= cls.maxStudents;
  };

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'Islamic Studies', name: 'Islamic Studies' },
    { id: 'Mathematics', name: 'Mathematics' },
    { id: 'Science', name: 'Science' },
    { id: 'Language Arts', name: 'Language Arts' },
    { id: 'Social Studies', name: 'Social Studies' },
    { id: 'Technology', name: 'Technology' }
  ];

  const grades = [
    { id: 'all', name: 'All Grades' },
    { id: 'Elementary', name: 'Elementary' },
    { id: 'Middle School', name: 'Middle School' },
    { id: 'High School', name: 'High School' }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest First' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-platform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classes...</p>
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
            School <span className="text-amber-600">Classes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover our comprehensive class offerings designed to provide both academic excellence 
            and Islamic education. From Quranic studies to modern sciences, we offer a balanced curriculum.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {grades.map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
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
            Showing {filteredClasses.length} classes available for enrollment
          </div>
        </div>

        {/* Featured Classes */}
        {filteredClasses.filter(cls => cls.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Featured Classes</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredClasses.filter(cls => cls.featured).slice(0, 2).map((cls) => (
                <ModernCard
                  key={cls.id}
                  variant="glass"
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-amber-600/30" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    {isClassFull(cls) && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Full
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-amber-600 font-medium">
                        {cls.subject}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {cls.rating} ({cls.reviews})
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                      {cls.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {cls.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        {cls.teacher}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {cls.schedule.days.join(', ')} {formatTime(cls.schedule.startTime)} - {formatTime(cls.schedule.endTime)}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {cls.duration}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        {cls.enrolledStudents}/{cls.maxStudents} enrolled
                      </div>
                    </div>

                    {/* Enrollment Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Enrollment</span>
                        <span className="font-medium">{Math.round(getEnrollmentProgress(cls))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            isClassFull(cls) ? 'bg-red-500' : 'bg-gradient-to-r from-amber-600 to-orange-600'
                          }`}
                          style={{ width: `${getEnrollmentProgress(cls)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-amber-600">
                        {cls.price === 0 ? 'Free' : `$${cls.price}`}
                        {isEarlyBird(cls) && (
                          <span className="text-sm text-green-600 ml-2">
                            Early Bird: ${cls.earlyBirdPrice}
                          </span>
                        )}
                      </div>

                      <Link to={`/school/classes/${cls.id}`}>
                        <ModernButton size="sm" disabled={isClassFull(cls)}>
                          {isClassFull(cls) ? 'Class Full' : 'Learn More'}
                        </ModernButton>
                      </Link>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>
        )}

        {/* All Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((cls) => (
            <ModernCard
              key={cls.id}
              variant="glass"
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-amber-600/10 to-orange-600/10 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-amber-600/30" />
                </div>

                {cls.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}

                {isClassFull(cls) && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Full
                    </span>
                  </div>
                )}

                {cls.price > 0 && isEarlyBird(cls) && (
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Early Bird
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-amber-600 font-medium">
                    {cls.subject}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                    {cls.rating} ({cls.reviews})
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                  {cls.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {cls.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {cls.teacher}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {cls.schedule.days.join(', ')} {formatTime(cls.schedule.startTime)} - {formatTime(cls.schedule.endTime)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {cls.duration}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {cls.enrolledStudents}/{cls.maxStudents} enrolled
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Enrollment</span>
                    <span className="font-medium">{Math.round(getEnrollmentProgress(cls))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        isClassFull(cls) ? 'bg-red-500' : 'bg-gradient-to-r from-amber-600 to-orange-600'
                      }`}
                      style={{ width: `${getEnrollmentProgress(cls)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-amber-600">
                    {cls.price === 0 ? 'Free' : `$${cls.price}`}
                    {isEarlyBird(cls) && (
                      <span className="text-sm text-green-600 ml-2">
                        Early Bird: ${cls.earlyBirdPrice}
                      </span>
                    )}
                  </div>

                  <Link to={`/school/classes/${cls.id}`}>
                    <ModernButton size="sm" disabled={isClassFull(cls)}>
                      {isClassFull(cls) ? 'Class Full' : 'Learn More'}
                    </ModernButton>
                  </Link>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Class Information */}
        <div className="mt-16">
          <ModernCard variant="gradient" padding="xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-amber-600 mb-4 flex justify-center">
                  <Target className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Education</h3>
                <p className="text-gray-600">
                  Our classes are designed to provide both academic excellence and Islamic values, 
                  ensuring students receive a well-rounded education.
                </p>
              </div>
              <div className="text-center">
                <div className="text-amber-600 mb-4 flex justify-center">
                  <Award className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Teachers</h3>
                <p className="text-gray-600">
                  Learn from qualified educators who are experts in their fields and passionate 
                  about Islamic education and character development.
                </p>
              </div>
              <div className="text-center">
                <div className="text-amber-600 mb-4 flex justify-center">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Continuous Growth</h3>
                <p className="text-gray-600">
                  Our curriculum is regularly updated to incorporate modern teaching methods 
                  while maintaining traditional Islamic educational principles.
                </p>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolClasses;