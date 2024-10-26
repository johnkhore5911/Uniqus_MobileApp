import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


const TestPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { resourcesx1, classId, chapterId } = route.params;

  const formattedTests = resourcesx1.tests.map(test => ({
    testId: test.id,
    title: test.title,
    marks: test.marks,
    performance: test.performance,
    createdAt: test.createdAt ? test.createdAt.split('T')[0] : 'N/A',
  }));

  console.log("Formated test: ",formattedTests);

  return formattedTests.length==0 ?
  (
    <View style={{padding:4}}>
    <Text style={{padding:8,fontWeight:`bold`,color:`gray`,fontSize:14}}>No Tests available</Text>
  </View>
  )
  :
  (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.testContainer}>
          {formattedTests.map((test, index) => (
            <TouchableOpacity
              key={index}
              style={styles.testCard}
              onPress={() =>
                navigation.navigate("Instructions", {
                  test,
                  classId,
                  testTitle: test.title,
                  chapterId,
                })
              }
            >
              <Text style={styles.testTitle}>{test.title}</Text>
              <View style={styles.testDetails}>
                <Text style={styles.testMarks}>Marks: {test.marks || 0}</Text>
                
                <Text style={styles.testPerformance}>
                <Icon name="bar-chart" size={13} color="#fff" style={styles.performanceIcon} />
                <Text>  {test.performance || 'Average'}</Text>
                </Text>
                
                <Text style={styles.testPosted}>
                <Icon name="calendar" size={14} color="#333" style={styles.calendarIcon} />
                <Text>  {test.createdAt}</Text>
                </Text>

              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  ) 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Keep the background white
    padding: 4,

  },
  scrollContainer: {
    paddingBottom: 20,
  },
  testContainer: {
    marginTop: 10,
  },
  testCard: {
    backgroundColor: 'white', // White background for the test card
    borderWidth: .5, // Adding a border
    borderColor: 'grey', // Border color is black
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  testTitle: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  testDetails: {
    // width:`70%`,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    gap:10,
    
  },
  testMarks: {
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    color: 'white',
    fontWeight: '400',
    fontSize:13
  },
  testPerformance: {
    backgroundColor: '#2196f3',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    color: 'white',
    fontSize:13,
    fontWeight: '400',
  },
  testPosted: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    color: '#333',
    fontWeight: '400',
    fontSize: 12,
  },
});

export default TestPage;
