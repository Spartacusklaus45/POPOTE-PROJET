import { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNetworkStatus } from './useNetworkStatus';
import { usePlatform } from './usePlatform';

export function useAppState() {
  const [isActive, setIsActive] = useState(true);
  const { isOnline } = useNetworkStatus();
  const { isNative } = usePlatform();

  useEffect(() => {
    if (isNative) {
      const handleAppStateChange = App.addListener('appStateChange', ({ isActive: active }) => {
        setIsActive(active);
      });

      return () => {
        handleAppStateChange.remove();
      };
    } else {
      const handleVisibilityChange = () => {
        setIsActive(!document.hidden);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isNative]);

  return { isActive, isOnline };
}