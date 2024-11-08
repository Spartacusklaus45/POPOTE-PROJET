import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { usePlatform } from './usePlatform';

export function useHaptics() {
  const { isNative } = usePlatform();

  const impact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style });
    }
  };

  const vibrate = async (duration = 300) => {
    if (isNative) {
      await Haptics.vibrate({ duration });
    } else if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  const notification = async (type: 'SUCCESS' | 'WARNING' | 'ERROR') => {
    if (isNative) {
      await Haptics.notification({ type });
    }
  };

  return { impact, vibrate, notification };
}