// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Modal, 
//   TextInput,
//   Button,
//   RefreshControl
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useState,useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigation,useFocusEffect } from '@react-navigation/native';
// import axios from 'axios';
// import { useDispatch } from 'react-redux'; 
// import { setUserData } from '../store/features/user/userSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import api from '../ApiCall';
// import AntDesign from 'react-native-vector-icons/AntDesign';


// const UserProfile = () => {
//   const user = useSelector((state) => state.user);
//   const [expandedClassId, setExpandedClassId] = useState(null);
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();

//   const [refreshing, setRefreshing] = useState(false);



//   const [modalVisible, setModalVisible] = useState(false);
//   const [classroomLink, setClassroomLink] = useState('');

//   const handleJoinClassroom = () => {
//     setModalVisible(true); 
//   };

//   const [visibleClasses, setVisibleClasses] = useState({});
//   const toggleChapterList = (classID) => {
//     setVisibleClasses((prevVisibleClasses) => ({
//       ...prevVisibleClasses,
//       [classID]: !prevVisibleClasses[classID],
//     }));
//   };

//   const joinClassReq = async(classID)=>{
//     setIsLoading(true);
    
//     //get the token
//     const value = await AsyncStorage.getItem('accessToken');

//     try {
//           const response = await api.get(`/home/${classID}/joinclassroom`, {
//             headers: {
//               'authorization': `Bearer ${value}`,
//               'Content-Type': 'application/json'
//             }
//           });
//         console.log("response.data: ",response.data);
//     }
//     catch(error){
//       console.log("Error while joinng class: ",error);
//     }
    
//     try {
//       console.log("Working on second API");
//       const response = await api.get('/home/getUserData', {
//         headers: {
//           'authorization': `Bearer ${value}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log("Response.data: -> ",response.data);

//     const { token, user, classArray } = response.data;

//     // Prepare user data to dispatch or use in your application state
//     const userData = {
//       _id: user._id,
//       email: user.email,
//       userRole: user.userRole,
//       name: user.name,
//       joinRequests: user.joinReqs || [], // Default to an empty array if undefined
//       classRoomsArray: classArray, // Get the classrooms array from the response
//       refreshToken: user.refreshToken,
//       token: token,
//     };

//       // Set user data in Redux state
//       dispatch(setUserData(userData));
//       console.log("Success")

//     } catch (error) {
//       // console.error(error);
//       // Alert.alert('Error while Joining ClassRoom');
//     } finally {
//       setIsLoading(false);
//     }

//   }


//   useFocusEffect(
//     useCallback(() => {
//       onRefresh();  // Re-fetch data or rerender when the screen is focused
//     }, [])
//   );


//     // Function to handle pull-to-refresh action
//     const onRefresh = async() => {
//       // setRefreshing(true); // Show loader
//       const value = await AsyncStorage.getItem('accessToken');
//       console.log("value: ",value);
//       setTimeout(async () => {
//         // This is where you can call your API and dispatch the refreshed data
//     try {
//       console.log("Working on second API");
//       const response = await api.get('/home/getUserData', {
//         headers: {
//           'authorization': `Bearer ${value}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log("Response.data: -> ",response.data);

//     const { token, user, classArray } = response.data;

//     // Prepare user data to dispatch or use in your application state
//     const userData = {
//       _id: user._id,
//       email: user.email,
//       userRole: user.userRole,
//       name: user.name,
//       joinRequests: user.joinReqs || [], // Default to an empty array if undefined
//       classRoomsArray: classArray, // Get the classrooms array from the response
//       refreshToken: user.refreshToken,
//       token: token,
//     };

//       // Set user data in Redux state
//       dispatch(setUserData(userData));
//       console.log("Success")

//     } catch (error) {
//       // console.error(error);
//       // Alert.alert('Error while Joining ClassRoom');
//     } finally {
//       setIsLoading(false);
//     }
//         // For now, it's a placeholder
//         console.log("Refreshing data...");
        
//         setRefreshing(false); // Hide loader after 2-3 seconds
//       }, 2000);  // Loader visible for 2 seconds
//     };

