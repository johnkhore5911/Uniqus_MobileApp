import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, PanResponder, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('student'); // Default userRole
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation();
  const [innerContainerHeight, setInnerContainerHeight] = useState(height * 0.72);

  const slideY = useRef(new Animated.Value(height * 0.65)).current;
  const translateLogoY = useRef(new Animated.Value(-25)).current;

  useEffect(() => {
    Animated.timing(slideY, {
      toValue: height * 0.0001,  
      duration: 1000,           
      useNativeDriver: true,
    }).start();

    Animated.timing(translateLogoY, {
      toValue: -210,           
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy < 0) { 
          slideY.setValue(height * 0.35 + gestureState.dy); 
          translateLogoY.setValue(gestureState.dy * 0.5); 
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < -100) { 
          Animated.timing(slideY, {
            toValue: 0, 
            duration: 300, 
            useNativeDriver: true,
          }).start();
          Animated.timing(translateLogoY, {
            toValue: -100, 
            duration: 300, 
            useNativeDriver: true,
          }).start();
        } else {
          Animated.parallel([
            Animated.spring(slideY, {
              toValue: height * 0.35,
              useNativeDriver: true,
            }),
            Animated.spring(translateLogoY, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleGetOtp = () => {
    if (!email) {
      alert('Email is required to get OTP.');
      return;
    }

    
    setIsLoading(true);
    // setInnerContainerHeight(height * 0.85);
    // Send POST request to verify email
    fetch('https://uniqus-backend.vercel.app/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false);
      if (data.success) {
        setOtpSent(true);
        alert('OTP sent to your email!');
        setInnerContainerHeight(height * 0.85);
      } else {
        alert(data.message || 'Failed to send OTP.');
      }
    })
    .catch(error => {
      setIsLoading(false);
      alert('Error sending OTP. Please try again.');
    });
  };

  const handleSignUp = () => {
    if (!firstName || !lastName || !email || !password || !otp) {
      alert('All fields are required.');
      return;
    }

    setIsLoading(true);
    // Send POST request to register the user
    fetch('https://uniqus-backend.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        userRole,
        password,
        otp,
      }),
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false);
      if (data.message) {
        alert(`Welcome, ${firstName}!`);
        navigation.navigate("Login");
      } else {
        console.log(data);
        alert(data.message || 'Registration failed.');
      }
    })
    .catch(error => {
      setIsLoading(false);
      alert('Error during registration. Please try again.');
    });
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

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.innerContainer, { transform: [{ translateY: slideY }] , height:innerContainerHeight  }]}>
        <Text style={styles.titleText}>Sign Up</Text>

        <Text style={styles.label}>FIRST NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="none"
        />

        <Text style={styles.label}>LAST NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="none"
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {otpSent && (
          <>
            <Text style={styles.label}>OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
          </>
        )}

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={otpSent ? handleSignUp : handleGetOtp} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? (otpSent ? 'Signing up...' : 'Sending OTP...') : (otpSent ? 'Sign Up' : 'Get OTP')}</Text>
        </TouchableOpacity>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText} onPress={() => navigation.navigate("Login")}>Already have an account? Login</Text>
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
    top: 250, 
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
    // height: height * 0.85, 
    // height: height * innerContainerHeight, 
    // innerContainerHeight
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
  label: {
    width: '100%',
    fontSize: 12,
    color: '#666',
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
    marginTop: 20,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
});

export default SignUpScreen
