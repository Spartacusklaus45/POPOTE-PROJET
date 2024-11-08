import { Share } from '@capacitor/share';
import { usePlatform } from './usePlatform';

export function useShare() {
  const { isNative } = usePlatform();

  const shareContent = async ({
    title,
    text,
    url,
    files = []
  }: {
    title?: string;
    text?: string;
    url?: string;
    files?: string[];
  }) => {
    try {
      if (isNative) {
        await Share.share({
          title,
          text,
          url,
          files
        });
      } else if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
          files: files.length > 0 ? files.map(file => new File([], file)) : undefined
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = url || window.location.href;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text || ''
          )}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  return { shareContent };
}