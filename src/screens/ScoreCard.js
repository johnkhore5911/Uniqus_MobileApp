import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../ApiCall';
import { useNavigation,useRoute } from '@react-navigation/native';
import Spinner from './Spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ScoreCard = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(null);
  const [loader ,setLoader] = useState(true);
  const navigation = useNavigation();

  const route = useRoute();
  const {classId} = route.params; 
  const {testId} = route.params; 

  // Fetch data from the API
  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const response = await api.get(`https://uniqus-backend.vercel.app/home/${classId}/test/${testId}/result`);
        console.log("response: ", response.data); // Check the full response structure

        const data = response.data; // Access the main data object

        // Check if the API call was successful
        if (data.success) {
          const formattedQuestions = data.response.map(q => ({
            question: q.question,
            selectedOption: q.studentAnswer,
            status: q.isCorrect === "true" ? "Correct" : "Incorrect",
            correctOption: q.correctAnswer,
          }));

          setQuestions(formattedQuestions);
          setScore(data.score);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoader(false);
      }
    };

    fetchScoreData();
  }, []);

  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => q.status === 'Correct').length;
  const incorrectAnswers = questions.filter(q => q.status === 'Incorrect').length;
  const unattemptedAnswers = questions.filter(q => q.selectedOption === 'Unanswered').length;


  return loader ? ( 
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.homeButton} onPress={()=>navigation.goBack()} >
          <Ionicons name="arrow-back" size={23}/>
        </TouchableOpacity>
        <Text style={styles.title}>Score Card</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Total Questions: {totalQuestions}</Text>
          <Text style={styles.stat}>Total Attempts: {totalQuestions - unattemptedAnswers}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.correct}>Correct Answers: {correctAnswers}</Text>
          <Text style={styles.incorrect}>Incorrect Answers: {incorrectAnswers}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Score: {score}</Text>
          <Text style={styles.stat}>Unattempted Answers: {unattemptedAnswers}</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Question</Text>
        <Text style={styles.tableHeaderText}>Selected Option</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.tableHeaderText}>Correct Option</Text>
      </View>

      <ScrollView style={styles.table}>
      <Spinner/>
      </ScrollView>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.homeButton} onPress={()=>navigation.goBack()} >
          <Ionicons name="arrow-back" size={23}/>
        </TouchableOpacity>
        <Text style={styles.title}>Score Card</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Total Questions: {totalQuestions}</Text>
          <Text style={styles.stat}>Total Attempts: {totalQuestions - unattemptedAnswers}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.correct}>Correct Answers: {correctAnswers}</Text>
          <Text style={styles.incorrect}>Incorrect Answers: {incorrectAnswers}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Score: {score}</Text>
          <Text style={styles.stat}>Unattempted Answers: {unattemptedAnswers}</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Question</Text>
        <Text style={styles.tableHeaderText}>Selected Option</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.tableHeaderText}>Correct Option</Text>
      </View>

      <ScrollView style={styles.table}>
        {questions.map((q, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.cell}>
              <Text>{index + 1}. {q.question}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{q.selectedOption}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{q.status}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{q.correctOption}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5ff',
    padding: 10,
  },
  header: {
    backgroundColor: '#f0f4ff', 
    paddingVertical: 5, 
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, 
  },
  title: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#333',
    flex: 1, 
    textAlign: 'center', 
  },
  homeButton: {
    padding: 8, 
    backgroundColor: '#cce6ff', 
    borderRadius: 5,
    marginLeft: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: {
    fontSize: 20, 
    color: '#333', 
  },
  statsContainer: {
    backgroundColor: '#cce6ff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  stat: {
    fontSize: 16,
    color: '#333',
  },
  correct: {
    fontSize: 16,
    color: 'green',
  },
  incorrect: {
    fontSize: 16,
    color: 'red',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#99ccff',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
  },
  tableHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  table: {
    backgroundColor: '#cce6ff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScoreCard;
