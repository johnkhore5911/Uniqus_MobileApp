import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingBottomNavBar = ({ state, descriptors, navigation }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <View style={styles.navBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = route.name === 'Home' ? 'home-outline' :
                         route.name === 'Announcements' ? 'book-outline' :
                         route.name === 'Profile' ? 'person-outline' : 'settings-outline';

        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View style={animatedStyle}>
              <Icon name={iconName} size={28} color={isFocused ? "#4776D3" : "#ffffff"} />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,  // Adjusted to reduce the height from the bottom
    left: 15,    // Reduced padding
    right: 15,   // Reduced padding
    backgroundColor: '#1a1a1a',
    borderRadius: 30,  // Reduced border radius
    height: 55,  // Reduced height of the nav bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Adjusted for a subtler shadow
    shadowOpacity: 0.25,  // Lowered shadow opacity
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,  // Reduced padding for a more compact design
  },
});

export default FloatingBottomNavBar;
