import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import Announcements from './Announcements';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';  
import LikeScreen from './LikeScreen';      

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          // backgroundColor: '#f8f8f8',
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: 'grey',
          borderWidth: 2,
          borderRadius: 35,
          // borderTopEndRadius: 8,
          // borderTopStartRadius: 8,
          borderBottomEndRadius:8,
          borderBottomStartRadius:8,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, color: '#2596be' },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconColor = focused ? '#2596be' : 'gray';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'download' : 'download-outline';
              break;
            case 'Like':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            case 'Announcements':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person-circle' : 'person-circle-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName} size={24} color={iconColor} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarLabel: 'Download',
        }}
      />
      <Tab.Screen 
        name="Like" 
        component={LikeScreen} 
        options={{
          tabBarLabel: 'Compass',
        }}
      />
      <Tab.Screen 
        name="Announcements" 
        component={Announcements}
        options={{
          tabBarLabel: 'Announcements',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