// function countNotesPerClass(classItem) {
//   let totalNotes = 0;
  
//   if (classItem.chapters) {
//     classItem.chapters.forEach((chapter) => {
//       if (chapter.resources && chapter.resources.notes) {
//         totalNotes += chapter.resources.notes.length; 
//       }
//     });
//   }

//   return totalNotes; 
// }

// function countTestPerClass(classItem) {
//   let totalTests = 0;
  
//   if (classItem.chapters) {
//     classItem.chapters.forEach((chapter) => {
//       if (chapter.resources && chapter.resources.tests) {
//         totalTests += chapter.resources.tests.length; 
//       }
//     });
//   }

//   return totalTests; 
// }

// const subjectIcons = {
//   Maths: { name: 'square-root-alt', library: 'FontAwesome5' },
//   Physics: { name: 'flask', library: 'FontAwesome5' },
//   Chemistry: { name: 'book-open', library: 'MaterialCommunityIcons' },
//   English: { name: 'book', library: 'MaterialCommunityIcons' }, 
//   Biology: { name: 'leaf', library: 'MaterialCommunityIcons' },
//   'Data structures and algo': { name: 'database', library: 'MaterialCommunityIcons' },
//   'NSC': { name: 'school', library: 'MaterialCommunityIcons' },
//   'Data structures': { name: 'code', library: 'FontAwesome5' },
//   Programming: { name: 'laptop-code', library: 'FontAwesome5' },
// };

// const getSubjectIcon = (subject) => {
//   console.log("Subject: ", subject);
//   const iconData = subjectIcons[subject];

//   if (!iconData) {
//     return <MaterialCommunityIcons name="book" size={50} color="grey" />;
//   }

//   switch (iconData.library) {
//     case 'FontAwesome5':
//       return <FontAwesome5 name={iconData.name} size={50} color="#333333" />;
//     case 'MaterialCommunityIcons':
//       return <MaterialCommunityIcons name={iconData.name} size={50} color="#333333" />;
//     case 'Ionicons':
//       return <Ionicons name={iconData.name} size={50} color="#333333" />;
//     default:
//       return <MaterialCommunityIcons name="book" size={50} color="#333333" />; // Default icon for unsupported libraries
//   }
// };



// return (
//   <View style={styles.container}>
//     <View style={styles.header}>
//       <View style={styles.logoContainer}>
//         <Text style={styles.logo}>US</Text>
//       </View>
//       <View style={styles.greetingContainer}>
//         <Text style={styles.greeting}>
//           Hi {user.name} <MaterialCommunityIcons name="hand-wave" size={24} color="yellow" /> 
//         </Text>
//         <Text style={styles.subGreeting}>How are you doing today?</Text>
//       </View>
//     </View>

//     <View style={styles.content}>
//       <View style={styles.classHeader}>
//         <Text style={styles.classTitle}>My Classes</Text>
//         <TouchableOpacity style={styles.joinButton} onPress={handleJoinClassroom}>
//           <Text style={styles.joinButtonText}>Join Classroom</Text>
//         </TouchableOpacity>
//       </View>

       
//       <ScrollView
//       showsHorizontalScrollIndicator={false}
//       showsVerticalScrollIndicator={false}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}   // <-- State to show loader
//           onRefresh={onRefresh}     // <-- Triggered when user pulls down
//           colors={['#2596be']}      // Loader color
//           tintColor="#2596be"
//         />
//       }
//     >
//       <>
//     {Array.isArray(user.classRoomsArray) && user.classRoomsArray.length > 0 ? (
//       user.classRoomsArray.map((classItem) => (
//         <View key={classItem.classID} style={styles.classContainer}>
//           <TouchableOpacity
//             style={styles.classTitleContainer}
//             onPress={() => toggleChapterList(classItem.classID)} // Toggle visibility on press
//           >

//             <View>

//               <View style={{width:`100%`,flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom: visibleClasses[classItem.classID] ? 0 : 15}}>

//                 <Text style={styles.className}>{classItem.title}</Text>


