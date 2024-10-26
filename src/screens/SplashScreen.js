
import React, { useEffect, useRef,useState } from 'react';
import { View, StyleSheet, Animated,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'; 
import { setUserData } from '../store/features/user/userSlice';
import api from '../ApiCall';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(0.5)).current; 

  const user = useSelector((state) => state.user); // Retrieve user data from Redux
  const dispatch = useDispatch();

  useEffect(() => {
    // Start the animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true
        })
      ]),
      Animated.delay(500) 
    ]).start(() => {
      // Check AsyncStorage after the animation completes
      getData();
    });
  }, [fadeAnim, scaleAnim]);

  const getData = async () => {
    console.log("Getting Data")
    try {
      const value = await AsyncStorage.getItem('accessToken');
      console.log("This is access token: ",value);

      if(value){
        try {
          const response = await api.get('/home/getUserData', {
            headers: {
              'authorization': `Bearer ${value}`,
              'Content-Type': 'application/json'
            }
          });
          console.log("Response.data: -> ",response.data);
    
        const { token, user, classArray } = response.data;

        // Prepare user data to dispatch or use in your application state
        const userData = {
          _id: user._id,
          email: user.email,
          userRole: user.userRole,
          name: user.name,
          joinRequests: user.joinReqs || [], // Default to an empty array if undefined
          classRoomsArray: classArray, // Get the classrooms array from the response
          refreshToken: user.refreshToken,
          token: token,
        };
    
          // Set user data in Redux state
          dispatch(setUserData(userData));
          console.log("Success")

          
      
        } catch (error) {
          console.error(error);
          Alert.alert('Error while Joining ClassRoom');
        } 
        finally {
          // setIsLoading(false);
          navigation.replace('MainApp');
          console.log('Retrieved value:', value);
        }

      }

      // if (value) {
        // navigation.replace('MainApp');
        // console.log('Retrieved value:', value);
      // }
       else {
        navigation.replace('Login');
      }
    } catch (e) {
      navigation.replace('Login');
      console.error('Error retrieving data:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')} 
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 1, 
    resizeMode: 'contain',
  }
});

export default SplashScreen;
