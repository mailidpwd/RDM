import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BottomNavigationBar({ navigation, currentRoute, isVisible = true }) {
  const [activeTab, setActiveTab] = useState('Goals');
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Sync active tab based on current route OR navigation state
  React.useEffect(() => {
    const updateActiveTab = () => {
      // Try to get the current route from navigation state first
      const state = navigation.getState();
      const currentRouteName = state?.routes[state.index]?.name;
      
      const routeMap = {
        'Dashboard': 'Goals',
        'Transfer': 'Transfer',
        'Donate': 'Donate',
        'MedaaAI': 'MedaaAI',
      };
      
      // Use navigation state if available, otherwise fall back to prop
      const actualRoute = currentRouteName || currentRoute || 'Dashboard';
      const tabId = routeMap[actualRoute] || 'Goals';
      setActiveTab(tabId);
    };

    // Update immediately
    updateActiveTab();

    // Listen for navigation changes
    const unsubscribe = navigation.addListener('state', () => {
      updateActiveTab();
    });

    return unsubscribe;
  }, [currentRoute, navigation]);

  // Animate visibility changes
  useEffect(() => {
    if (isVisible) {
      // Slide up and fade in with bounce
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 200,
          friction: 15,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 180,
          friction: 12,
        }),
      ]).start();
    } else {
      // Slide down with fade and slight scale
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 120,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.9,
          useNativeDriver: true,
          tension: 200,
          friction: 15,
        }),
      ]).start();
    }
  }, [isVisible]);

  const menuItems = [
    { 
      id: 'Goals', 
      name: 'Goals', 
      icon: 'checkmark-circle',
      iconActive: 'checkmark-circle',
      activeColor: '#20C997',
      inactiveColor: '#B0B0B0',
      gradient: ['#20C997', '#17A085'],
      route: 'Dashboard' 
    },
    { 
      id: 'Transfer', 
      name: 'Transfer', 
      icon: 'swap-horizontal',
      iconActive: 'swap-horizontal',
      activeColor: '#3B82F6',
      inactiveColor: '#B0B0B0',
      gradient: ['#3B82F6', '#2563EB'],
      route: 'Transfer' 
    },
    { 
      id: 'Donate', 
      name: 'Donate', 
      icon: 'heart',
      iconActive: 'heart',
      activeColor: '#EC4899',
      inactiveColor: '#B0B0B0',
      gradient: ['#EC4899', '#DB2777'],
      route: 'Donate' 
    },
    { 
      id: 'MedaaAI', 
      name: 'Medaa AI', 
      icon: 'sparkles',
      iconActive: 'sparkles',
      activeColor: '#8B5CF6',
      inactiveColor: '#B0B0B0',
      gradient: ['#8B5CF6', '#7C3AED'],
      route: 'MedaaAI' 
    },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    if (navigation) {
      navigation.navigate(item.route);
    }
  };


  // Animated styles
  const animatedStyle = {
    transform: [
      { translateY: translateY },
      { scale: scale }
    ],
    opacity: opacity,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleNavigation(item)}
            activeOpacity={0.6}
          >
            <View style={styles.contentWrapper}>
              {isActive ? (
                <LinearGradient
                  colors={item.gradient}
                  style={styles.iconContainerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={item.iconActive}
                    size={26}
                    color="#FFF"
                  />
                </LinearGradient>
              ) : (
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color="#9CA3AF"
                  />
                </View>
              )}
              {isActive && (
                <LinearGradient
                  colors={item.gradient}
                  style={styles.activeBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.badgeText}>{item.name}</Text>
                </LinearGradient>
              )}
              {!isActive && (
                <Text style={styles.menuTextInactive}>
                  {item.name}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  menuItem: {
    alignItems: 'center',
    flex: 1,
  },
  contentWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerGradient: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  menuTextInactive: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
});
