import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image,Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logo from '../assets/logo.png'; 
import { useSelector,useDispatch } from 'react-redux';
import { useNavigation,useRoute } from '@react-navigation/native';
import { updateResponse2,clearResponse2 } from '../store/features/Test/TestSlice';
import { updateResponse,clearResponse } from '../store/features/Test/SubmitSlice';
import { reviewResponse2 } from '../store/features/Test/TestSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../ApiCall';


const TestView = () => {
  const route = useRoute();
  // const {questionsData}= route.params;
  const {classId} = route.params;
  const {testId} = route.params;
  const dispatch = useDispatch();
  const questionData = useSelector((state)=> state.TestingQuestionForm?.questions.questionData)
  const responseData = useSelector((state)=> state.submitSlice.responses);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  console.log("responseData",responseData);
  console.log("Question Data: ",questionData[currentQuestionIndex].response[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const [questions,setQuestions]= useState(questionData)
  const [attempted, setAttempted] = useState(0);
  const [unattempted, setUnattempted] = useState(questions.length);
  const [toReview, setToReview] = useState(0);
  const [timer, setTimer] = useState(10800); // 3 hours in seconds
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOptionSelect = (optionIndex) => {
    console.log("I am inside function, questions[currentQuestionIndex].response", questionData[currentQuestionIndex]);
    const updatedQuestions = [...questionData];
    const currentQuestion = updatedQuestions[currentQuestionIndex];

    if (currentQuestion.response[0].response === -1 ) {
      setAttempted(attempted + 1);
      setUnattempted(unattempted - 1);
    }

    console.log("Updating response");
    console.log("Current Question Index:", currentQuestionIndex);
    dispatch(updateResponse2({currentQuestionIndex,optionIndex}));
    console.log("Response2 is updated Successfully!");

    setQuestions(updatedQuestions);
    dispatch(updateResponse({questionId:currentQuestion._id,selectedOption:optionIndex}))

  };
  
  const handleClearResponse = () => {
      const updatedQuestions = [...questionData];
      const currentQuestion = updatedQuestions[currentQuestionIndex];
      console.log("currentQuestion.response[0]: ",currentQuestion.response[0]);
  
      if (currentQuestion.response[0].response !== -1) {
        setAttempted(attempted - 1);
        setUnattempted(unattempted + 1);
        currentQuestion.response = [];
      }

      
    console.log("Updating response");
    console.log("Current Question Index:", currentQuestionIndex);
    dispatch(clearResponse2({questionIndex:currentQuestionIndex}));
    console.log("clearResponse2 is updated Successfully!");
  
    setQuestions(updatedQuestions);
    dispatch(clearResponse({questionId:currentQuestion._id}))

  };


const handleMarkForReview = () => {
  const updatedQuestions = [...questionData];
  const currentQuestion = updatedQuestions[currentQuestionIndex];
  dispatch(reviewResponse2({questionIndex:currentQuestionIndex}));
};



  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} hr ${m < 10 ? '0' : ''}${m} mins ${s < 10 ? '0' : ''}${s} sec`;
  };

  const handleSubmit = async () => {
    console.log('Submitting Test Response:', responseData);
    const token = await AsyncStorage.getItem('accessToken');
    console.log('token ', token);
    const draft = 'draft';
    try {
      // const response = await api.post(`/home/${classId}/test/${testId}/submit/${draft}`, {
      //   answers: responseData
      // });
      const response = await api.post(`/home/${classId}/test/${testId}/submit`, {
        answers: responseData
      });

      setModalVisible(false);
      console.log("Response: ", response.data.message);
      Alert.alert("Successfully Submitted", response.data.message);
      navigation.goBack();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('You already gave the test');
        navigation.goBack();
      } else {
        console.error("Error: ", error);
      }
    }

  };




  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={{ backgroundColor: `#BFDEFE`, justifyContent: `center`, paddingLeft: 5, marginBottom: 10 }}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Header */}
      <View style={{ backgroundColor: `#BFDEFE`, borderRadius: 10, marginBottom: 10 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Sample Test 1</Text>
          <View style={styles.timerContainer}>
            <Icon name="alarm" size={20} color="black" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statsText}>Questions: {questions.length}</Text>
          <Text style={styles.statsText}>Attempted: {attempted}</Text>
          <Text style={styles.statsText}>Unattempted: {unattempted}</Text>
          <Text style={styles.statsText}>To be Reviewed: {toReview}</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>
          Q{currentQuestionIndex+1}: {questions[currentQuestionIndex].content}
        </Text>


        <FlatList
          data={questions[currentQuestionIndex].options}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionSelect(index)}
            >
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  questionData[currentQuestionIndex].response[0].response === index && styles.radioButtonSelected,
                ]} />
                <Text style={{ color: `black`,fontSize:13 }}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        
        <View style={{justifyContent:`center`,alignItems:`center`}}>
        {questionData[currentQuestionIndex]?.image && (
          <Image source={{ uri: `https://uniqus-backend.vercel.app/${questionData[currentQuestionIndex].image.data}` }} style={styles.questionImage} />
        )}
        </View>

        
        <View style={styles.navigation}>
  
    <TouchableOpacity 
      style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]} 
      onPress={handlePrevious}
      disabled={currentQuestionIndex === 0}
    >
      <Text style={styles.navButtonText}>Previous</Text>
    </TouchableOpacity>

  <TouchableOpacity 
    style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]} 
    onPress={handleNext}
    disabled={currentQuestionIndex === questions.length - 1}
  >
    <Text style={styles.navButtonText}>Next</Text>
  </TouchableOpacity>
