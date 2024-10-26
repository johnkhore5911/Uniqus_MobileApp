import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'
const tamaguiConfig = createTamagui(config)
type Conf = typeof tamaguiConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'
import Announcements from './src/screens/Announcements'
import ProfileScreen from './src/screens/ProfileScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import classRoom from './src/screens/ClassRoom'
import SignUpScreen from './src/screens/SignUpScreen'
import ForgotPassword from './src/screens/ForgotPassword'
import Instructions from './src/screens/Instructions'
import TestView from './src/screens/TestView'
import FloatingBottomNavBar from './src/screens/FloatingBottomNavBar'
import BottomTabs from './src/screens/BottomTabs'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store'; 
import VideoPlayer from './src/screens/VideoPlayer';
import ScoreCard from './src/screens/ScoreCard';

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <BottomTabs/>    
  );
}




const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={tamaguiConfig}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MainApp"
                component={MyTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ClassRoom"
                component={classRoom}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Instructions"
                component={Instructions}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TestView"
                component={TestView}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ScoreCard"
                component={ScoreCard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VideoPlayer"
                component={VideoPlayer}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}


