import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://uniqus-backend.vercel.app',
  // baseURL: 'http://192.168.18.210:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the access token in all requests
api.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle 403 errors (expired tokens)
api.interceptors.response.use(
  (response) => {
    return response;
  }, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Access token expired. Attempting to refresh...');
      const success = await refreshAccessToken();
      if (success) {
        // Retry the original request with the new token
        const newAccessToken = await AsyncStorage.getItem('accessToken');
        originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// Token refresh function
const refreshAccessToken = async () => {
  try {
    console.log("Requesting new access token...");
    const response = await axios.get('https://uniqus-backend.vercel.app/refresh', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      const newAccessToken = response.data.token;
      await AsyncStorage.setItem('accessToken', newAccessToken);
      console.log("New access token stored:", newAccessToken);
      return true;
    } else {
      const navigation = useNavigation();
      Alert.alert("Cookie Expires","Please Login again!");
      navigation.navigate("Login");
      
      console.error("Failed to refresh token:", response.data.message);
    }
  } catch (error) {
    const navigation = useNavigation();
    Alert.alert("Cookie Expires","Please Login again!");
    navigation.navigate("Login");
    console.error("Error refreshing access token:", error);
  }
  return false;
};


export default api;