//                 <View style={{flexDirection:`row`}}>
//                 <View>{!visibleClasses[classItem.classID] && (
//                     <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
//                       <MaterialIcons name="supervised-user-circle" size={19} color="#000" />
//                       <Text style={{ color: 'grey', fontSize: 12 }}>{classItem.members}</Text>
//                     </View>
//                   )}</View>
//                 <View>
//                 <MaterialIcons
//                   name={visibleClasses[classItem.classID] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//                   size={24}
//                   color="grey"
//                 />
//               </View>
//                 </View>
//               </View>

//               <View style={{width:`100%`,flexDirection:`row`,justifyContent:`space-between`}}>
//                 <View style={{ justifyContent: 'center', alignItems: 'center',width:`auto`,marginLeft:5 }}>
//                 {!visibleClasses[classItem.classID] && (
//                   <Text>{getSubjectIcon(classItem.subject)}</Text>
//                 )}
//                 </View>

//                 <View>
//                 {!visibleClasses[classItem.classID] && (
//                   <View style={{ flexDirection: 'row', gap: 5,justifyContent:`space-between`,width:`70%`,height:`auto`,marginTop:5 }}>

//                     <View>
//                       <View style={{ flexDirection: 'row', gap: 5,marginBottom:5 }}>
//                         <MaterialCommunityIcons name="note" size={19} color="#333333" />
//                         <Text style={{ color: 'gray', fontSize: 12 }}>{countNotesPerClass(classItem)} Notes</Text>
//                       </View>

                      
//                       <View style={{ flexDirection: 'row', gap: 5 }}>
//                       <MaterialCommunityIcons name="clipboard-check" size={19} color="green" />
//                       <Text style={{ color: 'gray', fontSize: 12 }}>{countTestPerClass(classItem)} Tests</Text>
//                     </View>
                    
//                     </View>

//                     <View style={{ flexDirection: 'row', gap: 5 ,marginLeft:5}}>
//                         <MaterialCommunityIcons name="book-open" size={19} color="#000" />
//                         <Text style={{ color: 'gray', fontSize: 12 }}>{classItem.chapters ? `${classItem.chapters.length} Chapters` : '0 Chapter '}</Text>
//                       </View>

                    

                    
//                   </View>
//                 )}
//                 </View>

//               </View>

//             </View>

//             {/* THIS IS ICON */}
//             {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//               {!visibleClasses[classItem.classID] && (
//                 <Text>{getSubjectIcon(classItem.subject)}</Text>
//               )}
//             </View> */}



//           </TouchableOpacity>



//           {/* Show chapters only for the expanded class */}
//           {visibleClasses[classItem.classID] && classItem.chapters && classItem.chapters.length > 0 && (
//             classItem.chapters.map((chapter, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.chapterItem}
//                 onPress={() =>
//                 {
//                   if(chapter.resources){
//                     navigation.navigate("ClassRoom", {
//                       classId: classItem.classID,
//                       chapterId: chapter.id,
//                       chapterName: chapter.title,
//                       resourcesx1: chapter.resources,
//                     })

//                   }
//                 }
//                 }
//               >
//                 <View style={styles.chapterIcon}>
//                   <Ionicons name={chapter.icon || 'book-outline'} size={24} color="#2596be" />
//                 </View>
//                 <Text style={styles.chapterTitle}>{chapter.title}</Text>
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       ))
//     ) : (
//       <Text>No classrooms available.</Text>
//     )}
//   </>
//     </ScrollView>
//     </View>

//     {modalVisible && 
//   <Modal
//     animationType="fade"
//     transparent={true}
//     visible={modalVisible}
//     onRequestClose={() => setModalVisible(false)}
//   >
//     <View style={styles.modalContainer}>
//       <View style={styles.modalContent}>
//         <View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom:15}}>
//           <Text style={styles.modalHeading}>Join Classroom</Text>
//           <TouchableOpacity>
//             <AntDesign name='closecircleo' size={30} color="black" onPress={() => setModalVisible(false)}/>
//           </TouchableOpacity>
//         </View>

