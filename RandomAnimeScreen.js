// src/screens/RandomAnimeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const RandomAnimeScreen = ({ navigation }) => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation
  const fadeAnim = new Animated.Value(0);
  
  const fetchRandomAnime = async () => {
    setLoading(true);
    fadeAnim.setValue(0);
    
    try {
      const response = await fetch('https://api.jikan.moe/v4/random/anime');
      const data = await response.json();
      setAnime(data.data);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    } catch (error) {
      console.error('Error fetching random anime:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchRandomAnime();
  }, []);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRandomAnime();
  };

  if (loading && !anime) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5e72e4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Random Recommendation</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Animated.View 
          style={[
            styles.animeContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Image 
            source={{ uri: anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url }} 
            style={styles.animeImage}
            resizeMode="cover"
          />
          
          <View style={styles.animeDetails}>
            <Text style={styles.animeTitle}>{anime?.title}</Text>
            
            {anime?.title_english && anime.title_english !== anime.title && (
              <Text style={styles.animeSubtitle}>{anime.title_english}</Text>
            )}
            
            <View style={styles.statsRow}>
              {anime?.score && (
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#ffd700" />
                  <Text style={styles.statText}>{anime.score}</Text>
                </View>
              )}
              
              {anime?.episodes && (
                <View style={styles.statItem}>
                  <Ionicons name="tv-outline" size={16} color="#a0a0cc" />
                  <Text style={styles.statText}>{anime.episodes} eps</Text>
                </View>
              )}
              
              {anime?.status && (
                <View style={styles.statItem}>
                  <Ionicons name="ellipse" size={8} color={
                    anime.status.includes('Airing') ? '#4caf50' :
                    anime.status.includes('Finished') ? '#ff9800' : '#8b93a8'
                  } />
                  <Text style={styles.statText}>{anime.status}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.genreContainer}>
              {anime?.genres?.map(genre => (
                <View key={genre.mal_id} style={styles.genreBadge}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
            
            {anime?.synopsis && (
              <View style={styles.synopsisContainer}>
                <Text style={styles.synopsisText}>{anime.synopsis}</Text>
              </View>
            )}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => navigation.navigate('AnimeDetail', { anime })}
              >
                <Text style={styles.detailButtonText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="refresh" size={18} color="#ffffff" />
                    <Text style={styles.refreshButtonText}>New Random</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  animeContainer: {
    backgroundColor: '#2d325a',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  animeImage: {
    width: '100%',
    height: 240,
  },
  animeDetails: {
    padding: 15,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  animeSubtitle: {
    color: '#a0a0cc',
    fontSize: 16,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    color: '#d0d0e0',
    fontSize: 14,
    marginLeft: 5,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  genreBadge: {
    backgroundColor: '#3a4173',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
  },
  synopsisContainer: {
    marginBottom: 20,
  },
  synopsisText: {
    color: '#d0d0e0',
    fontSize: 15,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailButton: {
    backgroundColor: '#5e72e4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#4a5de2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RandomAnimeScreen;