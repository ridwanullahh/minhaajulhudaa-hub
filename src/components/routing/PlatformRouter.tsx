import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingState } from '@/components/ui/states';
import AdminProtectedRoute from '@/components/routing/AdminProtectedRoute';

// BismiLLAH Ar-Rahman Ar-Roheem.
//
// Code-split platform routes with React.lazy so each platform's pages
// load on demand. This reduces the initial bundle from ~760KB to just
// the RootDirectory + shared chunks, then lazy-loads each platform's
// pages when the user navigates to it.
//
// Addresses PRODUCTION_GAPS.md item 5.1 (bundle size > 500KB).

const NotFound = React.lazy(() => import('@/pages/NotFound'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));

// School pages
const SchoolHome = React.lazy(() => import('@/pages/school/Home'));
const SchoolAbout = React.lazy(() => import('@/pages/school/About'));
const SchoolPrograms = React.lazy(() => import('@/pages/school/Programs'));
const SchoolProgramSingle = React.lazy(() => import('@/pages/school/ProgramSingle'));
const SchoolClasses = React.lazy(() => import('@/pages/school/Classes'));
const SchoolClassSingle = React.lazy(() => import('@/pages/school/ClassSingle'));
const SchoolAdmissions = React.lazy(() => import('@/pages/school/Admissions'));
const SchoolBlog = React.lazy(() => import('@/pages/school/Blog'));
const SchoolBlogPost = React.lazy(() => import('@/pages/school/BlogPost'));
const SchoolEvents = React.lazy(() => import('@/pages/school/Events'));
const SchoolGallery = React.lazy(() => import('@/pages/school/Gallery'));
const SchoolLibrary = React.lazy(() => import('@/pages/school/Library'));
const SchoolShop = React.lazy(() => import('@/pages/school/Shop'));
const SchoolProductSingle = React.lazy(() => import('@/pages/school/ProductSingle'));
const SchoolCart = React.lazy(() => import('@/pages/school/Cart'));
const SchoolCheckout = React.lazy(() => import('@/pages/school/Checkout'));
const SchoolPortalDashboard = React.lazy(() => import('@/pages/school/PortalDashboard'));
const SchoolCourses = React.lazy(() => import('@/pages/school/Courses'));
const SchoolContact = React.lazy(() => import('@/pages/school/Contact'));
const TeacherPortal = React.lazy(() => import('@/pages/school/lms/TeacherPortal'));
const AssignmentGrading = React.lazy(() => import('@/pages/school/lms/AssignmentGrading'));
const QuizBuilder = React.lazy(() => import('@/pages/school/lms/QuizBuilder'));

// Masjid pages
const MasjidHome = React.lazy(() => import('@/pages/masjid/Home'));
const MasjidAbout = React.lazy(() => import('@/pages/masjid/About'));
const MasjidPrayerTimes = React.lazy(() => import('@/pages/masjid/PrayerTimes'));
const MasjidEvents = React.lazy(() => import('@/pages/masjid/Events'));
const MasjidAudioLibrary = React.lazy(() => import('@/pages/masjid/AudioLibrary'));
const MasjidBlog = React.lazy(() => import('@/pages/masjid/Blog'));
const MasjidBlogPost = React.lazy(() => import('@/pages/masjid/BlogPost'));
const MasjidDonations = React.lazy(() => import('@/pages/masjid/Donations'));
const MasjidContact = React.lazy(() => import('@/pages/masjid/Contact'));

