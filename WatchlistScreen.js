// src/screens/WatchlistScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  useColorScheme
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WatchlistScreen = ({ navigation }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  
  // Define theme colors based on system preference
  const theme = {
    background: colorScheme === 'dark' ? '#1e2246' : '#f5f5f5',
    card: colorScheme === 'dark' ? '#2d325a' : '#ffffff',
    text: colorScheme === 'dark' ? '#ffffff' : '#121212',
    subText: colorScheme === 'dark' ? '#a0a0cc' : '#6e6e6e',
    statText: colorScheme === 'dark' ? '#d0d0e0' : '#505050',
    primary: '#5e72e4',
    accent: colorScheme === 'dark' ? '#8b93a8' : '#8b93a8',
  };

  useEffect(() => {
    loadWatchlist();
    
    // Refresh watchlist when navigating back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadWatchlist();
    });

    return unsubscribe;
  }, [navigation]);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const watchlistData = await AsyncStorage.getItem('watchlist');
      if (watchlistData) {
        setWatchlist(JSON.parse(watchlistData));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
      Alert.alert('Error', 'Failed to load your watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (animeId) => {
    try {
      const updatedWatchlist = watchlist.filter(anime => anime.mal_id !== animeId);
      await AsyncStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setWatchlist(updatedWatchlist);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      Alert.alert('Error', 'Failed to remove from watchlist');
    }
  };

  const renderAnimeItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.animeItem, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('AnimeDetail', { anime: item })}
    >
      <Image 
        source={{ uri: item.images.jpg.image_url }} 
        style={styles.animeImage}
        resizeMode="cover"
      />
      <View style={styles.animeInfo}>
        <Text style={[styles.animeTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.animeSubtitle, { color: theme.subText }]} numberOfLines={1}>
          {item.title_english && item.title_english !== item.title 
            ? item.title_english 
            : item.type || ''}
        </Text>
        
        <View style={styles.animeStats}>
          {item.score && (
            <View style={styles.statContainer}>
              <Ionicons name="star" size={14} color="#ffd700" />
              <Text style={[styles.statText, { color: theme.statText }]}>{item.score}</Text>
            </View>
          )}
          {item.episodes && (
            <View style={styles.statContainer}>
              <Ionicons name="tv-outline" size={14} color={theme.subText} />
              <Text style={[styles.statText, { color: theme.statText }]}>{item.episodes} eps</Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFromWatchlist(item.mal_id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff5252" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Watchlist</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : watchlist.length > 0 ? (
        <FlatList
          data={watchlist}
          renderItem={renderAnimeItem}
          keyExtractor={(item) => item.mal_id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={60} color={theme.accent} />
          <Text style={[styles.emptyText, { color: theme.accent }]}>Your watchlist is empty</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Anime</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  animeItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animeImage: {
    width: 100,
    height: 140,
  },
  animeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  animeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  animeSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  animeStats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#5e72e4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  }
});

export default WatchlistScreen;