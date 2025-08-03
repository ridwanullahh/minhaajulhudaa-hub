import React from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const SchoolContact = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Contact <span className="text-amber-600">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for admissions, questions, or to schedule a visit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get In Touch</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-amber-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">123 Islamic Education Street<br />City, State 12345</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-amber-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-amber-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">info@minhaajulhudaaschool.org</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-amber-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">Office Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <ModernCard variant="glass" className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Admissions</option>
                  <option>Academic Programs</option>
                  <option>Schedule Visit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"></textarea>
              </div>
              <ModernButton size="lg" className="w-full">
                Send Message
              </ModernButton>
            </form>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default SchoolContact;
