import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SettingsForm from './shared/SettingsForm';
import { ModernCard } from '@/components/ui/ModernCard';
import SettingsForm from './shared/SettingsForm';
import { ModernButton } from '@/components/ui/ModernButton';
import SettingsForm from './shared/SettingsForm';
import { Heart, Briefcase, Users, MessageSquare, FileText } from 'lucide-react';
import SettingsForm from './shared/SettingsForm';

import ManageCampaigns from './charity/ManageCampaigns';
import CampaignForm from './charity/CampaignForm';
import ManageProjects from './charity/ManageProjects';
import ProjectForm from './charity/ProjectForm';
import ManageDonations from './charity/ManageDonations';
import DonationForm from './charity/DonationForm';
import ManageVolunteers from './charity/ManageVolunteers';
import VolunteerForm from './charity/VolunteerForm';
import ManageTestimonials from './charity/ManageTestimonials';
import TestimonialForm from './charity/TestimonialForm';

const CharityAdminDashboard = () => {
    const managementSections = [
        { title: 'Campaigns', href: 'campaigns', icon: <Heart/> },
        { title: 'Projects', href: 'projects', icon: <Briefcase/> },
        { title: 'Donations', href: 'donations', icon: <FileText/> },
        { title: 'Volunteers', href: 'volunteers', icon: <Users/> },
        { title: 'Testimonials', href: 'testimonials', icon: <MessageSquare/> },
    ];
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Charity Administration</h1>
<Link to='settings'><ModernButton>Settings</ModernButton></Link>
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

const CharityAdmin = () => {
  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<CharityAdminDashboard />} />
<Route path='/settings' element={<SettingsForm platform='charity' />} />
          <Route path="/campaigns" element={<ManageCampaigns />} />
          <Route path="/campaigns/new" element={<CampaignForm />} />
          <Route path="/campaigns/edit/:id" element={<CampaignForm />} />
          <Route path="/projects" element={<ManageProjects />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/edit/:id" element={<ProjectForm />} />
          <Route path="/donations" element={<ManageDonations />} />
          <Route path="/donations/new" element={<DonationForm />} />
          <Route path="/donations/edit/:id" element={<DonationForm />} />
          <Route path="/volunteers" element={<ManageVolunteers />} />
          <Route path="/volunteers/new" element={<VolunteerForm />} />
          <Route path="/volunteers/edit/:id" element={<VolunteerForm />} />
          <Route path="/testimonials" element={<ManageTestimonials />} />
          <Route path="/testimonials/new" element={<TestimonialForm />} />
          <Route path="/testimonials/edit/:id" element={<TestimonialForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default CharityAdmin;
