"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // light, dark, system
  const [resolvedTheme, setResolvedTheme] = useState("light"); // actual theme being used

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("techterview-theme");
    // For now, only light mode is supported
    if (savedTheme === "light") {
      setTheme(savedTheme);
    } else {
      // Default to light mode for now
      setTheme("light");
    }
  }, []);

  // Update resolved theme based on theme setting
  useEffect(() => {
    // For now, always use light mode
    setResolvedTheme("light");
  }, [theme]);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove("light", "dark");
    
    // Add current theme class
    root.classList.add(resolvedTheme);
    
    // Update color-scheme for better native element styling
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("techterview-theme", theme);
  }, [theme]);

  const setThemeValue = (newTheme) => {
    // For now, only light mode is supported
    if (newTheme === "light") {
      setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    const themeOrder = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setThemeValue(themeOrder[nextIndex]);
  };

  const value = {
    theme, // The user's preference (light, dark, system)
    resolvedTheme, // The actual theme being applied (light or dark)
    setTheme: setThemeValue,
    toggleTheme,
    isLight: resolvedTheme === "light",
    isDark: resolvedTheme === "dark",
    isSystem: theme === "system"
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}