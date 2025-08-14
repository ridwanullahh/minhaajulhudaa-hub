import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  ShoppingCart, 
  Heart,
  Menu,
  X,
  BookOpen,
  Home,
  Plane,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { usePlatform } from '@/hooks/usePlatform';
import { ModernButton } from '@/components/ui/ModernButton';

const PlatformHeader: React.FC = () => {
  const { platform, config, theme } = usePlatform();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPlatformIcon = () => {
    switch (platform) {
      case 'school': return <BookOpen className="w-6 h-6" />;
      case 'masjid': return <Home className="w-6 h-6" />;
      case 'charity': return <Heart className="w-6 h-6" />;
      case 'travels': return <Plane className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  const getQuickActions = () => {
    switch (platform) {
      case 'school':
        return [
          { icon: <ShoppingCart className="w-5 h-5" />, label: 'Shop', href: '/school/shop' },
          { icon: <BookOpen className="w-5 h-5" />, label: 'Library', href: '/school/library' },
          { icon: <User className="w-5 h-5" />, label: 'Portal', href: '/school/portal' }
        ];
      case 'masjid':
        return [
          { icon: <Bell className="w-5 h-5" />, label: 'Prayer Times', href: '/masjid/prayer-times' },
          { icon: <Heart className="w-5 h-5" />, label: 'Donate', href: '/masjid/donations' },
          { icon: <BookOpen className="w-5 h-5" />, label: 'Audio', href: '/masjid/audio' }
        ];
      case 'charity':
        return [
          { icon: <Heart className="w-5 h-5" />, label: 'Donate', href: '/charity/campaigns' },
          { icon: <User className="w-5 h-5" />, label: 'Volunteer', href: '/charity/volunteer' },
          { icon: <Globe className="w-5 h-5" />, label: 'Impact', href: '/charity/projects' }
        ];
      case 'travels':
        return [
          { icon: <Plane className="w-5 h-5" />, label: 'Packages', href: '/travels/packages' },
          { icon: <BookOpen className="w-5 h-5" />, label: 'Booking', href: '/travels/booking' },
          { icon: <User className="w-5 h-5" />, label: 'Account', href: '/travels/account' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-platform-primary text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="hidden md:flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@minhaajulhudaa.org</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={`/${platform}/admin`} className="hover:text-platform-secondary transition-colors">
                Admin
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <span>Follow us:</span>
                <div className="flex space-x-2">
                  <a href="#" className="hover:text-platform-secondary transition-colors">FB</a>
                  <a href="#" className="hover:text-platform-secondary transition-colors">TW</a>
                  <a href="#" className="hover:text-platform-secondary transition-colors">IG</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-platform-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to={`/${platform}`}
              className="flex items-center space-x-4 text-platform-primary hover:text-platform-secondary transition-colors group"
            >
              <div className="p-3 bg-platform-primary/10 rounded-xl group-hover:bg-platform-primary/20 transition-colors">
                {getPlatformIcon()}
              </div>
              <div>
                <div className="font-bold text-2xl leading-tight">Minhaajulhudaa</div>
                <div className="text-sm text-gray-600 capitalize font-medium">{config.name}</div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${platform}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-platform-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-platform-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Quick Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-platform-primary hover:bg-platform-primary/5 rounded-lg transition-all"
                    title={action.label}
                  >
                    {action.icon}
                    <span className="hidden xl:inline text-sm font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <ModernButton size="sm">
                  {platform === 'school' ? 'Apply Now' :
                   platform === 'masjid' ? 'Donate' :
                   platform === 'charity' ? 'Help Now' :
                   'Book Trip'}
                </ModernButton>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-platform-primary transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${platform}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-platform-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-platform-primary hover:bg-platform-primary/5 rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {action.icon}
                    <span className="font-medium">{action.label}</span>
                  </Link>
                ))}
                <div className="pt-3 border-t border-gray-100">
                  <ModernButton className="w-full">
                    {platform === 'school' ? 'Apply Now' :
                     platform === 'masjid' ? 'Donate' :
                     platform === 'charity' ? 'Help Now' :
                     'Book Trip'}
                  </ModernButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default PlatformHeader;
