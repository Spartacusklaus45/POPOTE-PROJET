import { useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';
import { usePlatform } from './usePlatform';

const store = new Storage();
store.create();

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const { isNative } = usePlatform();

  useEffect(() => {
    const loadValue = async () => {
      try {
        let storedValue: T | null;
        
        if (isNative) {
          storedValue = await store.get(key);
        } else {
          const item = localStorage.getItem(key);
          storedValue = item ? JSON.parse(item) : null;
        }

        setValue(storedValue ?? initialValue);
      } catch (error) {
        console.error('Error loading value:', error);
        setValue(initialValue);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key, initialValue, isNative]);

  const setStoredValue = async (newValue: T) => {
    try {
      setValue(newValue);
      
      if (isNative) {
        await store.set(key, newValue);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const removeStoredValue = async () => {
    try {
      setValue(initialValue);
      
      if (isNative) {
        await store.remove(key);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing value:', error);
    }
  };

  return { value, setValue: setStoredValue, remove: removeStoredValue, isLoading };
}