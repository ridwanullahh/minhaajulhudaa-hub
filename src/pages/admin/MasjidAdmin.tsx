import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { Clock, Volume2, Calendar, Heart, Bell, FileText } from 'lucide-react';

import ManagePrayerTimes from './masjid/ManagePrayerTimes';
import PrayerTimeForm from './masjid/PrayerTimeForm';
import ManageAudio from './masjid/ManageAudio';
import AudioForm from './masjid/AudioForm';
import ManageEvents from './masjid/ManageEvents';
import EventForm from './masjid/EventForm';
import ManageDonations from './masjid/ManageDonations';
import DonationForm from './masjid/DonationForm';
import ManageAnnouncements from './masjid/ManageAnnouncements';
import AnnouncementForm from './masjid/AnnouncementForm';
import ManageBlogPosts from './masjid/ManageBlogPosts';
import BlogForm from './masjid/BlogForm';


const MasjidAdminDashboard = () => {
    const managementSections = [
        { title: 'Prayer Times', href: 'prayer-times', icon: <Clock/> },
        { title: 'Audio Library', href: 'audio', icon: <Volume2/> },
        { title: 'Events', href: 'events', icon: <Calendar/> },
        { title: 'Donations', href: 'donations', icon: <Heart/> },
        { title: 'Announcements', href: 'announcements', icon: <Bell/> },
        { title: 'Blog', href: 'blog', icon: <FileText/> },
    ];
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Masjid Administration</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {managementSections.map((section) => (
                    <ModernCard key={section.title} className="p-6">
                        <div className="text-primary mb-4">{section.icon}</div>
                        <h3 className="text-xl font-bold">{section.title}</h3>
                        <Link to={section.href}>
                            <ModernButton className="mt-4 w-full">Manage</ModernButton>
                        </Link>
                    </ModernCard>
                ))}
            </div>
        </div>
    );
};

const MasjidAdmin = () => {
  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<MasjidAdminDashboard />} />
          <Route path="/prayer-times" element={<ManagePrayerTimes />} />
          <Route path="/prayer-times/new" element={<PrayerTimeForm />} />
          <Route path="/prayer-times/edit/:id" element={<PrayerTimeForm />} />
          <Route path="/audio" element={<ManageAudio />} />
          <Route path="/audio/new" element={<AudioForm />} />
          <Route path="/audio/edit/:id" element={<AudioForm />} />
          <Route path="/events" element={<ManageEvents />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/edit/:id" element={<EventForm />} />
          <Route path="/donations" element={<ManageDonations />} />
          <Route path="/donations/new" element={<DonationForm />} />
          <Route path="/donations/edit/:id" element={<DonationForm />} />
          <Route path="/announcements" element={<ManageAnnouncements />} />
          <Route path="/announcements/new" element={<AnnouncementForm />} />
          <Route path="/announcements/edit/:id" element={<AnnouncementForm />} />
          <Route path="/blog" element={<ManageBlogPosts />} />
          <Route path="/blog/new" element={<BlogForm />} />
          <Route path="/blog/edit/:id" element={<BlogForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default MasjidAdmin;
