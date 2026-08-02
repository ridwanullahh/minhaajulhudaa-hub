import { useEffect } from 'react';

/**
 * Google Analytics integration
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Loads Google Analytics 4 only when VITE_GOOGLE_ANALYTICS_ID is set.
 * Respects user privacy: no cookies set in development, and the
 * script is only injected when the ID is configured.
 *
 * Usage: just render <GoogleAnalytics /> once in the app (it's already
 * included in AppProviders). No props needed - it reads the ID from
 * config.integrations.googleAnalyticsId.
 */

import config from '@/lib/config';

const GA_ID = config.integrations.googleAnalyticsId;

export function trackPageView(path: string): void {
  if (!GA_ID || typeof window === 'undefined') return;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('config', GA_ID, { page_path: path });
  }
}

export function trackEvent(action: string, params: Record<string, any> = {}): void {
  if (!GA_ID || typeof window === 'undefined') return;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', action, params);
  }
}

const GoogleAnalytics: React.FC = () => {
  useEffect(() => {
    if (!GA_ID) return;

    // Load the gtag script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function () {
      ((window as any).dataLayer = (window as any).dataLayer || []).push(arguments);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', GA_ID, { send_page_view: false });

    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);

    return () => {
      // Cleanup: remove the script if component unmounts
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
    };
  }, []);

  // Track route changes
  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = () => {
      trackPageView(window.location.pathname + window.location.search);
    };
    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Render nothing - GA is script-only
  return null;
};

export default GoogleAnalytics;