// Charity pages
const CharityHome = React.lazy(() => import('@/pages/charity/Home'));
const CharityAbout = React.lazy(() => import('@/pages/charity/About'));
const CharityCampaigns = React.lazy(() => import('@/pages/charity/Campaigns'));
const CharityCampaignSingle = React.lazy(() => import('@/pages/charity/CampaignSingle'));
const CharityProjects = React.lazy(() => import('@/pages/charity/Projects'));
const CharityProjectSingle = React.lazy(() => import('@/pages/charity/ProjectSingle'));
const CharityBlog = React.lazy(() => import('@/pages/charity/Blog'));
const CharityBlogPost = React.lazy(() => import('@/pages/charity/BlogPost'));
const CharityVolunteer = React.lazy(() => import('@/pages/charity/Volunteer'));
const CharityTestimonials = React.lazy(() => import('@/pages/charity/Testimonials'));
const CharityContact = React.lazy(() => import('@/pages/charity/Contact'));
const CharityZakat = React.lazy(() => import('@/pages/charity/Zakat'));
const CharityImpactDashboard = React.lazy(() => import('@/pages/charity/ImpactDashboard'));

// Travels pages
const TravelsHome = React.lazy(() => import('@/pages/travels/Home'));
const TravelsAbout = React.lazy(() => import('@/pages/travels/About'));
const TravelsPackages = React.lazy(() => import('@/pages/travels/Packages'));
const TravelsPackageSingle = React.lazy(() => import('@/pages/travels/PackageSingle'));
const TravelsBooking = React.lazy(() => import('@/pages/travels/Booking'));
const TravelsBlog = React.lazy(() => import('@/pages/travels/Blog'));
const TravelsBlogPost = React.lazy(() => import('@/pages/travels/BlogPost'));
const TravelsReviews = React.lazy(() => import('@/pages/travels/Reviews'));
const TravelsCourses = React.lazy(() => import('@/pages/travels/Courses'));
const TravelsContact = React.lazy(() => import('@/pages/travels/Contact'));
const TravelsDynamicPricing = React.lazy(() => import('@/pages/travels/DynamicPricing'));

interface PlatformRouterProps {
  platform: string;
}

const PlatformRouter: React.FC<PlatformRouterProps> = ({ platform }) => {
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
      <Route path="/blog/:id" element={<SchoolBlogPost />} />
      <Route path="/events" element={<SchoolEvents />} />
      <Route path="/gallery" element={<SchoolGallery />} />
      <Route path="/library" element={<SchoolLibrary />} />
      <Route path="/library/:slug" element={<SchoolLibrary />} />
      <Route path="/shop" element={<SchoolShop />} />
      <Route path="/shop/:id" element={<SchoolProductSingle />} />
      <Route path="/cart" element={<SchoolCart />} />
      <Route path="/checkout" element={<SchoolCheckout />} />
      <Route path="/portal" element={<SchoolPortalDashboard />} />
      <Route path="/portal/teacher" element={<TeacherPortal />} />
      <Route path="/portal/grading/:id" element={<AssignmentGrading />} />
      <Route path="/portal/quiz-builder" element={<QuizBuilder />} />
      <Route path="/contact" element={<SchoolContact />} />
      <Route path="/admin/*" element={<AdminProtectedRoute platform="school"><AdminDashboard platform="school" /></AdminProtectedRoute>} />
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
      <Route path="/admin/*" element={<AdminProtectedRoute platform="masjid"><AdminDashboard platform="masjid" /></AdminProtectedRoute>} />
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
      <Route path="/zakat" element={<CharityZakat />} />
      <Route path="/impact" element={<CharityImpactDashboard />} />
      <Route path="/contact" element={<CharityContact />} />
      <Route path="/admin/*" element={<AdminProtectedRoute platform="charity"><AdminDashboard platform="charity" /></AdminProtectedRoute>} />
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
      <Route path="/pricing" element={<TravelsDynamicPricing />} />
      <Route path="/contact" element={<TravelsContact />} />
      <Route path="/admin/*" element={<AdminProtectedRoute platform="travels"><AdminDashboard platform="travels" /></AdminProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const routes = (() => {
    switch (platform) {
      case 'school': return renderSchoolRoutes();
      case 'masjid': return renderMasjidRoutes();
      case 'charity': return renderCharityRoutes();
      case 'travels': return renderTravelsRoutes();
      default: return <NotFound />;
    }
  })();

  return <Suspense fallback={<LoadingState message="Loading..." rows={4} />}>{routes}</Suspense>;
};

export default PlatformRouter;
