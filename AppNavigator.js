// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@context/AuthContext';

// Screens
import LoginScreen from '@screens/LoginScreen';
import SignupScreen from '@screens/SignupScreen';
import ForgotPasswordScreen from '@screens/ForgotPasswordScreen';
import HomeScreen from '@screens/HomeScreen';
import WatchlistScreen from '@screens/WatchlistScreen';
import ProfileScreen from '@screens/ProfileScreen';
import AnimeDetailScreen from '@screens/AnimeDetailScreen';
import SearchResultsScreen from '@screens/SearchResultsScreen';
import RandomAnimeScreen from '@screens/RandomAnimeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Watchlist') iconName = focused ? 'bookmark' : 'bookmark-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#5e72e4',
      tabBarInactiveTintColor: '#8b93a8',
      tabBarStyle: {
        backgroundColor: '#2d325a',
        borderTopWidth: 0,
        height: 60,
        paddingTop: 4,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Full Navigation
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AnimeDetail" component={AnimeDetailScreen} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="RandomAnime" component={RandomAnimeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
