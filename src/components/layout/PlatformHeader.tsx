import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Home,
  Heart,
  Plane
} from 'lucide-react';
import { usePlatform } from '@/hooks/usePlatform';
import { ModernButton } from '@/components/ui/ModernButton';
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

const PlatformHeader: React.FC = () => {
  const { platform, config } = usePlatform();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = (): NavigationItem[] => {
    // This logic is moved from PlatformNavigation.tsx
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
            ]
          },
          { label: 'Admissions', href: `/${platform}/admissions` },
          { label: 'Blog', href: `/${platform}/blog` },
          { label: 'Contact', href: `/${platform}/contact` },
        ];
      case 'masjid':
         return [
          { label: 'Home', href: `/${platform}` },
          { label: 'About', href: `/${platform}/about` },
          { label: 'Prayer Times', href: `/${platform}/prayer-times` },
          { label: 'Events', href: `/${platform}/events` },
          { label: 'Audio Library', href: `/${platform}/audio` },
          { label: 'Blog', href: `/${platform}/blog` },
        ];
      // Other platforms would follow the same pattern...
      default:
        return [{ label: 'Home', href: `/${platform}` }];
    }
  };

  const navigationItems = getNavigationItems();

  const getPlatformIcon = () => {
    switch (platform) {
      case 'school': return <BookOpen className="w-8 h-8" />;
      case 'masjid': return <Home className="w-8 h-8" />;
      case 'charity': return <Heart className="w-8 h-8" />;
      case 'travels': return <Plane className="w-8 h-8" />;
      default: return <Home className="w-8 h-8" />;
    }
  };

  const isActiveLink = (href: string) => {
    if (href === `/${platform}`) {
      return location.pathname === `/${platform}` || location.pathname === `/${platform}/`;
    }
    return location.pathname.startsWith(href);
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    // This rendering logic is also from PlatformNavigation
    if (item.children) {
      return (
        <DropdownMenu key={item.label}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`${isMobile ? 'w-full justify-start' : ''} hover:bg-primary/10 hover:text-primary`}>
              {item.label} <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? "start" : "center"}>
            {item.children.map((child) => (
              <DropdownMenuItem key={child.href} asChild>
                <Link to={child.href} className="w-full" onClick={() => setIsMobileMenuOpen(false)}>{child.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link key={item.href} to={item.href}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActiveLink(item.href) ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
      <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-primary/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={`/${platform}`} className="flex items-center space-x-3 text-primary group">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                {getPlatformIcon()}
              </div>
              <div>
                <div className="font-bold text-xl leading-tight">Minhaajulhudaa</div>
                <div className="text-sm text-muted-foreground capitalize">{platform}</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
                {navigationItems.map((item) => renderNavigationItem(item))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
               <div className="hidden lg:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="Search..." className="pl-10 w-48" />
              </div>
              <ModernButton size="sm">
                  {platform === 'school' ? 'Portal' : 'Donate'}
              </ModernButton>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
                {isMobileMenuOpen ? <X/> : <Menu/>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2 px-4">
              {navigationItems.map((item) => renderNavigationItem(item, true))}
            </nav>
          </div>
        )}
      </header>
  );
};

export default PlatformHeader;
