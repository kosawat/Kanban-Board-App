import { useState, useEffect } from "react";

// Custom hook to sync state with localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Checks if the code is running in the browser
    if (typeof window !== "undefined") {
      // Get the stored value from localStorage
      const stored = localStorage.getItem(key);
      try {
        // Attempt to parse stored JSON
        return stored ? JSON.parse(stored) : initialValue;
      } catch (error) {
        console.warn(`Error parsing localStorage key "${key}":`, error);
        // Remove the corrupted value
        localStorage.removeItem(key);
        return initialValue;
      }
    }
    return initialValue;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Save state to localStorage as JSON
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue] as const;
}
