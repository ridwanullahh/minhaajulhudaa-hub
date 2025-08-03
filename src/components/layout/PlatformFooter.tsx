import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  BookOpen,
  Home,
  Heart,
  Plane
} from 'lucide-react';
import { usePlatform } from '@/hooks/usePlatform';

const PlatformFooter: React.FC = () => {
  const { platform, config, theme } = usePlatform();

  const getPlatformIcon = () => {
    switch (platform) {
      case 'school': return <BookOpen className="w-8 h-8" />;
      case 'masjid': return <Home className="w-8 h-8" />;
      case 'charity': return <Heart className="w-8 h-8" />;
      case 'travels': return <Plane className="w-8 h-8" />;
      default: return <Home className="w-8 h-8" />;
    }
  };

  const getQuickLinks = () => {
    switch (platform) {
      case 'school':
        return [
          { label: 'About Us', href: `/${platform}/about` },
          { label: 'Programs', href: `/${platform}/programs` },
          { label: 'Admissions', href: `/${platform}/admissions` },
          { label: 'E-Library', href: `/${platform}/library` },
          { label: 'Student Portal', href: `/${platform}/portal` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      case 'masjid':
        return [
          { label: 'About Masjid', href: `/${platform}/about` },
          { label: 'Prayer Times', href: `/${platform}/prayer-times` },
          { label: 'Audio Library', href: `/${platform}/audio` },
          { label: 'Events', href: `/${platform}/events` },
          { label: 'Donations', href: `/${platform}/donations` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      case 'charity':
        return [
          { label: 'About Us', href: `/${platform}/about` },
          { label: 'Our Work', href: `/${platform}/projects` },
          { label: 'Campaigns', href: `/${platform}/campaigns` },
          { label: 'Volunteer', href: `/${platform}/volunteer` },
          { label: 'Testimonials', href: `/${platform}/testimonials` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      case 'travels':
        return [
          { label: 'About Us', href: `/${platform}/about` },
          { label: 'Hajj Packages', href: `/${platform}/packages?type=hajj` },
          { label: 'Umrah Services', href: `/${platform}/packages?type=umrah` },
          { label: 'Tours', href: `/${platform}/packages?type=tour` },
          { label: 'Reviews', href: `/${platform}/reviews` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      default:
        return [];
    }
  };

  const getServices = () => {
    switch (platform) {
      case 'school':
        return [
          'Islamic Education',
          'Academic Excellence',
          'Character Development',
          'Extracurricular Activities',
          'Parent Engagement',
          'Career Guidance'
        ];
      
      case 'masjid':
        return [
          'Daily Prayers',
          'Friday Khutbah',
          'Islamic Classes',
          'Community Events',
          'Marriage Services',
          'Funeral Services'
        ];
      
      case 'charity':
        return [
          'Emergency Relief',
          'Education Support',
          'Healthcare Programs',
          'Water Projects',
          'Orphan Care',
          'Community Development'
        ];
      
      case 'travels':
        return [
          'Hajj Packages',
          'Umrah Services',
          'Islamic Tours',
          'Visa Assistance',
          'Travel Insurance',
          'Group Bookings'
        ];
      
      default:
        return [];
    }
  };

  const quickLinks = getQuickLinks();
  const services = getServices();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-platform-primary/20 rounded-xl text-platform-secondary">
                {getPlatformIcon()}
              </div>
              <div>
                <h3 className="text-xl font-bold">Minhaajulhudaa</h3>
                <p className="text-sm text-gray-400 capitalize">{platform}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {config.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-platform-primary/20 hover:text-platform-secondary transition-all duration-300 transform hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-platform-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-platform-secondary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-platform-secondary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-platform-secondary">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-gray-300 flex items-center group">
                  <span className="w-2 h-2 bg-platform-secondary rounded-full mr-3 opacity-60"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-platform-secondary">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-platform-secondary mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>123 Islamic Center Street</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-platform-secondary flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-platform-secondary transition-colors">
                  +1 (234) 567-8900
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-platform-secondary flex-shrink-0" />
                <a href="mailto:info@minhaajulhudaa.org" className="text-gray-300 hover:text-platform-secondary transition-colors">
                  info@minhaajulhudaa.org
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-platform-secondary">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-platform-secondary text-sm"
                />
                <button className="px-4 py-2 bg-platform-primary hover:bg-platform-secondary text-white rounded-r-lg transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Minhaajulhudaa {config.name}. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to={`/${platform}/privacy`} className="text-gray-400 hover:text-platform-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link to={`/${platform}/terms`} className="text-gray-400 hover:text-platform-secondary transition-colors">
                Terms of Service
              </Link>
              <Link to={`/${platform}/sitemap`} className="text-gray-400 hover:text-platform-secondary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlatformFooter;
