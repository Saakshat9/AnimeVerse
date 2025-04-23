// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { useAuth } from '@context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  withDelay,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const glowOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const underlineWidth = useSharedValue(0);
  const underlineOpacity = useSharedValue(0);

  // Character animation values
  const characters = "AnimeVerse".split("");
  const characterValues = characters.map(() => ({
    translateY: useSharedValue(0),
    opacity: useSharedValue(0),
    scale: useSharedValue(0.5),
  }));

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 800 }),
      withTiming(1, { duration: 500 })
    );

    // Character animations (staggered)
    characterValues.forEach((char, index) => {
      char.opacity.value = withDelay(
        400 + index * 100,
        withTiming(1, { duration: 800 })
      );
      char.translateY.value = withDelay(
        400 + index * 100,
        withSequence(
          withTiming(-10, { duration: 400 }),
          withTiming(0, { duration: 400 })
        )
      );
      char.scale.value = withDelay(
        400 + index * 100,
        withTiming(1, { duration: 800 })
      );
    });

    // Underline animation
    underlineOpacity.value = withDelay(
      1600,
      withTiming(1, { duration: 400 })
    );
    underlineWidth.value = withDelay(
      1600,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );

    // Form animations
    formOpacity.value = withDelay(
      1800,
      withTiming(1, { duration: 800 })
    );
    formTranslateY.value = withDelay(
      1800,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.back) })
    );

    // Glow animation
    glowOpacity.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500 }),
          withTiming(0.2, { duration: 1500 })
        ),
        -1,
        true
      )
    );

    // Button pulse animation
    buttonScale.value = withDelay(
      2500,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }]
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }]
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  const underlineAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${underlineWidth.value * 100}%`,
      opacity: underlineOpacity.value,
    };
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@gmail\.com$/i;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid Gmail address (@gmail.com)');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by the navigator based on auth state
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background elements */}
      <LinearGradient
        colors={['#151a35', '#1e2246', '#2a3166']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(94, 114, 228, 0)', 'rgba(94, 114, 228, 0.3)', 'rgba(94, 114, 228, 0)']}
          style={styles.glow}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo Container */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoTextContainer}>
            {characters.map((char, index) => {
              const charStyle = useAnimatedStyle(() => {
                return {
                  opacity: characterValues[index].opacity.value,
                  transform: [
                    { translateY: characterValues[index].translateY.value },
                    { scale: characterValues[index].scale.value }
                  ]
                };
              });
              
              return (
                <Animated.Text key={index} style={[styles.logoCharacter, charStyle]}>
                  {char}
                </Animated.Text>
              );
            })}
          </View>
          
          {/* Animated Underline */}
          <Animated.View style={[styles.underline, underlineAnimatedStyle]} />
        </Animated.View>
        
        {/* Form Container */}
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <BlurView intensity={20} style={styles.formBlur} tint="dark">
            <View style={styles.formInner}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8b93a8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8b93a8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#5e72e4', '#7b8ef9']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>LOGIN</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              <TouchableOpacity 
                style={styles.signupLink}
                onPress={() => navigation.navigate('Signup')}
                activeOpacity={0.7}
              >
                <Text style={styles.signupText}>
                  Need an account? <Text style={styles.signupHighlight}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  glowContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    height: 120,
  },
  glow: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 60,
  },
  logoTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoCharacter: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(94, 114, 228, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  underline: {
    height: 4,
    backgroundColor: '#5e72e4',
    borderRadius: 2,
    marginTop: 5,
    shadowColor: '#5e72e4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  formBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  formInner: {
    backgroundColor: 'rgba(30, 34, 70, 0.4)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    height: 55,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  loginButton: {
    borderRadius: 12,
    height: 55,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: '#5e72e4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#8b93a8',
    fontSize: 16,
  },
  signupHighlight: {
    color: '#5e72e4',
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#8b93a8',
    fontSize: 14,
  }
});

export default LoginScreen;