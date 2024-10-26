import React, { useState, useEffect, useRef } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Keyboard } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux'; 
import { setUserData } from '../store/features/user/userSlice';
import api from '../ApiCall';

import { WebView } from 'react-native-webview';


const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();  // Hook to check if the screen is focused
  const dispatch = useDispatch();

  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const translateLogoY = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(height * 0.65)).current; // Start container from lower

  useEffect(() => {
    if (isFocused) {
      resetAnimations();
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isFocused]);

  const resetAnimations = () => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.spring(translateLogoY, {
        toValue: -50, 
        useNativeDriver: true,
      }),
      Animated.spring(slideY, {
        toValue: height * 0.001, 
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleKeyboardShow = () => {
    Animated.parallel([
      Animated.spring(translateLogoY, {
        toValue: -180, 
        useNativeDriver: true,
      }),
      Animated.spring(slideY, {
        toValue: height * 0.05, 
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleKeyboardHide = () => {
    Animated.parallel([
      Animated.spring(translateLogoY, {
        toValue: 0, 
        useNativeDriver: true,
      }),
      Animated.spring(slideY, {
        toValue: height * 0.001,
        useNativeDriver: true,
      }),
    ]).start();
  };

  
  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      // const response = await axios.post('http://192.168.18.210:5001/api/auth/login', {
      //   email: name,
      //   password: password,
      // });
      const response = await api.post('/api/auth/login', {
        email: name,
        password: password,
      },{
        withCredentials: true // This ensures cookies are included in the response if they're set by the server
      });
      setName("");
      setPassword("");


    // Log the response to check headers
    console.log('Response headers:', response.headers);

      console.log("Response.data: -> ",response.data);

      // Assuming the API responds with user data and token

    // Destructure the response to get the user and token
    const { token, user, classArray } = response.data;

    // Log the user and token for debugging
    console.log("user: ", user);
    console.log("token: ", token);
    console.log("classArray: ",classArray)

    await AsyncStorage.setItem('accessToken', response.data.token);
    await AsyncStorage.setItem('refreshToken', response.data.user.refreshToken);

    // Prepare user data to dispatch or use in your application state
    const userData = {
      _id: user._id,
      email: user.email,
      userRole: user.userRole,
      name: user.name,
      joinRequests: user.joinReqs || [], // Default to an empty array if undefined
      classRoomsArray: classArray || [], // Get the classrooms array from the response
      refreshToken: user.refreshToken,
      token: token,
    };


    

      // Set user data in Redux state
      dispatch(setUserData(userData));

      console.log("Trting to get cookie");
      

      // const cookies = await CookieManager.get('https://uniqus-backend.vercel.app');
      // console.log('Cookies:', cookies);

      // Access specific cookie
      // const jwt = cookies.jwt; // Assuming 'jwt' is the name of your cookie
      // console.log('JWT Token:', jwt);


      //actaull cookie
      // const cookie = cookies.jwt.value;
      // console.log("Actual Cookie: ",cookie);

      // Store the JWT cookie from the 'set-cookie' header in AsyncStorage
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        // Extract the actual cookie value from the set-cookie string
        const cookie = setCookieHeader[0].split(';')[0];  // Extract the "jwt=..." part
        console.log("Cookie extracted:", cookie);
      
        // Store the cookie in AsyncStorage
        await AsyncStorage.setItem('cookie', cookie);
        console.log('Cookie stored in AsyncStorage');
      } else {
        console.log('No set-cookie header found.');
      }





      alert(`Welcome, ${user.name || name}!`);

      navigation.navigate("MainApp");

  
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleBlur = () => {
    Animated.parallel([
      Animated.spring(translateLogoY, {
        toValue: 0, 
        useNativeDriver: true,
      }),
      Animated.spring(slideY, {
        toValue: height * 0.35, 
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: translateLogoY }] }]}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
        />
      </Animated.View>

      {/* Slideable Login Form */}
      <Animated.View
        style={[styles.innerContainer, { transform: [{ translateY: slideY }] }]}
      >
        <Text style={styles.titleText}>Login</Text>

        <Text style={styles.subtitleText}>Sign in to continue.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          onBlur={handleBlur} 
          onFocus={handleKeyboardShow} 
          placeholderTextColor="gray"
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          onBlur={handleBlur} 
          onFocus={handleKeyboardShow} 
          placeholderTextColor="gray"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Log in'}</Text>
        </TouchableOpacity>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText} onPress={() => navigation.navigate("ForgotPassword")}>Forgot Password?</Text>
          <Text style={styles.footerText} onPress={() => navigation.navigate("SignUp")}>Signup</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
  },
  logoContainer: {
    position: 'absolute', 
    top: 200, 
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  label: {
    width: '100%',
    fontSize: 12,
    color: 'gray',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    color: 'black',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
});

export default LoginScreen;