//         <View style={{paddingLeft:15,paddingRight:15,paddingTop:5}}>
//           <Text style={styles.modalSubHeading}>Paste Classroom Link</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Paste link here..."
//             value={classroomLink}
//             onChangeText={setClassroomLink}
//             placeholderTextColor="#999"
//           />
//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={styles.submitButton} onPress={() => {
//               console.log("classroom Link: ",classroomLink);
//               Alert.alert('Classroom link submitted:', classroomLink);
//               const classID = classroomLink.split("/home/")[1];
//               if (classID) {
//                 console.log("classId: ",classID);
//               } else {
//                 console.log("Error");
//               }
//               //now i have to make the api call that will add the class id into my document
//               joinClassReq(classID);
//               setModalVisible(false); // Close the modal after submission
//               setClassroomLink("");

//             }}>
//               <Text style={styles.buttonText}>Paste Link</Text>
//             </TouchableOpacity>
//             {/* <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//               <Text style={styles.buttonText}>Close</Text>
//             </TouchableOpacity> */}
//           </View>

//         </View>


//       </View>
//     </View>
//   </Modal>
// }

//   </View>


// );

// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker semi-transparent background
//   },
//   modalContent: {
//     width: '92%',
//     padding: 15,
//     paddingLeft: 15,
//     paddingRight: 15,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 15,
//   },
//   modalHeading: {
//     fontSize: 22,
//     // fontWeight: 'bold',
//     // color: '#2596be',
//     // marginBottom: 10,
//     // textAlign: 'center',
//     color:`black`
//   },
//   modalSubHeading: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//     marginLeft: 5,
//   },
//   input: {
//     width: '100%',
//     paddingVertical: 5, // Reduced vertical padding
//     paddingHorizontal: 10,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginBottom: 15,
//     fontSize: 14,
//     color: '#333',
//     backgroundColor: '#f9f9f9',
//     shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 3 },
//     // shadowOpacity: 0.1,
//     // shadowRadius: 5,
//     // elevation: 2,
//   },
//   buttonRow: {
//     // flexDirection: 'row',
//     // justifyContent: 'space-between',
//     // width: '100%',
//     // gap: 15,
//     // backgroundColor:`red`
//   },
//   submitButton: {
//     backgroundColor: '#FF3D3D',
//     paddingVertical: 10, // Reduced padding for smaller button size
//     borderRadius: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//     // width: '48%', // Adjusted width to give buttons some space
//   },
//   closeButton: {
//     backgroundColor: '#ff4d4d',
//     paddingVertical: 10, // Reduced padding for smaller button size
//     borderRadius: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//     width: '48%', // Adjusted width to give buttons some space
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   container: { 
//     flex: 1,
//     backgroundColor: '#f0f4f8',
//   },
//   header: {
//     backgroundColor: '#2596be',
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomEndRadius: 25,
//     borderBottomStartRadius: 25,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   logoContainer: {
//     backgroundColor: 'white',
//     borderRadius: 25,
//     padding: 10,
//     marginRight: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   logo: {
//     color: '#02acee',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   greetingContainer: { 
//     flex: 1 
//   },
//   greeting: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   subGreeting: {
//     color: 'white',
//     fontSize: 14,
//   },
//   joinButton: {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     paddingVertical: 6,
//     paddingHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   joinButtonText: {
//     color: '#2596be',
//     fontWeight: 'bold',
//   },
//   content: { 
//     flex: 1, 
//     // padding: 20 
//     paddingTop:20,
//     paddingLeft:20,
//     paddingRight:20,
//     paddingBottom:5
//   },
//   classHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   classTitle: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     color: 'black' 
//   },
//   classCount: { 
//     fontSize: 16, 
//     color: '#666' 
//   },
//   classContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     paddingLeft: 15,
//     paddingRight: 15,
//     padding:10,
//     marginBottom: 20,
//     // shadowColor: '#000',
//     borderColor:`grey`,
//     // borderBottomWidth:1,
//     // borderBottomEndRadius:1,
//     // borderBottomStartRadius:1
//   },
//   classTitleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     height:`auto`
//     // padding:4
//   },
//   className: { 
//     fontSize: 18, 
//     fontWeight: 'bold',
//     color:`gray`,
//     textTransform:`uppercase`
//   },
//   chapterItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   chapterIcon: { 
//     marginRight: 10 
//   },
//   chapterTitle: { 
//     fontSize: 16, 
//     color: '#333' 
//   },
// });


// export default UserProfile;


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal, 
  TextInput,
  Button,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState,useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { setUserData } from '../store/features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import api from '../ApiCall';
import AntDesign from 'react-native-vector-icons/AntDesign';


const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const [expandedClassId, setExpandedClassId] = useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);



  const [modalVisible, setModalVisible] = useState(false);
  const [classroomLink, setClassroomLink] = useState('');

  const handleJoinClassroom = () => {
    setModalVisible(true); 
  };

  const [visibleClasses, setVisibleClasses] = useState({});
  const toggleChapterList = (classID) => {
    setVisibleClasses((prevVisibleClasses) => ({
      ...prevVisibleClasses,
      [classID]: !prevVisibleClasses[classID],
    }));
  };

  const joinClassReq = async(classID)=>{
    setIsLoading(true);
    
    //get the token
    const value = await AsyncStorage.getItem('accessToken');

    try {
          const response = await api.get(`/home/${classID}/joinclassroom`, {
            headers: {
              'authorization': `Bearer ${value}`,
              'Content-Type': 'application/json'
            }
          });
        console.log("response.data: ",response.data);
    }
    catch(error){
      console.log("Error while joinng class: ",error);
    }
    
    try {
      console.log("Working on second API");
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
      // console.error(error);
      // Alert.alert('Error while Joining ClassRoom');
    } finally {
      setIsLoading(false);
    }

  }


  useFocusEffect(
    useCallback(() => {
      onRefresh();  // Re-fetch data or rerender when the screen is focused
    }, [])
  );


    // Function to handle pull-to-refresh action
    const onRefresh = async() => {
      // setRefreshing(true); // Show loader
      const value = await AsyncStorage.getItem('accessToken');
      console.log("value: ",value);
      setTimeout(async () => {
        // This is where you can call your API and dispatch the refreshed data
    try {
      console.log("Working on second API");
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
      // console.error(error);
      // Alert.alert('Error while Joining ClassRoom');
    } finally {
      setIsLoading(false);
    }
        // For now, it's a placeholder
        console.log("Refreshing data...");
        
        setRefreshing(false); // Hide loader after 2-3 seconds
      }, 2000);  // Loader visible for 2 seconds
    };

