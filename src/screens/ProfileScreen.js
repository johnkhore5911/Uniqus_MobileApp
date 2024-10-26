// import React from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useSelector } from 'react-redux';


// const ProfileScreen = () => {
//   const user = useSelector((state) => state.user); // Retrieve user data from Redux
//   console.log("user: ",user);

//   const navigation=useNavigation();


//   return (
//     <View style={styles.container}>
//       <View style={styles.profileHeader}>
//         <Image source={{ uri: user.avatar }} style={styles.avatar} />
//         <Text style={styles.name}>{user.name}</Text>
//         <Text style={styles.email}>{user.email}</Text>
//         <Text style={styles.joinedDate}>{user.joinedDate}</Text>
//       </View>

//       <View style={styles.section}>
//         {/* <Text style={styles.sectionTitle}>Courses Completed</Text> */}
//         {/* <Text style={styles.sectionContent}>{user.coursesCompleted}</Text> */}
//       </View>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Edit Profile</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={()=>navigation.navigate("Login")}>
//         <Text style={styles.buttonText}>Log Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f8ff', 
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 15,
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#4682b4', 
//     marginBottom: 5,
//   },
//   email: {
//     fontSize: 16,
//     color: '#333', 
//     marginBottom: 5,
//   },
//   joinedDate: {
//     fontSize: 14,
//     color: '#888', 
//   },
//   section: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4682b4', 
//     marginBottom: 10,
//   },
//   sectionContent: {
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     padding: 15,
//     backgroundColor: '#4682b4', 
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#fff', 
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     backgroundColor: '#ff6347',
//   },
// });

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const user = useSelector((state) => state.user); // Retrieve user data from Redux
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.joinedDate}>Joined on {user.joinedDate}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#4682b4', // Border color for the avatar
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682b4',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  joinedDate: {
    fontSize: 14,
    color: '#888',
  },
  classroomsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4682b4',
    marginBottom: 10,
  },
  classroomCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  classroomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682b4',
  },
  classroomInfo: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    padding: 15,
    backgroundColor: '#4682b4',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff6347',
  },
});
