// src/screens/SearchResultsScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const SearchResultsScreen = ({ route, navigation }) => {
  const { results, query } = route.params;

  const renderAnimeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.animeItem}
      onPress={() => navigation.navigate('AnimeDetail', { anime: item })}
    >
      <Image 
        source={{ uri: item.images.jpg.image_url }} 
        style={styles.animeImage}
        resizeMode="cover"
      />
      <View style={styles.animeInfo}>
        <Text style={styles.animeTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.animeSubtitle} numberOfLines={1}>
          {item.title_english && item.title_english !== item.title 
            ? item.title_english 
            : item.type || ''}
        </Text>
        <View style={styles.animeStats}>
          {item.score && (
            <View style={styles.statContainer}>
              <Ionicons name="star" size={14} color="#ffd700" />
              <Text style={styles.statText}>{item.score}</Text>
            </View>
          )}
          {item.episodes && (
            <View style={styles.statContainer}>
              <Ionicons name="tv-outline" size={14} color="#a0a0cc" />
              <Text style={styles.statText}>{item.episodes} eps</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Search: "{query}"
        </Text>
      </View>
      
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderAnimeItem}
          keyExtractor={(item) => item.mal_id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#8b93a8" />
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listContent: {
    padding: 15,
  },
  animeItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#2d325a',
    borderRadius: 10,
    overflow: 'hidden',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animeSubtitle: {
    color: '#a0a0cc',
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
    color: '#d0d0e0',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#8b93a8',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchResultsScreen;