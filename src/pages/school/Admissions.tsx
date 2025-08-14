import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import {
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import { schoolDB } from '@/lib/platform-db';

const SchoolAdmissions = () => {
  const [applicationData, setApplicationData] = useState({
    studentName: '',
    dateOfBirth: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    previousSchool: '',
    gradeApplying: '',
    emergencyContact: '',
    medicalInfo: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admissionStats, setAdmissionStats] = useState({
    totalApplications: 0,
    acceptanceRate: 95,
    availableSpots: 50
  });

  useEffect(() => {
    loadAdmissionData();
  }, []);

  const loadAdmissionData = async () => {
    try {
      const applications = await schoolDB.get('admissions');
      setAdmissionStats({
        totalApplications: applications.length,
        acceptanceRate: 95,
        availableSpots: Math.max(0, 50 - applications.length)
      });
    } catch (error) {
      console.error('Error loading admission data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await schoolDB.insert('admissions', {
        ...applicationData,
        status: 'pending',
        applicationDate: new Date().toISOString(),
        applicationNumber: `ADM${Date.now()}`,
        documents: [],
        interviewScheduled: false
      });

      alert('Application submitted successfully! You will receive a confirmation email shortly.');
      setApplicationData({
        studentName: '',
        dateOfBirth: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        previousSchool: '',
        gradeApplying: '',
        emergencyContact: '',
        medicalInfo: '',
        additionalNotes: ''
      });

      loadAdmissionData();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const admissionProcess = [
    {
      step: 1,
      title: 'Submit Application',
      description: 'Complete and submit the online application form',
      icon: <FileText className="w-6 h-6" />,
      status: 'current'
    },
    {
      step: 2,
      title: 'Document Review',
      description: 'Our admissions team reviews your application',
      icon: <CheckCircle className="w-6 h-6" />,
      status: 'upcoming'
    },
    {
      step: 3,
      title: 'Interview',
      description: 'Student and parent interview with our staff',
      icon: <Users className="w-6 h-6" />,
      status: 'upcoming'
    },
    {
      step: 4,
      title: 'Decision',
      description: 'Admission decision communicated within 2 weeks',
      icon: <Calendar className="w-6 h-6" />,
      status: 'upcoming'
    }
  ];

  const requirements = [
    'Completed application form',
    'Birth certificate copy',
    'Previous school transcripts',
    'Immunization records',
    'Parent/guardian identification',
    'Passport-size photographs (2)',
    'Application fee payment'
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            School <span className="text-platform-primary">Admissions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join our Islamic educational community. We welcome students who are eager to learn
            and grow in both Islamic knowledge and academic excellence.
          </p>
        </div>

        {/* Admission Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ModernCard variant="glass" className="text-center p-6">
            <div className="text-3xl font-bold text-platform-primary mb-2">
              {admissionStats.totalApplications}
            </div>
            <div className="text-gray-600">Applications This Year</div>
          </ModernCard>
          <ModernCard variant="glass" className="text-center p-6">
            <div className="text-3xl font-bold text-platform-primary mb-2">
              {admissionStats.acceptanceRate}%
            </div>
            <div className="text-gray-600">Acceptance Rate</div>
          </ModernCard>
          <ModernCard variant="glass" className="text-center p-6">
            <div className="text-3xl font-bold text-platform-primary mb-2">
              {admissionStats.availableSpots}
            </div>
            <div className="text-gray-600">Available Spots</div>
          </ModernCard>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <ModernCard variant="glass" className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={applicationData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Applying For *
                  </label>
                  <select
                    name="gradeApplying"
                    value={applicationData.gradeApplying}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
                  >
                    <option value="">Select Grade</option>
                    <option value="kg1">KG1 (Age 3-4)</option>
                    <option value="kg2">KG2 (Age 4-5)</option>
                    <option value="grade1">Grade 1</option>
                    <option value="grade2">Grade 2</option>
                    <option value="grade3">Grade 3</option>
                    <option value="grade4">Grade 4</option>
                    <option value="grade5">Grade 5</option>
                    <option value="grade6">Grade 6</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Email *
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={applicationData.parentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone *
                  </label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={applicationData.parentPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-platform-primary focus:border-transparent"
                  />
                </div>
              </div>

              <ModernButton
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </ModernButton>
            </form>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdmissions;