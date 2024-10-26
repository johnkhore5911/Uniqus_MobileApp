import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity,SafeAreaView, FlatList, StyleSheet, Image, Dimensions,Modal,Pressable,Alert } from 'react-native';
import Tests from './Tests'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation,useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import {
  _setTitle,
  _setSubject,
  _setCreatedBy,
  _setCreatedAt,
  _setResources,
  _setCurriculumStructure,
} from '../store/features/classroom/classroomSlice.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Spinner from './Spinner';
const screenWidth = Dimensions.get('window').width;
import logo from '../assets/logo.png';
import Octicons from 'react-native-vector-icons/Octicons';
import api from '../ApiCall.js';


const BASE_URL = 'https://sms-xkxd.onrender.com/';

const ClassRoom = () => {
  const [activeTab, setActiveTab] = useState('Notes');
  const route = useRoute();
  const { chapterId } = route.params;
  const {classId} = route.params;
  const {resourcesx1} =route.params;
  const {chapterName} = route.params;
  console.log("Resourcesx1: ",resourcesx1)
  console.log("ChapterId: ",chapterId)
  console.log("classId: ",classId)
  const dispatch = useDispatch();
  const classRoomData = useSelector((state) => state.classroom);
  console.log("ClassRoom DATA",classRoomData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [resourcesVideos,setResourcesVideos]=useState(resourcesx1.videos[0]);
  console.log("resourcesVideos: ",resourcesVideos);

  const myEvents = [
    { id: '3', title: 'Event 3', description: 'Description of event 3', imageUrl: 'https://via.placeholder.com/100' },
  ];
  
  
  const Accordion = ({ description }) => {
    console.log("Desc in accordion: ",description);
    
    const [isExpanded, setIsExpanded] = useState(false);
    const wordLimit = 15;
  
    const words = description?.trim().split(/\s+/).length;
    const shouldShowToggle = words > wordLimit;
  
    return (
      <View style={styles.accordion} >
        <Text numberOfLines={isExpanded ? undefined : 2} style={styles.descriptionText}>
          {description}
        </Text>
        {shouldShowToggle && (
          <Text style={styles.toggleText} onPress={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show Less" : "Show More"}
          </Text>
        )}
      </View>
    );
  };
  


  // const EventCard = ({ event }) => {
  //   const navigation = useNavigation(); 
    
  //   const handleVideoNavigation = () => {
  //     if (resourcesVideos?.youtubeVideoId) {
  //       navigation.navigate('VideoPlayer', { videoId: resourcesVideos?.youtubeVideoId, isYouTube: true });
  //     } else if (resourcesVideos?.filePath) {
  //       const fullPath = `https://uniqus-backend.vercel.app/${resourcesVideos?.filePath.replace(/\\/g, '/')}`;
  //       console.log("FullPath: ",fullPath);
  //       navigation.navigate('VideoPlayer', { videoUrl: fullPath, isYouTube: false });
  //     }
  //   };
  
  //   return (
  //     {
  //       resourcesVideos.title ?
  //     (
  //       <TouchableOpacity style={resourcesVideos?.title && styles.cardContainer} onPress={handleVideoNavigation}>
  //       {resourcesVideos?.title && <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />}
  //       {resourcesVideos?.title && (
  //         <View style={styles.textContainer}>
  //           <Text style={styles.title}>{resourcesVideos?.title}</Text>
  //           <Text style={styles.description}>{resourcesVideos?.desc}</Text>
  //         </View>
  //       )}
  //     </TouchableOpacity>
  //     )
  //     :
  //     (
  //       <View>
  //       <Text>No Leturre available</Text>
  //       </View>
  //     )
  //     }
  //   );
  // };
  

  const EventCard = ({ event }) => {
    const navigation = useNavigation(); 
    
    const handleVideoNavigation = () => {
      console.log("I am clicked!!");
      const  resourcesVideos  = event; // Make sure resourcesVideos is defined
      console.log("resourcesVideos i got is this -> ",resourcesVideos);
      if (resourcesVideos?.youtubeVideoId) {
        navigation.navigate('VideoPlayer', { videoId: resourcesVideos.youtubeVideoId, isYouTube: true });
      } else if (resourcesVideos?.filePath) {
        const fullPath = `https://uniqus-backend.vercel.app/${resourcesVideos.filePath.replace(/\\/g, '/')}`;
        console.log("FullPath: ", fullPath);
        navigation.navigate('VideoPlayer', { videoUrl: fullPath, isYouTube: false });
      }

    };
  
    // Use a single return statement with conditional rendering
    return event ? (
      <TouchableOpacity style={styles.cardContainer} onPress={handleVideoNavigation}>
        {resourcesVideos?.title && <Image source={{ uri: `https://img.youtube.com/vi/${resourcesVideos.youtubeVideoId}/hqdefault.jpg` }} style={styles.eventImage} />}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{resourcesVideos.title}</Text>
          <Text style={styles.description}>{resourcesVideos.desc}</Text>
        </View>
      </TouchableOpacity>
    ) : 
    (
      <View style={{padding:4}}>
        <Text style={{padding:8,fontWeight:`500`,color:`gray`,fontSize:14}}>No Lecture available</Text>
      </View>
    );
  };
  

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile();
      } else {
        console.log('Storage permission denied');
        Alert.alert('Permission Denied', 'Storage permission is required to download the file.');
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const downloadFile = () => {
    console.log("`${BASE_URL}${selectedFile}`: ",`${BASE_URL}${selectedFile}`);
    setLoading(true); // Show the spinner
    const { config, fs } = RNFetchBlob;
    const date = new Date();
    const fileDir = fs.dirs.DownloadDir;
    const filePath = `${fileDir}/circuit_diagram_${Math.floor(date.getTime() / 1000)}.pdf`;

    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'PDF file download',
      },
    })
      .fetch('GET', `${BASE_URL}${selectedFile}`)
      .then(res => {
        console.log('The file saved to: ', res.path());
        setLoading(false); // Hide the spinner
        Alert.alert('Download Complete', `Check Recent Downloads`);
      })
      .catch(error => {
        setLoading(false); // Hide the spinner in case of error
        console.error('Error downloading PDF:', error);
        Alert.alert('Error', 'Failed to download the PDF.');
      });
      
  };

  const [resourcesVideos1, setResourcesVideos1] = useState(resourcesx1.videos || []);

  // Function to render the appropriate content based on the selected tab
  const renderContent = () => {
    const navigation = useNavigation();
    switch (activeTab) {
      case 'Lectures':
        return resourcesVideos1.length > 0 ? (
          <FlatList
            data={resourcesVideos1}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EventCard event={item} />}
          />
        ) : (
          <View style={{padding:4}}>
          <Text style={{padding:8,fontWeight:`500`,color:`gray`,fontSize:14}}>No Lectures available</Text>
        </View>
        );
        case 'Tests':
          return resourcesx1.tests?.length > 0 ? (
            <Tests resourcesx1={resourcesx1} classId={classId} chapterId={chapterId} />
          ) : (
            <View style={{padding:4}}>
            <Text style={{padding:8,fontWeight:`500`,color:`gray`,fontSize:14}}>No Tests available</Text>
          </View>
          );
        case 'Notes':
      default:
        return resourcesx1.notes?.length > 0 ? 
        (
          
            <View style={newStyles.container}>
            <FlatList
              data={resourcesx1.notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={newStyles.cardContainer}>
                  <Image
                    source={require('../assets/pdfImg.jpg')} // Assuming you have a PDF image asset
                    style={newStyles.pdfThumbnail}
                  />
                  <View style={newStyles.cardContent}>
                    <View>
                        <View style={{flexDirection:`row`,justifyContent:`space-between`,marginBottom:5}}>
                        <Text style={newStyles.titleText}>{item.title}</Text>
                         <TouchableOpacity onPress={() => {
                        setSelectedFile(item.filePath); // Set the selected file path
                        setModalVisible(true);
                        downloadFile();
                        }}>
                        <Icon name="ellipsis-vertical" size={16} color="#333" />
                        </TouchableOpacity>
                          </View>
                      {/* <Text style={newStyles.descriptionText}>{item.desc}</Text> */}
                      <Accordion description={item.desc} />
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        )
        :
        (
        <View style={{padding:4}}>
          <Text style={{padding:8,fontWeight:`500`,color:`gray`,fontSize:14}}>No Notes available</Text>
        </View>
        ) 
    }
  };

  const [classroomLink, setClassroomLink] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  
  const handleJoinClassroom = () => {
    console.log('Joining classroom with link:', classroomLink);
    setClassroomLink('');
    setModalVisible(false);
  };

  const handleLeaveClassroom = () => {
    console.log('Leaving classroom...');
    setLeaveModalVisible(false);
  };

  const PopoverMenu = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>

          <TouchableOpacity style={styles.menuItem} onPress={()=>{console.log(`Downloading... ,FilePath:${selectedFile}`)}}>
            <Icon name="download" size={20} color="#000" />
            <Text style={styles.menuText}>Download</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};


