// App.js
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
