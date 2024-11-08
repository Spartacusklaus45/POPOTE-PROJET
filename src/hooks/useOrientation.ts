import { useState, useEffect } from 'react';
import { usePlatform } from './usePlatform';

type Orientation = 'portrait' | 'landscape';

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const { isNative } = usePlatform();

  useEffect(() => {
    const updateOrientation = () => {
      if (isNative) {
        // Use screen orientation for native apps
        setOrientation(
          screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
        );
      } else {
        // Use window dimensions for web
        setOrientation(
          window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
        );
      }
    };

    updateOrientation();

    if (isNative) {
      screen.orientation.addEventListener('change', updateOrientation);
    } else {
      window.addEventListener('resize', updateOrientation);
    }

    return () => {
      if (isNative) {
        screen.orientation.removeEventListener('change', updateOrientation);
      } else {
        window.removeEventListener('resize', updateOrientation);
      }
    };
  }, [isNative]);

  return { orientation };
}