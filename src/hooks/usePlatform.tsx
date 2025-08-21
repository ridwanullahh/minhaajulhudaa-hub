import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlatformType, PLATFORM_CONFIGS } from '@/types/platform';
import { PLATFORM_THEMES } from '@/constants/brand';
import { getPlatformDB } from '@/lib/platform-db';

export const usePlatform = () => {
  const location = useLocation();
  const [dynamicSettings, setDynamicSettings] = useState({});
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const platformSlug = pathSegments[0] as PlatformType;
  
  const currentPlatform: PlatformType = 
    platformSlug && Object.keys(PLATFORM_CONFIGS).includes(platformSlug) ? platformSlug : 'school';
  
  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentPlatform) return;
      setIsLoadingSettings(true);
      try {
        const db = getPlatformDB(currentPlatform);
        const settingsData = await db.get('settings');
        if (settingsData.length > 0) {
          setDynamicSettings(settingsData[0]);
        }
      } catch (error) {
        console.error(`Failed to fetch settings for ${currentPlatform}`, error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchSettings();
  }, [currentPlatform]);

  const staticConfig = PLATFORM_CONFIGS[currentPlatform];
  const theme = PLATFORM_THEMES[currentPlatform];
  
  // Merge static config with dynamic settings from DB
  const config = { ...staticConfig, ...dynamicSettings };
  
  return {
    platform: currentPlatform,
    config,
    theme,
    isLoadingSettings,
    platformPath: `/${currentPlatform}`,
    adminPath: `/${currentPlatform}/admin`
  };
};