</View>

      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={handleClearResponse}>
          <Text style={styles.buttonText}>Clear Response</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleMarkForReview}>
          <Text style={styles.buttonText}>
            {questionData[currentQuestionIndex].response[0].review ? 'Unmark from Review' : 'Mark for Review'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() =>  setModalVisible(true)}>
          <Text style={styles.submitButtonText}>Submit Test</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && 
      <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Submission</Text>
          <Text style={styles.modalMessage}>Are you sure you want to submit your response?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonxGreen} onPress={handleSubmit}>
              <Text style={styles.buttonText1}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonx} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText1}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  buttonxGreen:{
    backgroundColor:`#5ce65c`,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:30,
    paddingRight:30,
    borderRadius:10
  },
  buttonx:{
    backgroundColor:`red`,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:30,
    paddingRight:30,
    borderRadius:10
  },
  buttonText1:{
    fontSize:20,
    fontWeight:`bold`,
    color:`#333333`
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background with opacity for better contrast
  },
  modalContainer: {
    width: '85%', // Responsive width
    padding: 30,
    borderRadius: 15,
    backgroundColor: 'white', // Solid white background
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Dark color for title
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555', // Slightly lighter color for message
    marginBottom: 20,
    textAlign: 'center', // Center align text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF', // A vibrant blue color for buttons
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: 5, // Space between buttons
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

    disabledButton: {
        opacity: 0.0,  
      },
  logo: {
    width: 100,
    height: 30,
    alignSelf: 'left',
    marginBottom: 10,
    marginTop: 10,
  },
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 5,
    marginBottom: 20, 
  },
  title: { 
    fontSize: 16, 
    color: 'black',
    marginBottom: 10, 
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: `white`,
    borderRadius: 10,
  },
  timerText: { color: 'black' },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statsText: { fontSize: 12, color: `black` },
  questionContainer: {
    flex:0.9,
    backgroundColor: '#BBDEFB',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    color: `black`,
    position:`relative`
    
  },
  question: { fontSize: 14, marginBottom: 10, color: `black` },
  questionImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 60,
  },
  option: {
    padding:8,
    borderRadius: 5,
    marginBottom: 1,
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    color:`black`,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    padding:5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:`white`,
  },
  radioButtonSelected: {
    padding:5,
    backgroundColor: `#3B82F6`,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    position:`absolute`,
    bottom:0,
    left:10,
    right:10
  },
  navButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    width: '48%',
    
  },
  navButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize:13,
  },

  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // margin:`auto`,
    position:`absolute`,
    bottom:0,
    alignItems:`center`,
    left:0,
    right:0,
    padding:10,
    backgroundColor:`#BFDEFE`,
    borderRadius:10,
  },
  button: {
    // padding:20,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    // padding:12,
    width: '32%',
    alignItems: 'center',
    justifyContent:`center`
  },
  buttonText: {
    fontSize:12,
    color: 'black',
  },

  submitButton: {
    backgroundColor: '#0E682C',
  },
  submitButtonText: {
    color: 'white',
  },
});

export default TestView;