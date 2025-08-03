import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, BookOpen, Users, Heart, Plane } from 'lucide-react';
import { usePlatform } from '@/hooks/usePlatform';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

const PlatformNavigation: React.FC = () => {
  const { platform, config, theme } = usePlatform();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = (): NavigationItem[] => {
    switch (platform) {
      case 'school':
        return [
          { label: 'Home', href: `/${platform}` },
          { label: 'About', href: `/${platform}/about` },
          {
            label: 'Academics',
            href: `/${platform}/programs`,
            children: [
              { label: 'Programs', href: `/${platform}/programs` },
              { label: 'Classes', href: `/${platform}/classes` },
              { label: 'Courses', href: `/${platform}/courses` },
              { label: 'E-Library', href: `/${platform}/library` },
            ]
          },
          { label: 'Admissions', href: `/${platform}/admissions` },
          { label: 'Events', href: `/${platform}/events` },
          { label: 'Blog', href: `/${platform}/blog` },
          { label: 'Shop', href: `/${platform}/shop` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      case 'masjid':
        return [
          { label: 'Home', href: `/${platform}` },
          { label: 'About', href: `/${platform}/about` },
          { label: 'Prayer Times', href: `/${platform}/prayer-times` },
          {
            label: 'Media',
            href: `/${platform}/audio`,
            children: [
              { label: 'Audio Library', href: `/${platform}/audio` },
              { label: 'Quran Player', href: `/${platform}/quran` },
            ]
          },
          { label: 'Events', href: `/${platform}/events` },
          { label: 'Blog', href: `/${platform}/blog` },
          { label: 'Donations', href: `/${platform}/donations` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      case 'charity':
        return [
          { label: 'Home', href: `/${platform}` },
          { label: 'About', href: `/${platform}/about` },
          { label: 'Campaigns', href: `/${platform}/campaigns` },
          { label: 'Projects', href: `/${platform}/projects` },
          { label: 'Volunteer', href: `/${platform}/volunteer` },
          { label: 'Testimonials', href: `/${platform}/testimonials` },
          { label: 'Blog', href: `/${platform}/blog` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      case 'travels':
        return [
          { label: 'Home', href: `/${platform}` },
          { label: 'About', href: `/${platform}/about` },
          {
            label: 'Services',
            href: `/${platform}/packages`,
            children: [
              { label: 'Hajj Packages', href: `/${platform}/packages?type=hajj` },
              { label: 'Umrah Packages', href: `/${platform}/packages?type=umrah` },
              { label: 'Tours', href: `/${platform}/packages?type=tour` },
            ]
          },
          { label: 'Booking', href: `/${platform}/booking` },
          { label: 'Courses', href: `/${platform}/courses` },
          { label: 'Reviews', href: `/${platform}/reviews` },
          { label: 'Blog', href: `/${platform}/blog` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const getPlatformIcon = () => {
    switch (platform) {
      case 'school': return <BookOpen className="w-6 h-6" />;
      case 'masjid': return <Home className="w-6 h-6" />;
      case 'charity': return <Heart className="w-6 h-6" />;
      case 'travels': return <Plane className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  const isActiveLink = (href: string) => {
    if (href === `/${platform}`) {
      return location.pathname === `/${platform}` || location.pathname === `/${platform}/`;
    }
    return location.pathname.startsWith(href);
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    if (item.children) {
      return (
        <DropdownMenu key={item.label}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`${isMobile ? 'w-full justify-start' : ''} hover:bg-platform-primary/10 hover:text-platform-primary`}
            >
              {item.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? "start" : "center"}>
            {item.children.map((child) => (
              <DropdownMenuItem key={child.href} asChild>
                <Link
                  to={child.href}
                  className="w-full hover:bg-platform-primary/10 hover:text-platform-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        className={`${
          isMobile ? 'block w-full text-left px-4 py-2' : 'px-3 py-2'
        } rounded-md text-sm font-medium transition-colors duration-200 ${
          isActiveLink(item.href)
            ? 'bg-platform-primary text-white'
            : 'text-gray-700 hover:bg-platform-primary/10 hover:text-platform-primary'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-platform-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={`/${platform}`}
            className="flex items-center space-x-3 text-platform-primary hover:text-platform-secondary transition-colors"
          >
            <div className="p-2 bg-platform-primary/10 rounded-lg">
              {getPlatformIcon()}
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">Minhaajulhudaa</div>
              <div className="text-xs text-gray-600 capitalize">{platform}</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => renderNavigationItem(item))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-platform-primary"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-platform-primary/10">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => renderNavigationItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PlatformNavigation;
