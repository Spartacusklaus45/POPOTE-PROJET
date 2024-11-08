import { useEffect } from 'react';

// Préchargement des ressources critiques
export const preloadCriticalResources = () => {
  const resources = [
    { type: 'image', url: '/logo.png' },
    { type: 'font', url: '/fonts/main.woff2' }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = resource.type === 'image' ? 'preload' : 'preload';
    link.as = resource.type;
    link.href = resource.url;
    document.head.appendChild(link);
  });
};

// Lazy loading des images
export const lazyLoadImage = (imgElement: HTMLImageElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        observer.unobserve(img);
      }
    });
  });
  observer.observe(imgElement);
};

// Cache des requêtes API
const apiCache = new Map();
export const cachedFetch = async (url: string, options: RequestInit = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const response = await fetch(url, options);
  const data = await response.json();
  apiCache.set(cacheKey, data);
  return data;
};

// Mesure des performances
export const measurePerformance = (componentName: string) => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    if (duration > 100) {
      console.warn(`Performance warning: ${componentName} took ${duration}ms to render`);
    }
  };
};