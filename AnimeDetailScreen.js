// src/screens/AnimeDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { getAnimeDetails } from '@api/animeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const AnimeDetailScreen = ({ route, navigation }) => {
  const { anime } = route.params;
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await getAnimeDetails(anime.mal_id);
        setAnimeDetails(details);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkWatchlist = async () => {
      try {
        const watchlistData = await AsyncStorage.getItem('watchlist');
        if (watchlistData) {
          const watchlist = JSON.parse(watchlistData);
          const isInWatchlist = watchlist.some(item => item.mal_id === anime.mal_id);
          setInWatchlist(isInWatchlist);
        }
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };

    fetchDetails();
    checkWatchlist();
  }, [anime.mal_id]);

  const toggleWatchlist = async () => {
    try {
      let watchlist = [];
      const watchlistData = await AsyncStorage.getItem('watchlist');
      
      if (watchlistData) {
        watchlist = JSON.parse(watchlistData);
      }
      
      if (inWatchlist) {
        // Remove from watchlist
        watchlist = watchlist.filter(item => item.mal_id !== anime.mal_id);
        await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
        setInWatchlist(false);
        Alert.alert('Success', 'Removed from watchlist');
      } else {
        // Add to watchlist
        watchlist.push(anime);
        await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
        setInWatchlist(true);
        Alert.alert('Success', 'Added to watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      Alert.alert('Error', 'Failed to update watchlist');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5e72e4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {anime.title}
        </Text>
        <TouchableOpacity style={styles.watchlistButton} onPress={toggleWatchlist}>
          <Ionicons
            name={inWatchlist ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: anime.images.jpg.large_image_url || anime.images.jpg.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.watchlistButtonAbsolute} onPress={toggleWatchlist}>
            <Ionicons
              name={inWatchlist ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#ffffff"
            />
          </TouchableOpacity>

          <View style={styles.heroOverlay}>
            <View style={styles.titleContainer}>
              <Text style={styles.animeTitle}>{anime.title}</Text>
              {anime.title_english && anime.title_english !== anime.title && (
                <Text style={styles.animeSubtitle}>{anime.title_english}</Text>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{anime.score || 'N/A'}</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{anime.rank || 'N/A'}</Text>
                <Text style={styles.statLabel}>Rank</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{anime.episodes || '?'}</Text>
                <Text style={styles.statLabel}>Episodes</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genresScroll}>
            {anime.genres?.map((genre) => (
              <View key={genre.mal_id} style={styles.genreBadge}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsisText}>
              {anime.synopsis || 'No synopsis available.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{anime.type || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{anime.status || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Aired</Text>
              <Text style={styles.infoValue}>{anime.aired?.string || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{anime.duration || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{anime.rating || 'N/A'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.watchButton}>
            <Ionicons name="play" size={20} color="#ffffff" />
            <Text style={styles.watchButtonText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2246',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e2246',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: '#1e2246',
    zIndex: 100,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  watchlistButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 450,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  watchlistButtonAbsolute: {
    position: 'absolute',
    top: 50,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  titleContainer: {
    marginBottom: 15,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  animeSubtitle: {
    color: '#d0d0e0',
    fontSize: 16,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 2,
  },
  contentContainer: {
    padding: 20,
  },
  genresScroll: {
    marginBottom: 15,
  },
  genreBadge: {
    backgroundColor: '#5e72e4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  synopsisText: {
    color: '#dddddd',
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#bbbbbb',
    fontSize: 14,
    width: '40%',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 14,
    width: '60%',
    textAlign: 'right',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5e72e4',
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
  },
  watchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AnimeDetailScreen;