function countNotesPerClass(classItem) {
  let totalNotes = 0;
  
  if (classItem.chapters) {
    classItem.chapters.forEach((chapter) => {
      if (chapter.resources && chapter.resources.notes) {
        totalNotes += chapter.resources.notes.length; 
      }
    });
  }

  return totalNotes; 
}

function countTestPerClass(classItem) {
  let totalTests = 0;
  
  if (classItem.chapters) {
    classItem.chapters.forEach((chapter) => {
      if (chapter.resources && chapter.resources.tests) {
        totalTests += chapter.resources.tests.length; 
      }
    });
  }

  return totalTests; 
}

const subjectIcons = {
  Maths: { name: 'square-root-alt', library: 'FontAwesome5' },
  Physics: { name: 'flask', library: 'FontAwesome5' },
  Chemistry: { name: 'book-open', library: 'MaterialCommunityIcons' },
  English: { name: 'book', library: 'MaterialCommunityIcons' }, 
  Biology: { name: 'leaf', library: 'MaterialCommunityIcons' },
  'Data structures and algo': { name: 'database', library: 'MaterialCommunityIcons' },
  'NSC': { name: 'school', library: 'MaterialCommunityIcons' },
  'Data structures': { name: 'code', library: 'FontAwesome5' },
  Programming: { name: 'laptop-code', library: 'FontAwesome5' },
};

