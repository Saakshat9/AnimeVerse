// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fetchTrendingAnime, searchAnime } from '@api/animeApi';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext'; // Theme context

const AnimeCard = ({ anime, onPress, themeStyles }) => {
  return (
    <TouchableOpacity 
      style={[styles.animeCard, { backgroundColor: themeStyles.cardColor }]}
      onPress={() => onPress(anime)}
    >
      <Image 
        source={{ uri: anime.images.jpg.image_url }} 
        style={styles.animeImage}
        resizeMode="cover"
      />
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{anime.score?.toFixed(1) || 'N/A'}</Text>
      </View>
      <Text style={[styles.animeTitle, { color: themeStyles.textColor }]} numberOfLines={1}>
        {anime.title}
      </Text>
      <View style={styles.genreContainer}>
        {anime.genres?.slice(0, 2).map((genre, index) => (
          <View key={index} style={[styles.genreBadge, { backgroundColor: themeStyles.isDarkMode ? '#3a4173' : '#e8e8ff' }]}>
            <Text style={[styles.genreText, { color: themeStyles.secondaryTextColor }]}>{genre.name}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchAnim = new Animated.Value(0);
  const { user, logout } = useAuth();
  
  // Use optional chaining to safely handle potential undefined theme context
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode || true; // Default to true if theme is undefined
  const toggleTheme = theme?.toggleTheme || (() => {});
  const themeStyles = theme?.themeStyles || {
    backgroundColor: '#1e2246',
    cardColor: '#2d325a',
    textColor: '#ffffff',
    secondaryTextColor: '#a0a0cc',
  };

  useEffect(() => {
    loadTrendingAnime();
  }, []);

  // Effect for animation
  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  // Calculate animated values
  const searchBarWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['92%', '100%']
  });

  const loadTrendingAnime = async () => {
    setIsLoading(true);
    try {
      const animeData = await fetchTrendingAnime();
      setTrendingAnime(animeData);
    } catch (error) {
      console.error('Error loading trending anime:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchAnime(searchQuery);
      navigation.navigate('SearchResults', { results, query: searchQuery });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrendingAnime();
    setRefreshing(false);
  };

  const handleRandomRecommendation = () => {
    navigation.navigate('RandomAnime');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <View style={styles.header}>
        <Animated.View style={[
          styles.searchContainer, 
          { 
            width: searchBarWidth,
            backgroundColor: themeStyles.cardColor
          }
        ]}>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={20} 
              color={isFocused ? "#5e72e4" : themeStyles.secondaryTextColor} 
              style={styles.searchIcon} 
            />
          </TouchableOpacity>
          <TextInput
            style={[styles.searchInput, { color: themeStyles.textColor }]}
            placeholder="Search anime..."
            placeholderTextColor={themeStyles.secondaryTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={themeStyles.secondaryTextColor} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      
      <TouchableOpacity 
        style={styles.randomButton}
        onPress={handleRandomRecommendation}
      >
        <Ionicons name="gift" size={20} color="#ffffff" />
        <Text style={styles.randomButtonText}>Random Recommendation</Text>
      </TouchableOpacity>
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#5e72e4"]}
            tintColor={isDarkMode ? "#5e72e4" : "#4a5de2"}
          />
        }
      >
        <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>Trending Anime</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#5e72e4" style={styles.loader} />
        ) : (
          <View style={styles.animeGrid}>
            {trendingAnime.map((anime) => (
              <AnimeCard 
                key={anime.mal_id} 
                anime={anime}
                themeStyles={themeStyles}
                onPress={(anime) => navigation.navigate('AnimeDetail', { anime })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is now dynamic and applied via themeStyles
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor is now dynamic and applied via themeStyles
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    // color is now dynamic and applied via themeStyles
    fontSize: 16,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a5de2',
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  randomButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // color is now dynamic and applied via themeStyles
    marginBottom: 15,
  },
  animeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animeCard: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    // backgroundColor is now dynamic and applied via themeStyles
  },
  animeImage: {
    width: '100%',
    height: 180,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#ffb400',
    fontWeight: 'bold',
    fontSize: 12,
  },
  animeTitle: {
    // color is now dynamic and applied via themeStyles
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
  },
  genreContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  genreBadge: {
    // backgroundColor is now dynamic and applied via themeStyles
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
  },
  genreText: {
    // color is now dynamic and applied via themeStyles
    fontSize: 10,
  },
  loader: {
    marginTop: 50,
  }
});

export default HomeScreen;