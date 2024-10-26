import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import logo from '../assets/logo.png';
import { useFocusEffect,useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setQuestions } from '../store/features/Test/TestSlice';
import api from '../ApiCall';
import Spinner from './Spinner';
const { DateTime } = require('luxon');

const getCurrentDateTime = () => {
  const currentDate = new Date();
  const isoString = currentDate.toISOString();
  return isoString;
}

const calculateTimeRemaining = (currentDateTime, startDateTime) => {
  const CurrentDateTime = new Date(currentDateTime);
  const StartDateTime = new Date(startDateTime);
  // console.log(CurrentDateTime)
  // console.log(StartDateTime)
  const timeDifference = Math.max(StartDateTime - CurrentDateTime, 0);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(timeDifference / 3600000);
  const minutes = Math.floor((timeDifference % 3600000) / 60000);
  const seconds = Math.floor((timeDifference % 60000) / 1000);
  console.log()
  return { hours, minutes, seconds };
  
}


const Instructions = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { test,classId,testTitle,chapterId } = route.params;
  const dispatch = useDispatch();


  console.log("I am inside Instruction");
  console.log("----------------");
  console.log("ClassId: ",classId);
  console.log("TestId: ",test.testId);
  console.log("----------------");

  const [isChecked, setIsChecked] = useState(false);
  const [testData, setTestData] = useState(null);
  const [questions, setquestions] = useState();
  const [expired,setExpired] = useState(false);
  const [loader ,setLoader] = useState(true);


  //New added
  const [TestMetaData, setMetaData] = useState({});
  const [isScheduled, setIsScheduled] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [submitTime, setSubmitTime] = useState('');
  const [submitDate, setSubmitDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [startDateTime, setStartDateTime] = useState("");
  const [instructionsArray, setInstructionsArray] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


      // Example usage:
      const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
      const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(currentDateTime, startDateTime));
  
      useEffect(() => {
          // Update the current date time every second
          const intervalId = setInterval(() => {
              setCurrentDateTime(getCurrentDateTime());
          }, 1000);
  
          // Clear the interval when the component is unmounted
          return () => clearInterval(intervalId);
      }, []);
  
      useEffect(() => {
          // Recalculate time remaining whenever currentDateTime changes
          setTimeRemaining(calculateTimeRemaining(currentDateTime, startDateTime));
      }, [currentDateTime, startDateTime]);


  useEffect(() => {
    OnLoad();
  }, []);

  // Re-fetch data when the screen regains focus
  useFocusEffect(
    useCallback(() => {
      OnLoad();  // Re-fetch data or rerender when the screen is focused
    }, [])
  );

  
  const OnLoad = async () => {
    // getCurrentDateTime();
    setLoader(true);
    console.log("Loader is true");
    try {
      // Make both API calls in parallel using Promise.all
      const [response1, response2] = await Promise.all([
        api.get(`/home/${classId}/test/${test.testId}/testmetadata`),
        api.get(`/home/${classId}/test/${test.testId}`)
      ]);
    
      // Handle the response from the first API call (test metadata)
      console.log('Test metadata response:', response1.data);
      setTestData(response1.data); // Set the test metadata data
      if(response1){
        console.log("setIsSubmit: ",response1.data.startDate);
        setMetaData(response1.data)
        setIsScheduled(response1.data.isScheduled)
        setIsSubmit(response1.data.isSubmit)
        setSubmitTime(response1.data.submitTime)
        setSubmitDate(response1.data.submitDate)
        setStartDate(response1.data.startDate)
        setStartTime(response1.data.startTime)
        setDeadlineDate(response1.data.deadlineDate)
        setDeadlineTime(response1.data.deadlineTime)
        setDeadline(response1.data.deadline)
        setScheduledAt(response1.data.scheduledAt)
        setStartDateTime(response1.data.startDateTime)
        setInstructionsArray(response1.data.instruction)
        setDuration(response1.data.duration)
        setIsLoading(false)
      }

    
      // Handle the response from the second API call (questions)
      console.log('Questions response:', response2.data);
      dispatch(setQuestions(response2.data));
      console.log("setQuestions dispatched successfully");

      console.log(response1.error)

      setLoader(false);
      console.log("Loader is false");

    
    } catch (error) {
      console.log('Error while fetching data', error);
      if (error.response && error.response.status === 500) {
        setExpired(true);
        console.log('Test expired');
      } else {
        console.log('Error fetching test data');
      }
    }

  };


  const isDeadlineExpired = () => {
    if (deadlineDate === "") {
        // No deadline set, return false
        return false;

    } else {
        // Parse deadline string into a Date object
        const Deadline = new Date(deadline);
        const currentDate = new Date();
        return Deadline < currentDate;
    }
  };

  const isTestExpired = () => {
    if (!isScheduled) {
        return false;
    }
    else {
        // Parse the scheduled time into a Date object and calculate currentDateTime
        const scheduledTime = new Date(scheduledAt);
        const currentDate = new Date();

        // Calculate scheduledEndTime, after this time test will be closed
        // here galary window is 5 minutes, later ask teacher to set gallery window
        const scheduledEndTime = new Date(scheduledTime.getTime() + 5 * 60000); // 60000 ms = 1 minute
        return currentDate > scheduledEndTime;
    }
  };

  const isTestFinished = () => {
    if (!isScheduled) {
        return false;
    }
    else {
        // Parse the scheduled time into a Date object and calculate currentDateTime
        const scheduledTime = new Date(scheduledAt);
        const currentDate = new Date();

        // Calculate scheduledEndTime, after this time test will be closed
        // here galary window is 5 minutes, later ask teacher to set gallery window
        const scheduledEndTime = new Date(scheduledTime.getTime() + duration * 60000); // 60000 ms = 1 minute
        console.log("TestFinishTime: ", scheduledEndTime)
        return currentDate > scheduledEndTime;
    }
  };




  const InstructionText = ({ text }) => (
    <View style={styles.instructionRow}>
      <Text style={styles.dot}>•</Text>
      <Text style={styles.instructionText}>{text}</Text>
    </View>
  );




  return  loader ? (
    <View style={{flex:1}}>
      <View style={{ marginBottom: 60 }}>
      <View style={{ backgroundColor: '#BFDEFE', justifyContent: 'center', paddingLeft: 5, marginBottom: 10 }}>
        <Image source={logo} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{testTitle}</Text>


        <Text style={styles.description}>
          Please read the following instructions carefully before starting the test:
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Interface Instructions</Text>
          <InstructionText text="This test consists of multiple-choice questions." />
          <InstructionText text="Answer all the questions within the specified time." />
          <InstructionText text="Once you start the test, you cannot pause or go back." />
          <InstructionText text="Submit your answers before the time runs out." />
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Test Instructions</Text>
          {testData?.instruction?.length > 0 ? (
            testData.instruction.map((instruction, index) => (
              <InstructionText key={index} text={instruction} />
            ))
          ) : (
            <Text style={styles.instructionText}>No custom test instructions provided.</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
        >
          <View style={styles.checkbox}>
            {isChecked ? (
              <Icon name="check-box" size={24} color="#2179F4" />
            ) : (
              <Icon name="check-box-outline-blank" size={24} color="#999" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read all the test and interface instructions carefully.
          </Text>
        </TouchableOpacity>

  
      </ScrollView>
    </View>
      <Spinner/>
    </View>
  ) :
  //Loading is done!!
  (
    <View style={{ marginBottom: 60 }}>
      <View style={{ backgroundColor: '#BFDEFE', justifyContent: 'center', paddingLeft: 5, marginBottom: 10 }}>
        <Image source={logo} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{testTitle}</Text>
        {
          isSubmit ? (
            <View style={{marginLeft:2}}>
            <Text style={{color:`#28282B`,marginBottom:6}}>Test Submitted Already on :</Text>
            {/* <Text style={styles.unscheduledText}></Text> */}
            <View style={{backgroundColor:`#BFDEFE`,width:`40%`,padding:8,borderRadius:5,marginBottom:5}}>
              <Text style={{color:`#28282B`}}>Date :{submitDate}</Text>
              <Text style={{color:`#28282B`}}>Time :{submitTime}</Text>
            </View>
            </View>
          ) :
          //submit nhi hua abhi , toh lets check ko vo schdule toh nhi hai ?
          isScheduled ? (
              <View style={{marginLeft:2}}>
               <Text style={{color:`#28282B`,marginBottom:6}}>Test scheduled On :</Text>
               <View style={{backgroundColor:`#BFDEFE`,width:`40%`,padding:8,borderRadius:5,marginBottom:5}}>
                 <Text style={{color:`#28282B`}}>Date :{startDate}</Text>
                 <Text style={{color:`#28282B`}}>Time :{startTime}</Text>
               </View>
             </View>
          ) :
          (
            deadlineDate=== "" ? (
              <View style={{marginLeft:2}}>
              <View style={styles.unscheduledTag}>
                <Text style={styles.unscheduledText}>Unscheduled test without deadline</Text>
              </View>
            </View> 
            ) : (
              <View>
                <Text>Test Deadline On: </Text>
                <Text style={{color:`gray`}}>Date : {deadlineDate}</Text>
                <Text style={{color:`gray`}}>Time : {deadlineTime}</Text>
              </View>
            )
          )
          
        }

        <Text style={styles.description}>
          Please read the following instructions carefully before starting the test:
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Interface Instructions</Text>
          <InstructionText text="This test consists of multiple-choice questions." />
          <InstructionText text="Answer all the questions within the specified time." />
          <InstructionText text="Once you start the test, you cannot pause or go back." />
          <InstructionText text="Submit your answers before the time runs out." />
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Test Instructions</Text>
          {testData?.instruction?.length > 0 ? (
            testData.instruction.map((instruction, index) => (
              <InstructionText key={index} text={instruction} />
            ))
          ) : (
            <Text style={styles.instructionText}>No custom test instructions provided.</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
        >
          <View style={styles.checkbox}>
            {isChecked ? (
              <Icon name="check-box" size={24} color="#2179F4" />
            ) : (
              <Icon name="check-box-outline-blank" size={24} color="#999" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read all the test and interface instructions carefully.
          </Text>
        </TouchableOpacity>


        {
          isSubmit == false ? (
            
              isTestExpired() ? (

                <TouchableOpacity
                  style={[styles.startButton, { opacity: isChecked ? 1 : 0.6 } , {backgroundColor: 'red'}]}
                  disabled={!isChecked}
                >
                  <Text style={styles.startButtonText}> Test Expired</Text>
                </TouchableOpacity> 
              ) : (
                isScheduled ? (
                  <View>
                    {new Date(currentDateTime) >= new Date(startDateTime) ? (
                      <TouchableOpacity onPress={()=>{navigation.navigate('TestView',{questionsData:questions,classId:classId,testId:test.testId})}} style={styles.startButton}>
                        <Text style={styles.buttonText}>Start Test</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={[styles.startButton, styles.disabledButton]}>
                        <Text style={styles.startButtonText}>
                          Starts in{' '}
                          {timeRemaining.hours > 0 && (
                            <Text>{`${timeRemaining.hours}h `}</Text>
                          )}
                          {timeRemaining.minutes > 0 && (
                            <Text>{`${timeRemaining.minutes}m `}</Text>
                          )}
                          <Text>{`${timeRemaining.seconds}s`}</Text>
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <>
                    {deadlineDate ? (
                      isDeadlineExpired() ? (
                        <TouchableOpacity style={[styles.expiredButton, styles.disabledButton]}>
                          <Text style={styles.buttonText}>Test Expired</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={()=>{navigation.navigate('TestView',{questionsData:questions,classId:classId,testId:test.testId})}} style={styles.startButton}>
                          <Text style={styles.buttonText}>Start Test</Text>
                        </TouchableOpacity>
                      )
                    ) : (
                      <TouchableOpacity
                      style={[styles.startButton, { opacity: isChecked ? 1 : 0.6 } , {backgroundColor: expired ? 'red':'#2179F4'}]}
                      disabled={!isChecked}
                      onPress={() => {
                        !expired&&
                        navigation.navigate('TestView',{questionsData:questions,classId:classId,testId:test.testId})}}
                    >
                      <Text style={styles.startButtonText}>Start Test</Text>
                    </TouchableOpacity>
                    )}
                  </>
                )
              )
            
          ) : (
            <TouchableOpacity
            style={[styles.startButton, { opacity: isChecked ? 1 : 0.6 } , {backgroundColor: expired ? 'red':'#2179F4'}]}
            disabled={!isChecked}
            onPress={() => {
              navigation.navigate('ScoreCard',{questionsData:questions,classId:classId,testId:test.testId})}}
            >
              <Text style={styles.startButtonText}>View Assessment</Text>
            </TouchableOpacity>
          )
        }







      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    backgroundColor: '#3b82f6', // Blue background
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center the text
  },
  disabledButton: {
    opacity: 0.5, // Make the button look disabled
  },
  expiredButton: {
    backgroundColor: '#ef4444', // Red background
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 14, // Font size
  },
  logo: {
    width: 100,
    height: 30,
    alignSelf: 'left', 
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 6,
    backgroundColor: '#f5f7fa', 
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1c1e21', 
    marginBottom: 10,
  },
  unscheduledTag: {
    backgroundColor: '#53D17A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  unscheduledText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555', 
    marginBottom: 20,
    lineHeight: 24, 
    marginLeft:3
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, 
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: 4, 
  },
  dot: {
    fontSize: 15,
    color: '#666',
    marginRight: 8, 
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22, 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: 10, 
    paddingVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14.5,
    color: '#333', 
  },
  startButton: {
    backgroundColor: '#2179F4',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, 
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButtonTextRed:{
    backgroundColor: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default Instructions;


// import React, { useEffect, useState,useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'; 
// import logo from '../assets/logo.png';
// import { useFocusEffect,useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { setQuestions } from '../store/features/Test/TestSlice';
// import api from '../ApiCall';
// import Spinner from './Spinner';
// const { DateTime } = require('luxon');

// const getCurrentDateTime = () => {
//   const currentDate = new Date();
//   const isoString = currentDate.toISOString();
//   return isoString;
// }

// const calculateTimeRemaining = (currentDateTime, startDateTime) => {
//   const CurrentDateTime = new Date(currentDateTime);
//   const StartDateTime = new Date(startDateTime);
//   // console.log(CurrentDateTime)
//   // console.log(StartDateTime)
//   const timeDifference = Math.max(StartDateTime - CurrentDateTime, 0);

//   // Calculate hours, minutes, and seconds
//   const hours = Math.floor(timeDifference / 3600000);
//   const minutes = Math.floor((timeDifference % 3600000) / 60000);
//   const seconds = Math.floor((timeDifference % 60000) / 1000);
//   console.log()
//   return { hours, minutes, seconds };
  
// }


// const Instructions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { test,classId,testTitle,chapterId } = route.params;
//   const dispatch = useDispatch();


//   console.log("I am inside Instruction");
//   console.log("----------------");
//   console.log("ClassId: ",classId);
//   console.log("TestId: ",test.testId);
//   console.log("----------------");

//   const [isChecked, setIsChecked] = useState(false);
//   const [testData, setTestData] = useState(null);
//   const [questions, setquestions] = useState();
//   const [expired,setExpired] = useState(false);
//   const [loader ,setLoader] = useState(true);


//   //New added
//   const [TestMetaData, setMetaData] = useState({});
//   const [isScheduled, setIsScheduled] = useState(true);
//   const [isSubmit, setIsSubmit] = useState(false);
//   const [submitTime, setSubmitTime] = useState('');
//   const [submitDate, setSubmitDate] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [startTime, setStartTime] = useState('');
//   const [deadlineDate, setDeadlineDate] = useState('');
//   const [deadlineTime, setDeadlineTime] = useState('');
//   const [startDateTime, setStartDateTime] = useState("");
//   const [instructionsArray, setInstructionsArray] = useState([]);
//   const [deadline, setDeadline] = useState('');
//   const [scheduledAt, setScheduledAt] = useState('')
//   const [duration, setDuration] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);


//       // Example usage:
//       const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
//       const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(currentDateTime, startDateTime));
//       let intervalId;

//       // Start the interval when the component is focused
//       useFocusEffect(
//         useCallback(() => {
//           intervalId = setInterval(() => {
//             setCurrentDateTime(getCurrentDateTime());
//           }, 1000);
    
//           // Clear interval when the component loses focus or unmounts
//           return () => {
//             clearInterval(intervalId);
//           };
//         }, [])
//       );
//       useEffect(() => {
//           // Recalculate time remaining whenever currentDateTime changes
//           setTimeRemaining(calculateTimeRemaining(currentDateTime, startDateTime));
//       }, [currentDateTime, startDateTime]);


//   useEffect(() => {
//     OnLoad();
//   }, []);

//   // Re-fetch data when the screen regains focus
//   useFocusEffect(
//     useCallback(() => {
//       OnLoad();  // Re-fetch data or rerender when the screen is focused
//     }, [])
//   );

  
//   const OnLoad = async () => {
//     // getCurrentDateTime();
//     setLoader(true);
//     console.log("Loader is true");
//     try {
//       // Make both API calls in parallel using Promise.all
//       const [response1, response2] = await Promise.all([
//         api.get(`/home/${classId}/test/${test.testId}/testmetadata`),
//         api.get(`/home/${classId}/test/${test.testId}`)
//       ]);
    
//       // Handle the response from the first API call (test metadata)
//       console.log('Test metadata response:', response1.data);
//       setTestData(response1.data); // Set the test metadata data
//       if(response1){
//         console.log("setIsSubmit: ",response1.data.startDate);
//         setMetaData(response1.data)
//         setIsScheduled(response1.data.isScheduled)
//         setIsSubmit(response1.data.isSubmit)
//         setSubmitTime(response1.data.submitTime)
//         setSubmitDate(response1.data.submitDate)
//         setStartDate(response1.data.startDate)
//         setStartTime(response1.data.startTime)
//         setDeadlineDate(response1.data.deadlineDate)
//         setDeadlineTime(response1.data.deadlineTime)
//         setDeadline(response1.data.deadline)
//         setScheduledAt(response1.data.scheduledAt)
//         setStartDateTime(response1.data.startDateTime)
//         setInstructionsArray(response1.data.instruction)
//         setDuration(response1.data.duration)
//         setIsLoading(false)
//       }

    
//       // Handle the response from the second API call (questions)
//       console.log('Questions response:', response2.data);
//       dispatch(setQuestions(response2.data));
//       console.log("setQuestions dispatched successfully");

//       console.log(response1.error)

//       setLoader(false);
//       console.log("Loader is false");

    
//     } catch (error) {
//       console.log('Error while fetching data', error);
//       if (error.response && error.response.status === 500) {
//         setExpired(true);
//         console.log('Test expired');
//       } else {
//         console.log('Error fetching test data');
//       }
//     }

//   };


//   const isDeadlineExpired = () => {
//     if (deadlineDate === "") {
//         // No deadline set, return false
//         return false;

//     } else {
//         // Parse deadline string into a Date object
//         const Deadline = new Date(deadline);
//         const currentDate = new Date();
//         return Deadline < currentDate;
//     }
//   };

//   const isTestExpired = () => {
//     if (!isScheduled) {
//         return false;
//     }
//     else {
//         // Parse the scheduled time into a Date object and calculate currentDateTime
//         const scheduledTime = new Date(scheduledAt);
//         const currentDate = new Date();

//         // Calculate scheduledEndTime, after this time test will be closed
//         // here galary window is 5 minutes, later ask teacher to set gallery window
//         const scheduledEndTime = new Date(scheduledTime.getTime() + 5 * 60000); // 60000 ms = 1 minute
//         return currentDate > scheduledEndTime;
//     }
//   };

//   const isTestFinished = () => {
//     if (!isScheduled) {
//         return false;
//     }
//     else {
//         // Parse the scheduled time into a Date object and calculate currentDateTime
//         console.log("Schedule at :", scheduledAt);
//         const scheduledTime = new Date(scheduledAt);
//         const currentDate = new Date();

//         // Calculate scheduledEndTime, after this time test will be closed
//         // here galary window is 5 minutes, later ask teacher to set gallery window
//         const scheduledEndTime = new Date(scheduledTime.getTime() + duration * 60000); // 60000 ms = 1 minute
//         console.log("TestFinishTime: ", scheduledEndTime)
//         return currentDate > scheduledEndTime;
//     }
//   };




//   const InstructionText = ({ text }) => (
//     <View style={styles.instructionRow}>
//       <Text style={styles.dot}>•</Text>
//       <Text style={styles.instructionText}>{text}</Text>
//     </View>
//   );




//   return  loader ? (
//     <View style={{flex:1}}>
//       <View style={{ marginBottom: 60 }}>
//       <View style={{ backgroundColor: '#BFDEFE', justifyContent: 'center', paddingLeft: 5, marginBottom: 10 }}>
//         <Image source={logo} style={styles.logo} />
//       </View>

//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>{testTitle}</Text>


//         <Text style={styles.description}>
//           Please read the following instructions carefully before starting the test:
//         </Text>

//         <View style={styles.instructionsContainer}>
//           <Text style={styles.sectionTitle}>Interface Instructions</Text>
//           <InstructionText text="This test consists of multiple-choice questions." />
//           <InstructionText text="Answer all the questions within the specified time." />
//           <InstructionText text="Once you start the test, you cannot pause or go back." />
//           <InstructionText text="Submit your answers before the time runs out." />
//         </View>

//         <View style={styles.instructionsContainer}>
//           <Text style={styles.sectionTitle}>Test Instructions</Text>
//           {testData?.instruction?.length > 0 ? (
//             testData.instruction.map((instruction, index) => (
//               <InstructionText key={index} text={instruction} />
//             ))
//           ) : (
//             <Text style={styles.instructionText}>No custom test instructions provided.</Text>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.checkboxContainer}
//           onPress={() => setIsChecked(!isChecked)}
//         >
//           <View style={styles.checkbox}>
//             {isChecked ? (
//               <Icon name="check-box" size={24} color="#2179F4" />
//             ) : (
//               <Icon name="check-box-outline-blank" size={24} color="#999" />
//             )}
//           </View>
//           <Text style={styles.checkboxLabel}>
//             I have read all the test and interface instructions carefully.
//           </Text>
//         </TouchableOpacity>

  
//       </ScrollView>
//     </View>
//       <Spinner/>
//     </View>
//   ) :
//   //Loading is done!!
//   (
//     <View style={{ marginBottom: 60 }}>
//       <View style={{ backgroundColor: '#BFDEFE', justifyContent: 'center', paddingLeft: 5, marginBottom: 10 }}>
//         <Image source={logo} style={styles.logo} />
//       </View>

//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>{testTitle}</Text>

//         {/* Test is not Scheduled isSubmit  
//             <View style={{marginLeft:2}}>
//               <View style={styles.unscheduledTag}>
//                 <Text style={styles.unscheduledText}>Unscheduled test without deadline</Text>
//               </View>
//             </View> */}



//         {
//           isSubmit ? (
//             <View style={{marginLeft:2}}>
//             <Text style={{color:`#28282B`,marginBottom:6}}>Test Submitted Already on :</Text>
//             {/* <Text style={styles.unscheduledText}></Text> */}
//             <View style={{backgroundColor:`#BFDEFE`,width:`40%`,padding:8,borderRadius:5,marginBottom:5}}>
//               <Text style={{color:`#28282B`}}>Date :{submitDate}</Text>
//               <Text style={{color:`#28282B`}}>Time :{submitTime}</Text>
//             </View>
//             </View>
//           ) :
//           //submit nhi hua abhi , toh lets check ko vo schdule toh nhi hai ?
//           isScheduled ? (
//               <View style={{marginLeft:2}}>
//                <Text style={{color:`#28282B`,marginBottom:6}}>Test scheduled On :</Text>
//                <View style={{backgroundColor:`#BFDEFE`,width:`40%`,padding:8,borderRadius:5,marginBottom:5}}>
//                  <Text style={{color:`#28282B`}}>Date :{startDate}</Text>
//                  <Text style={{color:`#28282B`}}>Time :{startTime}</Text>
//                </View>
//              </View>
//           ) :
//           (
//             deadlineDate=== "" ? (
//               <View style={{marginLeft:2}}>
//               <View style={styles.unscheduledTag}>
//                 <Text style={styles.unscheduledText}>Unscheduled test without deadline</Text>
//               </View>
//             </View> 
//             ) : (
//               <View>
//                 <Text>Test Deadline On: </Text>
//                 <Text style={{color:`gray`}}>Date : {deadlineDate}</Text>
//                 <Text style={{color:`gray`}}>Time : {deadlineTime}</Text>
//               </View>
//             )
//           )
          
//         }

//         <Text style={styles.description}>
//           Please read the following instructions carefully before starting the test:
//         </Text>

//         <View style={styles.instructionsContainer}>
//           <Text style={styles.sectionTitle}>Interface Instructions</Text>
//           <InstructionText text="This test consists of multiple-choice questions." />
//           <InstructionText text="Answer all the questions within the specified time." />
//           <InstructionText text="Once you start the test, you cannot pause or go back." />
//           <InstructionText text="Submit your answers before the time runs out." />
//         </View>

//         <View style={styles.instructionsContainer}>
//           <Text style={styles.sectionTitle}>Test Instructions</Text>
//           {testData?.instruction?.length > 0 ? (
//             testData.instruction.map((instruction, index) => (
//               <InstructionText key={index} text={instruction} />
//             ))
//           ) : (
//             <Text style={styles.instructionText}>No custom test instructions provided.</Text>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.checkboxContainer}
//           onPress={() => setIsChecked(!isChecked)}
//         >
//           <View style={styles.checkbox}>
//             {isChecked ? (
//               <Icon name="check-box" size={24} color="#2179F4" />
//             ) : (
//               <Icon name="check-box-outline-blank" size={24} color="#999" />
//             )}
//           </View>
//           <Text style={styles.checkboxLabel}>
//             I have read all the test and interface instructions carefully.
//           </Text>
//         </TouchableOpacity>


//         {
//           isSubmit == false ? (
            
//               isTestExpired() ? (
//                 <TouchableOpacity
//                   style={[styles.startButton, { opacity: isChecked ? 1 : 0.6 } , {backgroundColor: 'red'}]}
//                   disabled={!isChecked}
//                 >
//                   <Text style={styles.startButtonText}> Test Expired</Text>
//                 </TouchableOpacity> 
//               ) : (

//                 isScheduled ? (
//                   <View>
//                     {new Date(currentDateTime) >= new Date(startDateTime) ? (
//                       <TouchableOpacity onPress={()=>{navigation.navigate('TestView',{questionsData:questions,classId:classId,testId:test.testId})}} style={styles.startButton}>
//                         <Text style={styles.buttonText}>Start Test</Text>
//                       </TouchableOpacity>
//                     ) : (
//                       <TouchableOpacity style={[styles.startButton, styles.disabledButton]}>
//                         <Text style={styles.startButtonText}>
//                           Starts in{' '}
//                           {timeRemaining.hours > 0 && (
//                             <Text>{`${timeRemaining.hours}h `}</Text>
//                           )}
//                           {timeRemaining.minutes > 0 && (
//                             <Text>{`${timeRemaining.minutes}m `}</Text>
//                           )}
//                           <Text>{`${timeRemaining.seconds}s`}</Text>
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 ) : (
//                   <>
//                     {deadlineDate ? (
//                       isDeadlineExpired() ? (
//                         <TouchableOpacity style={[styles.expiredButton, styles.disabledButton]}>
//                           <Text style={styles.buttonText}>Test Expired</Text>
//                         </TouchableOpacity>
//                       ) : (
//                         <TouchableOpacity onPress={()=>{navigation.navigate('TestView',{questionsData:questions,classId:classId,testId:test.testId})}} style={styles.startButton}>
//                           <Text style={styles.buttonText}>Start Test</Text>
//                         </TouchableOpacity>
//                       )
//                     ) : (
//                       <TouchableOpacity
//                       style={[styles.startButton, { opacity: isChecked ? 1 : 0.6 } , {backgroundColor: expired ? 'red':'#2179F4'}]}
//                       disabled={!isChecked}
//                       onPress={() => {
//                         !expired&&
//                         navigation.navigate('TestView',{questionsData:questions,classId:classId,testId:test.testId})}}
//                     >
//                       <Text style={styles.startButtonText}>Start Test</Text>
//                     </TouchableOpacity>
//                     )}
//                   </>
//                 )
//               )
            
//           ) : (
//             <TouchableOpacity
//             style={[styles.startButton, { opacity: isChecked ? 1 : 0.6 } , {backgroundColor: expired ? 'red':'#2179F4'}]}
//             disabled={!isChecked}
//             onPress={() => {
//               navigation.navigate('ScoreCard',{questionsData:questions,classId:classId,testId:test.testId})}}
//             >
//               <Text style={styles.startButtonText}>View Assessment</Text>
//             </TouchableOpacity>
//           )
//         }

//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   startButton: {
//     backgroundColor: '#3b82f6', // Blue background
//     paddingVertical: 10, // Vertical padding
//     paddingHorizontal: 20, // Horizontal padding
//     borderRadius: 8, // Rounded corners
//     alignItems: 'center', // Center the text
//   },
//   disabledButton: {
//     opacity: 0.5, // Make the button look disabled
//   },
//   expiredButton: {
//     backgroundColor: '#ef4444', // Red background
//   },
//   buttonText: {
//     color: '#fff', // White text
//     fontSize: 14, // Font size
//   },
//   logo: {
//     width: 100,
//     height: 30,
//     alignSelf: 'left', 
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   container: {
//     flexGrow: 1,
//     padding: 6,
//     backgroundColor: '#f5f7fa', 
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: '#1c1e21', 
//     marginBottom: 10,
//   },
//   unscheduledTag: {
//     backgroundColor: '#53D17A',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 50,
//     alignSelf: 'flex-start',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   unscheduledText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   description: {
//     fontSize: 14,
//     color: '#555', 
//     marginBottom: 20,
//     lineHeight: 24, 
//     marginLeft:3
//   },
//   instructionsContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4, 
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 10,
//   },
//   instructionRow: {
//     flexDirection: 'row',
//     alignItems: 'start',
//     marginBottom: 8,
//     fontSize:13 
//   },
//   dot: {
//     fontSize: 15,
//     color: '#666',
//     marginRight: 8, 
//   },
//   instructionText: {
//     fontSize: 15,
//     color: '#666',
//     lineHeight: 22, 
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'start',
//     marginBottom: 10, 
//     paddingVertical: 10,
//   },
//   checkbox: {
//     marginRight: 10,
//   },
//   checkboxLabel: {
//     fontSize: 14.5,
//     color: '#333', 
//   },
//   startButton: {
//     backgroundColor: '#2179F4',
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5, 
//   },
//   startButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   startButtonTextRed:{
//     backgroundColor: 'red',
//     fontSize: 18,
//     fontWeight: 'bold',
//   }
// });

// export default Instructions;