const getSubjectIcon = (subject) => {
  console.log("Subject: ", subject);
  const iconData = subjectIcons[subject];

  if (!iconData) {
    return <MaterialCommunityIcons name="book" size={50} color="grey" />;
  }

  switch (iconData.library) {
    case 'FontAwesome5':
      return <FontAwesome5 name={iconData.name} size={50} color="#333333" />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconData.name} size={50} color="#333333" />;
    case 'Ionicons':
      return <Ionicons name={iconData.name} size={50} color="#333333" />;
    default:
      return <MaterialCommunityIcons name="book" size={50} color="#333333" />; // Default icon for unsupported libraries
  }
};



return (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>US</Text>
      </View>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          Hi {user.name} <MaterialCommunityIcons name="hand-wave" size={24} color="yellow" /> 
        </Text>
        <Text style={styles.subGreeting}>How are you doing today?</Text>
      </View>
    </View>

    <View style={styles.content}>
      <View style={styles.classHeader}>
        <Text style={styles.classTitle}>My Classes</Text>
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinClassroom}>
          <Text style={styles.joinButtonText}>Join Classroom</Text>
        </TouchableOpacity>
      </View>

       
      <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}   // <-- State to show loader
          onRefresh={onRefresh}     // <-- Triggered when user pulls down
          colors={['#2596be']}      // Loader color
          tintColor="#2596be"
        />
      }
    >
      <>
    {Array.isArray(user.classRoomsArray) && user.classRoomsArray.length > 0 ? (
      user.classRoomsArray.map((classItem) => (
        <View key={classItem.classID} style={styles.classContainer}>
          <TouchableOpacity
            style={styles.classTitleContainer}
            onPress={() => toggleChapterList(classItem.classID)} // Toggle visibility on press
          >

            <View>

              <View style={{width:`100%`,flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom: visibleClasses[classItem.classID] ? 0 : 15}}>

                <Text style={styles.className}>{classItem.title}</Text>


                <View style={{flexDirection:`row`,alignItems:`center`,justifyContent:`center`}}>
                <View style={{marginRight:8}}>{!visibleClasses[classItem.classID] && (
                    <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
                      <MaterialIcons name="supervised-user-circle" size={19} color="#000" />
                      <Text style={{ color: 'grey', fontSize: 12 }}>{classItem.members}</Text>
                    </View>
                  )}</View>
                <View>
                <MaterialIcons
                  name={visibleClasses[classItem.classID] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={24}
                  color="grey"
                />
              </View>
                </View>
              </View>

              <View style={{width:`100%`,flexDirection:`row`,justifyContent:`space-between`,}}>
                <View style={{ justifyContent: 'center', alignItems: 'center',width:`auto`,marginLeft:5 }}>
                {!visibleClasses[classItem.classID] && (
                  <Text>{getSubjectIcon(classItem.subject)}</Text>
                )}
                </View>

                <View>
  {!visibleClasses[classItem.classID] && (
    <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'space-between', width: '70%', height: 'auto', marginTop: 5 }}>
      
      <View>
        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 5,justifyContent:`center`,alignItems:`center` }}>
          {/* Transparent, outline-style icon */}
          <MaterialCommunityIcons name="note-outline" size={19} color="grey" />
          <Text style={{ color: 'black', fontSize: 12 }}>{countNotesPerClass(classItem)} Notes</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 5,justifyContent:`center`,alignItems:`center`}}>
          {/* Transparent, outline-style icon */}
          <MaterialCommunityIcons name="clipboard-check-outline" size={19} color="grey" />
          <Text style={{ color: 'black', fontSize: 12 }}>{countTestPerClass(classItem)} Tests</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 5, marginLeft: 25 ,justifyContent:`center`}}>
        {/* Transparent, outline-style icon */}
        <MaterialCommunityIcons name="book-open-outline" size={19} color="grey" />
        <Text style={{ color: 'black', fontSize: 12 }}>{classItem.chapters ? `${classItem.chapters.length} Chapters` : '0 Chapter'}</Text>
      </View>
    </View>
  )}
