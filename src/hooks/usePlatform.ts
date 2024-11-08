import { useState, useEffect } from 'react';

type Platform = 'web' | 'ios' | 'android';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (window.Capacitor) {
        setIsNative(true);
        if (userAgent.includes('ios')) {
          setPlatform('ios');
        } else if (userAgent.includes('android')) {
          setPlatform('android');
        }
      } else {
        setIsNative(false);
        setPlatform('web');
      }
    };

    detectPlatform();
  }, []);

  return { platform, isNative };
}