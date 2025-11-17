// Auto-save hook for form data
import { useEffect, useRef, useCallback } from 'react';

/**
 * Auto-save hook - automatically saves form data to localStorage
 * @param {Object} data - Data to save
 * @param {string} key - LocalStorage key
 * @param {number} delay - Debounce delay in ms (default: 2000)
 */
export function useAutoSave(data, key, delay = 2000) {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  const save = useCallback(() => {
    try {
      const dataToSave = {
        data,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(key, JSON.stringify(dataToSave));
      lastSavedRef.current = new Date();

      // Dispatch custom event for UI feedback
      window.dispatchEvent(new CustomEvent('autosave', {
        detail: { key, timestamp: lastSavedRef.current }
      }));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [data, key]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save]);

  // Load saved data
  const loadSaved = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.data;
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
    return null;
  }, [key]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('autosave-cleared', { detail: { key } }));
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, [key]);

  return {
    loadSaved,
    clearSaved,
    lastSaved: lastSavedRef.current
  };
}

/**
 * Hook to listen for auto-save events (for UI feedback)
 */
export function useAutoSaveStatus(callback) {
  useEffect(() => {
    const handler = (event) => {
      callback(event.detail);
    };

    window.addEventListener('autosave', handler);
    window.addEventListener('autosave-cleared', handler);

    return () => {
      window.removeEventListener('autosave', handler);
      window.removeEventListener('autosave-cleared', handler);
    };
  }, [callback]);
}

export default useAutoSave;