</View>

              </View>

            </View>

            {/* THIS IS ICON */}
            {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {!visibleClasses[classItem.classID] && (
                <Text>{getSubjectIcon(classItem.subject)}</Text>
              )}
            </View> */}



          </TouchableOpacity>



          {/* Show chapters only for the expanded class */}
          {visibleClasses[classItem.classID] && classItem.chapters && classItem.chapters.length > 0 && (
            classItem.chapters.map((chapter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chapterItem}
                onPress={() =>
                {
                  if(chapter.resources){
                    navigation.navigate("ClassRoom", {
                      classId: classItem.classID,
                      chapterId: chapter.id,
                      chapterName: chapter.title,
                      resourcesx1: chapter.resources,
                    })

                  }
                }
                }
              >
                <View style={styles.chapterIcon}>
                  <Ionicons name={chapter.icon || 'book-outline'} size={24} color="#2596be" />
                </View>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      ))
    ) : (
      <Text>No classrooms available.</Text>
    )}
  </>
    </ScrollView>
    </View>

    {modalVisible && 
  <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom:15}}>
          <Text style={styles.modalHeading}>Join Classroom</Text>
          <TouchableOpacity>
            <AntDesign name='closecircleo' size={30} color="black" onPress={() => setModalVisible(false)}/>
          </TouchableOpacity>
        </View>

        <View style={{paddingLeft:15,paddingRight:15,paddingTop:5}}>
          <Text style={styles.modalSubHeading}>Paste Classroom Link</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste link here..."
            value={classroomLink}
            onChangeText={setClassroomLink}
            placeholderTextColor="#999"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.submitButton} onPress={() => {
              console.log("classroom Link: ",classroomLink);
              Alert.alert('Classroom link submitted:', classroomLink);
              const classID = classroomLink.split("/home/")[1];
              if (classID) {
                console.log("classId: ",classID);
              } else {
                console.log("Error");
              }
              //now i have to make the api call that will add the class id into my document
              joinClassReq(classID);
              setModalVisible(false); // Close the modal after submission
              setClassroomLink("");

            }}>
              <Text style={styles.buttonText}>Paste Link</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity> */}
          </View>

        </View>


      </View>
    </View>
  </Modal>
}

  </View>


);

};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker semi-transparent background
  },
  modalContent: {
    width: '92%',
    padding: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeading: {
    fontSize: 22,
    // fontWeight: 'bold',
    // color: '#2596be',
    // marginBottom: 10,
    // textAlign: 'center',
    color:`black`
  },
  modalSubHeading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    paddingVertical: 5, // Reduced vertical padding
    paddingHorizontal: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 2,
  },
  buttonRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
    // gap: 15,
    // backgroundColor:`red`
  },
  submitButton: {
    backgroundColor: '#FF3D3D',
    paddingVertical: 10, // Reduced padding for smaller button size
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    // width: '48%', // Adjusted width to give buttons some space
  },
  closeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10, // Reduced padding for smaller button size
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    width: '48%', // Adjusted width to give buttons some space
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  container: { 
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#2596be',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    color: '#02acee',
    fontSize: 20,
    fontWeight: 'bold',
  },
  greetingContainer: { 
    flex: 1 
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: 'white',
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: '#2596be',
    fontWeight: 'bold',
  },
  content: { 
    flex: 1, 
    // padding: 20 
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20,
    paddingBottom:5
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  classTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'black' 
  },
  classCount: { 
    fontSize: 16, 
    color: '#666' 
  },
  classContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
    padding:10,
    marginBottom: 20,
    // shadowColor: '#000',
    borderColor:`grey`,
    // borderBottomWidth:1,
    // borderBottomEndRadius:1,
    // borderBottomStartRadius:1
  },
  classTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    height:`auto`
    // padding:4
  },
  className: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color:`#333333`,
    textTransform:`uppercase`
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  chapterIcon: { 
    marginRight: 10 
  },
  chapterTitle: { 
    fontSize: 16, 
    color: '#333' 
  },
});


export default UserProfile;