const LeaveClassroomModal = ({ visible, onClose, onLeave }) => {
  const navigation = useNavigation();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Exit Classroom</Text>

          <View style={{backgroundColor:`#FF3D3D`,textAlign:`center`,justifyContent:`center`,alignItems:`center`,paddingLeft:6,paddingRight:6,width:`100%`,borderRadius:5}}>
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <Octicons name="alert" size={60} color="white" />
          </View>

          {/* Warning Message */}
          <Text style={styles.warningText}>
            Leaving the classroom now will result in the loss of all your progress and you won't be able to access any of the classroom resources.
          </Text>
          </View>

          <Text style={styles.modalText}>
            Are you sure you want to leave the classroom?
          </Text>


          <View style={{flexDirection:`row`,alignItems:`center`}}>

            <TouchableOpacity onPress={onClose} style={{backgroundColor:`white`,paddingTop:5,paddingBottom:5,alignItems: 'center',borderColor:`#4ADE80`,borderWidth:2,width:`25%`,borderRadius:5}}>
              <Text style={{color:`black`}}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={async() => {
              try{
                console.log("classId: ",classId);
                const response = await api.get(`/home/${classId}/leaveclassroom`);
                if(response){
                  console.log("Success!");
                  navigation.navigate('Home');
                }
              }
              catch(error){
                console.error("Error while leaving class",error);
              }
            }}
            style={{marginLeft:20,backgroundColor:`#F87171`,paddingTop:7,paddingBottom:7,alignItems: 'center',width:`50%`,borderRadius:5}}>
              <Text style={{color: 'white',fontWeight:`bold`}}>Leave Classroom</Text>
            </TouchableOpacity>

          </View>

          {/* <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={async() => {
                try{
                  console.log("classId: ",classId);
                  const response = await api.get(`/home/${classId}/leaveclassroom`);
                  if(response){
                    console.log("Success!");
                    navigation.navigate('Home');
                  }
                }
                catch(error){
                  console.error("Error while leaving class",error);
                }
              }}
            >
              <Text style={styles.confirmButtonText}>Leave classroom</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </Pressable>
    </Modal>
  );
};

const [matchingChapter,setMatchingChapter]= useState();

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={{backgroundColor:`#BFDEFE` ,justifyContent:`center`,paddingLeft:5,marginBottom:10}}> */}
      {/* </View> */}
      <View style={{backgroundColor:`#BFDEFE`,marginBottom:8}}>
        <Image source={logo} style={styles.logo} /> 
      </View>


      {/* Header */}
      <View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom:5,padding:2}}>
      <View style={{width:`86%`}}><Text style={styles.header}>{chapterName}</Text></View>
      <TouchableOpacity onPress={() => setLeaveModalVisible(true)} style={{marginRight:15,marginBottom:5}}>
        <Ionicons name="exit" size={25} color="#7C0A02" />
      </TouchableOpacity>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Notes')} style={styles.tabButtonContainer}>
          <Text style={[styles.tabButton, activeTab === 'Notes' && styles.activeTab]}>Notes</Text>
          {activeTab === 'Notes' && <View style={styles.indicatorBar} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Lectures')} style={styles.tabButtonContainer}>
          <Text style={[styles.tabButton, activeTab === 'Lectures' && styles.activeTab]}>Lectures</Text>
          {activeTab === 'Lectures' && <View style={styles.indicatorBar} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Tests')} style={styles.tabButtonContainer}>
          <Text style={[styles.tabButton, activeTab === 'Tests' && styles.activeTab]}>Tests</Text>
          {activeTab === 'Tests' && <View style={styles.indicatorBar} />}
        </TouchableOpacity>
      </View>


      {/* Event List */}
      <View style={styles.eventListContainer}>{renderContent()}</View>
      <PopoverMenu visible={modalVisible} onClose={() => setModalVisible(false)} />
      <LeaveClassroomModal visible={leaveModalVisible} onClose={() => setLeaveModalVisible(false)} />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  noteDescription: {
    fontSize: 14,
    color: '#666',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  

    buttonText: {
    textAlign:`center`,
    color:`white`,
    fontSize:16,
    fontWeight:`bold`
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
    modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  tabStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',  
  },
  activeTabStyle: {
    backgroundColor: 'red',  
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:`black`
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  joinButton: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor:`#DC2626`,
    // padding: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft:7,
    paddingRight:7,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 30,
    alignSelf: 'left', 
    marginBottom: 8,
    marginTop:8,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent:`center`,
    alignItems:`center`,
    marginRight:5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    // paddingHorizontal: 15,
    backgroundColor:`white`,
  },
  classTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  chapterContainer: {
    marginBottom: 20,
    backgroundColor: '#60AFFA',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
    chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  topicDetails: {
    flex: 1,
    marginLeft: 10,
  },
  topicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  pdfIcon: {
    // width: 75,
    // height: 35,
    // resizeMode: 'center',
    width: 85,
    height: 85,
    // resizeMode: 'center',
    // backgroundColor:red
  },
  accordion: {
    marginTop: 10,
    width: '100%',
  
  },
  descriptionText: {
    marginTop:-6,
    fontSize: 12,
    color: '#555',
  },
  toggleText: {
    color: 'grey',
    marginTop: 5,
    textDecorationLine: 'underline',
    fontSize:12
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    width: '95%',
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign:`left`
  },
  iconContainer: {
    marginVertical: 20,
  },
  warningText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight:`500`,
  },
  modalText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'left',
    marginBottom: 14,
    marginTop:20
  },
  modalButtons: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    width: '100%',
    flexDirection:`row`
  },
  confirmButton: {
    backgroundColor: '#F87171',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'white',
    // paddingVertical: 12,
    // paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
    justifyContent:`center`,
    borderColor:`#4ADE80`,
    width:`40%`,
    borderWidth:2,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '400',
  },
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // modalContent: {
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  //   width: '80%',
  // },
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  //   color:`black`
  // },
  // modalText: {
  //   marginBottom: 20,
  //   color:`gray`
  // },
  // modalButtons: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // confirmButton: {
  //   backgroundColor: '#FF3D3D',
  //   padding: 10,
  //   borderRadius: 5,
  //   flex: 1,
  //   marginRight: 5,
  // },
  // cancelButton: {
  //   backgroundColor: '#4CAF50',
  //   padding: 10,
  //   borderRadius: 5,
  //   flex: 1,
  //   marginLeft: 5,
  // },

    chapterContainer: {
    marginBottom: 20,
    backgroundColor: '#60AFFA',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },

    contentContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent:`center`,
    alignItems:`center`,
    marginRight:5,
  },
  
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    // marginBottom: 10,
    color:`black`,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tabButtonContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor:`white`
  },
  tabButton: {
    fontSize: 14,
    color: '#888',
    paddingVertical: 5,
  },
  activeTab: {
    color: '#000',
    fontWeight: 'bold',
  },
  indicatorBar: {
    width: '85%',
    height: 3,
    backgroundColor: '#000',
    marginTop: 4,
    borderRadius: 2,
  },
  eventListContainer: {
    flex: 1,
    // paddingHorizontal: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    // borderRadius:5
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color:`black`,
    fontWeight: '500',
  },
  description: {
    marginTop:3,
    fontSize: 12,
    color: '#666',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  testPosted:{
    flexDirection:`row`,
    gap:10
  },

});


const newStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 3,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pdfThumbnail: {
    width: 60,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // headerRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    // marginTop: 6,
    // backgroundColor:`red`
  },
});


export default ClassRoom;
