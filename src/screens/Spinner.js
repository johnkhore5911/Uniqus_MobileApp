import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Spinner = () => {
  return (
    <View style={styles.container}>
      <Text><ActivityIndicator size="large" color="gray" /></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Optional: semi-transparent background
  },
});

export default Spinner;
