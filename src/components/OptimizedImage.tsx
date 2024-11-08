import { useEffect, useRef } from 'react';
import { lazyLoadImage } from '../utils/performance';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function OptimizedImage({ src, alt, width, height, className }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      lazyLoadImage(imgRef.current);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      data-src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}