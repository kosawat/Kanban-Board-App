import { useState, useEffect } from "react";

// Custom hook to sync state with localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Checks if the code is running in the browser
    if (typeof window !== "undefined") {
      // Get the stored value from localStorage
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    // If not in the browser, returns the initial value
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
}
