// src/screens/ProfileScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  Animated,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext'; // Import the universal theme hook

const { width } = Dimensions.get('window');
const BADGE_SIZE = 30;

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [userLevel, setUserLevel] = useState(1);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  
  // Use the universal theme context
  const { isDarkMode, themeStyles, toggleTheme } = useTheme();
  
  const [badges, setBadges] = useState([
    { 
      id: 1, 
      name: 'trophy', 
      color: '#FFD700', 
      earned: true, 
      title: 'First Anime',
      description: 'Started watching your first anime series'
    },
    { 
      id: 2, 
      name: 'fire', 
      color: '#FF4500', 
      earned: true, 
      title: 'Binge Master',
      description: 'Watched more than 10 episodes in a single day'
    },
    { 
      id: 3, 
      name: 'star', 
      color: '#1E90FF', 
      earned: true, 
      title: 'Critic',
      description: 'Left reviews for 5 different anime shows'
    },
    { 
      id: 4, 
      name: 'medal', 
      color: '#9370DB', 
      earned: false, 
      title: 'Genre Explorer',
      description: 'Watch anime from at least 5 different genres'
    },
    { 
      id: 5, 
      name: 'crown', 
      color: '#FF1493', 
      earned: false, 
      title: 'Anime Royalty',
      description: 'Complete 25 anime series'
    },
  ]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const avatarRotate = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    const loadProfileData = async () => {
      try {
        // Load profile image
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
        
        // Get watchlist count
        const watchlistData = await AsyncStorage.getItem('watchlist');
        if (watchlistData) {
          const watchlist = JSON.parse(watchlistData);
          setWatchlistCount(watchlist.length);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
    
    // Refresh watchlist count when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadWatchlistCount();
    });
    
    return unsubscribe;
  }, [navigation]);
  
  const loadWatchlistCount = async () => {
    try {
      const watchlistData = await AsyncStorage.getItem('watchlist');
      if (watchlistData) {
        const watchlist = JSON.parse(watchlistData);
        setWatchlistCount(watchlist.length);
      } else {
        setWatchlistCount(0);
      }
    } catch (error) {
      console.error('Error loading watchlist count:', error);
    }
  };

  const rotateAvatar = () => {
    Animated.timing(avatarRotate, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      avatarRotate.setValue(0);
    });
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to grant gallery permissions to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        rotateAvatar();
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout, Just Yet 🥹?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => logout(),
        style: 'destructive',
      },
    ]);
  };

  const spin = avatarRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleToggleTheme = async (value) => {
    // Add a little bounce animation when toggling
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Use the universal theme toggle
    toggleTheme();
  };
  
  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  const renderBadgeModal = () => {
    if (!selectedBadge) return null;
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={badgeModalVisible}
        onRequestClose={() => setBadgeModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setBadgeModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            <View style={[styles.badgeIconLarge, { backgroundColor: selectedBadge.earned ? selectedBadge.color : '#3e4481' }]}>
              <FontAwesome5 
                name={selectedBadge.name} 
                size={30} 
                color={selectedBadge.earned ? 'white' : 'rgba(255,255,255,0.5)'} 
              />
            </View>
            <Text style={[styles.badgeTitle, { color: themeStyles.textColor }]}>{selectedBadge.title}</Text>
            <Text style={[styles.badgeDescription, { color: themeStyles.subTextColor }]}>{selectedBadge.description}</Text>
            {!selectedBadge.earned && (
              <Text style={styles.badgeLocked}>🔒 Not yet earned</Text>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setBadgeModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderBadges = () => {
    return badges.map((badge) => (
      <TouchableOpacity 
        key={`badge-${badge.id}`}
        style={[
          styles.badge, 
          {backgroundColor: badge.earned ? badge.color : '#3e4481'},
          badge.earned ? styles.earnedBadge : styles.unearnedBadge
        ]}
        onPress={() => handleBadgePress(badge)}
        activeOpacity={0.7}
      >
        <FontAwesome5 
          name={badge.name} 
          size={16} 
          color={badge.earned ? 'white' : 'rgba(255,255,255,0.5)'} 
        />
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={themeStyles.gradientColors}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>My Profile</Text>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.profileSection,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <LinearGradient
                    colors={['#5e72e4', '#825ee4']}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </Text>
                  </LinearGradient>
                )}
              </Animated.View>
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={14} color="#ffffff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {userLevel}</Text>
            </View>
            
            <Text style={[styles.userName, { color: themeStyles.textColor }]}>{user?.name || 'Anime Master'}</Text>
            <Text style={[styles.userEmail, { color: themeStyles.subTextColor }]}>{user?.email || 'user@example.com'}</Text>
            
            <View style={styles.badgesContainer}>
              {renderBadges()}
            </View>
            
            <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? 'rgba(94, 114, 228, 0.15)' : 'rgba(94, 114, 228, 0.1)' }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: themeStyles.textColor }]}>02</Text>
                <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Watched</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: themeStyles.borderColor }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: themeStyles.textColor }]}>{watchlistCount}</Text>
                <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Watchlist</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: themeStyles.borderColor }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: themeStyles.textColor }]}>01</Text>
                <Text style={[styles.statLabel, { color: themeStyles.subTextColor }]}>Completed</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.card, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                }) }],
                backgroundColor: themeStyles.cardBackground,
                shadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.1)',
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Ionicons name="notifications-outline" size={22} color={themeStyles.iconColor} />
                <Text style={[styles.settingText, { color: themeStyles.textColor }]}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#d1d1d6", true: "#5e72e4" }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={[styles.settingDivider, { backgroundColor: themeStyles.borderColor }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Ionicons name="moon-outline" size={22} color={themeStyles.iconColor} />
                <Text style={[styles.settingText, { color: themeStyles.textColor }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleTheme}
                trackColor={{ false: "#d1d1d6", true: "#5e72e4" }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={[styles.settingDivider, { backgroundColor: themeStyles.borderColor }]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('Watchlist')}
            >
              <View style={styles.settingTextContainer}>
                <Ionicons name="list-outline" size={22} color={themeStyles.iconColor} />
                <Text style={[styles.settingText, { color: themeStyles.textColor }]}>My Watchlist</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={themeStyles.iconColor} />
            </TouchableOpacity>
            
            <View style={[styles.settingDivider, { backgroundColor: themeStyles.borderColor }]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.settingTextContainer}>
                <Ionicons name="information-circle-outline" size={22} color={themeStyles.iconColor} />
                <Text style={[styles.settingText, { color: themeStyles.textColor }]}>About</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={themeStyles.iconColor} />
            </TouchableOpacity>
            
            <View style={[styles.settingDivider, { backgroundColor: themeStyles.borderColor }]} />
            
            <TouchableOpacity 
              style={[styles.logoutButton]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#FF375F" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
      {renderBadgeModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5e72e4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    top: 0,
    right: width / 2 - 80,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  earnedBadge: {
    opacity: 1,
  },
  unearnedBadge: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  settingDivider: {
    height: 1,
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF375F',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeIconLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  badgeLocked: {
    fontSize: 14,
    color: '#FF375F',
    marginBottom: 16,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#5e72e4',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ProfileScreen;