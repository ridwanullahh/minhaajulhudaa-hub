
import { useLocation } from 'react-router-dom';
import { PlatformType, PLATFORM_CONFIGS } from '@/types/platform';
import { PLATFORM_THEMES } from '@/constants/brand';

export const usePlatform = () => {
  const location = useLocation();
  
  // Extract platform from pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const platformSlug = pathSegments[0] as PlatformType;
  
  // Default to school if no platform specified or invalid platform
  const currentPlatform: PlatformType = 
    platformSlug && platformSlug in PLATFORM_CONFIGS ? platformSlug : 'school';
  
  const config = PLATFORM_CONFIGS[currentPlatform];
  const theme = PLATFORM_THEMES[currentPlatform];
  
  const isAdminRoute = location.pathname.includes('/admin');
  
  return {
    platform: currentPlatform,
    config,
    theme,
    isAdminRoute,
    platformPath: `/${currentPlatform}`,
    adminPath: `/${currentPlatform}/admin`
  };
};
