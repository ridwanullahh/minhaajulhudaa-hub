import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { usePlatform } from '@/hooks/usePlatform';

// School Pages
import SchoolHome from '@/pages/school/Home';
import SchoolAbout from '@/pages/school/About';
import SchoolPrograms from '@/pages/school/Programs';
import SchoolProgramSingle from '@/pages/school/ProgramSingle';
import SchoolClasses from '@/pages/school/Classes';
import SchoolClassSingle from '@/pages/school/ClassSingle';
import SchoolAdmissions from '@/pages/school/Admissions';
import SchoolBlog from '@/pages/school/Blog';
import SchoolBlogPost from '@/pages/school/BlogPost';
import SchoolEvents from '@/pages/school/Events';
import SchoolGallery from '@/pages/school/Gallery';
import SchoolLibrary from '@/pages/school/Library';
import SchoolShop from '@/pages/school/Shop';
import SchoolCourses from '@/pages/school/Courses';
import SchoolContact from '@/pages/school/Contact';

// Masjid Pages
import MasjidHome from '@/pages/masjid/Home';
import MasjidAbout from '@/pages/masjid/About';
import MasjidPrayerTimes from '@/pages/masjid/PrayerTimes';
import MasjidEvents from '@/pages/masjid/Events';
import MasjidAudioLibrary from '@/pages/masjid/AudioLibrary';
import MasjidBlog from '@/pages/masjid/Blog';
import MasjidBlogPost from '@/pages/masjid/BlogPost';
import MasjidDonations from '@/pages/masjid/Donations';
import MasjidContact from '@/pages/masjid/Contact';

// Charity Pages
import CharityHome from '@/pages/charity/Home';
import CharityAbout from '@/pages/charity/About';
import CharityCampaigns from '@/pages/charity/Campaigns';
import CharityCampaignSingle from '@/pages/charity/CampaignSingle';
import CharityProjects from '@/pages/charity/Projects';
import CharityProjectSingle from '@/pages/charity/ProjectSingle';
import CharityBlog from '@/pages/charity/Blog';
import CharityBlogPost from '@/pages/charity/BlogPost';
import CharityVolunteer from '@/pages/charity/Volunteer';
import CharityTestimonials from '@/pages/charity/Testimonials';
import CharityContact from '@/pages/charity/Contact';

// Travels Pages
import TravelsHome from '@/pages/travels/Home';
import TravelsAbout from '@/pages/travels/About';
import TravelsPackages from '@/pages/travels/Packages';
import TravelsPackageSingle from '@/pages/travels/PackageSingle';
import TravelsBooking from '@/pages/travels/Booking';
import TravelsBlog from '@/pages/travels/Blog';
import TravelsBlogPost from '@/pages/travels/BlogPost';
import TravelsReviews from '@/pages/travels/Reviews';
import TravelsCourses from '@/pages/travels/Courses';
import TravelsContact from '@/pages/travels/Contact';

// Admin Pages (will be created later)
import AdminDashboard from '@/pages/admin/Dashboard';
import NotFound from '@/pages/NotFound';

interface PlatformRouterProps {
  platform: string;
}

const PlatformRouter: React.FC<PlatformRouterProps> = ({ platform }) => {
  const location = useLocation();
  const currentPath = location.pathname.replace(`/${platform}`, '') || '/';

  const renderSchoolRoutes = () => (
    <Routes>
      <Route path="/" element={<SchoolHome />} />
      <Route path="/about" element={<SchoolAbout />} />
      <Route path="/programs" element={<SchoolPrograms />} />
      <Route path="/programs/:slug" element={<SchoolProgramSingle />} />
      <Route path="/classes" element={<SchoolClasses />} />
      <Route path="/classes/:slug" element={<SchoolClassSingle />} />
      <Route path="/admissions" element={<SchoolAdmissions />} />
      <Route path="/courses" element={<SchoolCourses />} />
      <Route path="/courses/:slug" element={<SchoolCourses />} />
      <Route path="/blog" element={<SchoolBlog />} />
      <Route path="/blog/:slug" element={<SchoolBlogPost />} />
      <Route path="/events" element={<SchoolEvents />} />
      <Route path="/gallery" element={<SchoolGallery />} />
      <Route path="/library" element={<SchoolLibrary />} />
      <Route path="/library/:slug" element={<SchoolLibrary />} />
      <Route path="/shop" element={<SchoolShop />} />
      <Route path="/shop/:slug" element={<SchoolShop />} />
      <Route path="/contact" element={<SchoolContact />} />
      <Route path="/admin/*" element={<AdminDashboard platform="school" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const renderMasjidRoutes = () => (
    <Routes>
      <Route path="/" element={<MasjidHome />} />
      <Route path="/about" element={<MasjidAbout />} />
      <Route path="/prayer-times" element={<MasjidPrayerTimes />} />
      <Route path="/events" element={<MasjidEvents />} />
      <Route path="/audio" element={<MasjidAudioLibrary />} />
      <Route path="/audio/:slug" element={<MasjidAudioLibrary />} />
      <Route path="/blog" element={<MasjidBlog />} />
      <Route path="/blog/:slug" element={<MasjidBlogPost />} />
      <Route path="/donations" element={<MasjidDonations />} />
      <Route path="/contact" element={<MasjidContact />} />
      <Route path="/admin/*" element={<AdminDashboard platform="masjid" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const renderCharityRoutes = () => (
    <Routes>
      <Route path="/" element={<CharityHome />} />
      <Route path="/about" element={<CharityAbout />} />
      <Route path="/campaigns" element={<CharityCampaigns />} />
      <Route path="/campaigns/:slug" element={<CharityCampaignSingle />} />
      <Route path="/projects" element={<CharityProjects />} />
      <Route path="/projects/:slug" element={<CharityProjectSingle />} />
      <Route path="/blog" element={<CharityBlog />} />
      <Route path="/blog/:slug" element={<CharityBlogPost />} />
      <Route path="/volunteer" element={<CharityVolunteer />} />
      <Route path="/testimonials" element={<CharityTestimonials />} />
      <Route path="/contact" element={<CharityContact />} />
      <Route path="/admin/*" element={<AdminDashboard platform="charity" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const renderTravelsRoutes = () => (
    <Routes>
      <Route path="/" element={<TravelsHome />} />
      <Route path="/about" element={<TravelsAbout />} />
      <Route path="/packages" element={<TravelsPackages />} />
      <Route path="/packages/:slug" element={<TravelsPackageSingle />} />
      <Route path="/booking" element={<TravelsBooking />} />
      <Route path="/courses" element={<TravelsCourses />} />
      <Route path="/courses/:slug" element={<TravelsCourses />} />
      <Route path="/blog" element={<TravelsBlog />} />
      <Route path="/blog/:slug" element={<TravelsBlogPost />} />
      <Route path="/reviews" element={<TravelsReviews />} />
      <Route path="/contact" element={<TravelsContact />} />
      <Route path="/admin/*" element={<AdminDashboard platform="travels" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  switch (platform) {
    case 'school':
      return renderSchoolRoutes();
    case 'masjid':
      return renderMasjidRoutes();
    case 'charity':
      return renderCharityRoutes();
    case 'travels':
      return renderTravelsRoutes();
    default:
      return <NotFound />;
  }
};

export default PlatformRouter;
