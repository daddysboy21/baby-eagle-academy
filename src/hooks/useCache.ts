import { useState, useEffect, useCallback } from 'react';

interface CacheConfig {
  key: string;
  ttl?: number; // Time to live in milliseconds
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// In-memory cache for temporary storage
const memoryCache = new Map<string, CacheEntry<any>>();

export const useCache = <T>({ key, ttl = 5 * 60 * 1000, storage = 'memory' }: CacheConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStorage = useCallback(() => {
    switch (storage) {
      case 'localStorage':
        return window.localStorage;
      case 'sessionStorage':
        return window.sessionStorage;
      default:
        return null;
    }
  }, [storage]);

  const getCachedData = useCallback((): T | null => {
    try {
      if (storage === 'memory') {
        const entry = memoryCache.get(key);
        if (entry && Date.now() - entry.timestamp < entry.ttl) {
          return entry.data;
        }
        memoryCache.delete(key);
        return null;
      }

      const storageObj = getStorage();
      if (!storageObj) return null;

      const cached = storageObj.getItem(key);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - entry.timestamp < entry.ttl) {
        return entry.data;
      }

      // Cache expired, remove it
      storageObj.removeItem(key);
      return null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }, [key, storage, ttl, getStorage]);

  const setCachedData = useCallback((newData: T) => {
    try {
      const entry: CacheEntry<T> = {
        data: newData,
        timestamp: Date.now(),
        ttl
      };

      if (storage === 'memory') {
        memoryCache.set(key, entry);
        return;
      }

      const storageObj = getStorage();
      if (!storageObj) return;

      storageObj.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }, [key, storage, ttl, getStorage]);

  const clearCache = useCallback(() => {
    try {
      if (storage === 'memory') {
        memoryCache.delete(key);
        return;
      }

      const storageObj = getStorage();
      if (!storageObj) return;

      storageObj.removeItem(key);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [key, storage, getStorage]);

  const fetchData = useCallback(async <R>(
    fetchFn: () => Promise<R>,
    options?: { forceRefresh?: boolean }
  ): Promise<R> => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first unless force refresh is requested
      if (!options?.forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData !== null) {
          setData(cachedData);
          setLoading(false);
          return cachedData as unknown as R;
        }
      }

      // Fetch fresh data
      const result = await fetchFn();
      
      // Cache the result
      setCachedData(result as unknown as T);
      setData(result as unknown as T);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Try to return cached data as fallback
      const cachedData = getCachedData();
      if (cachedData !== null) {
        setData(cachedData);
        return cachedData as unknown as R;
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  // Load cached data on mount
  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData !== null) {
      setData(cachedData);
    }
  }, [getCachedData]);

  return {
    data,
    loading,
    error,
    fetchData,
    clearCache,
    setCachedData,
    getCachedData
  };
};

// Utility function to clear all cache
export const clearAllCache = () => {
  // Clear memory cache
  memoryCache.clear();
  
  // Clear localStorage entries with our prefix
  if (typeof window !== 'undefined') {
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith('befa-')) {
        window.localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage entries with our prefix
    const sessionKeys = Object.keys(window.sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('befa-')) {
        window.sessionStorage.removeItem(key);
      }
    });
  }
};

// Cache keys constants
export const CACHE_KEYS = {
  PLAYERS: 'befa-players',
  STAFF: 'befa-staff',
  NEWS: 'befa-news',
  GALLERY: 'befa-gallery',
  USERS: 'befa-users',
  APPLICATIONS: 'befa-applications',
  SETTINGS: 'befa-settings'
} as const;