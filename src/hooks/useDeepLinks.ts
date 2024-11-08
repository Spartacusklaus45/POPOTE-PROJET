import { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import { usePlatform } from './usePlatform';

export function useDeepLinks() {
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const { isNative } = usePlatform();

  useEffect(() => {
    if (isNative) {
      const handleDeepLink = App.addListener('appUrlOpen', (data: { url: string }) => {
        setDeepLink(data.url);
      });

      return () => {
        handleDeepLink.remove();
      };
    } else {
      // Handle web deep links
      const handleWebDeepLink = () => {
        const { hash, search } = window.location;
        if (hash || search) {
          setDeepLink(window.location.href);
        }
      };

      window.addEventListener('popstate', handleWebDeepLink);
      handleWebDeepLink();

      return () => {
        window.removeEventListener('popstate', handleWebDeepLink);
      };
    }
  }, [isNative]);

  return { deepLink };
}