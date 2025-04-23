// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const ThemeContext = createContext();

// Light and dark theme values
const themes = {
  light: {
    isDarkMode: false,
    themeStyles: {
      backgroundColor: '#f5f5f5',
      cardColor: '#ffffff',
      textColor: '#121212',
      secondaryTextColor: '#6e6e6e',
      statText: '#505050',
      borderColor: 'rgba(0,0,0,0.1)',
      gradientColors: ['#f0f2f5', '#e0e3e8'],
      primary: '#5e72e4',
      accent: '#ff3867',
    }
  },
  dark: {
    isDarkMode: true,
    themeStyles: {
      backgroundColor: '#1e2246',
      cardColor: '#2d325a',
      textColor: '#ffffff',
      secondaryTextColor: '#a0a0cc',
      statText: '#d0d0e0',
      borderColor: 'rgba(255,255,255,0.1)',
      gradientColors: ['#192045', '#0f1535'],
      primary: '#5e72e4',
      accent: '#ff3867',
    }
  }
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Load theme preference from storage when app starts
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Toggle theme function
  const toggleTheme = async () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newThemeValue));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Current theme based on isDarkMode
  const currentTheme = isDarkMode ? themes.dark : themes.light;

  // Context value to be provided
  const value = {
    ...currentTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};