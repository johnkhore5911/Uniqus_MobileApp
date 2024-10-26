import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';

const announcementsData = [
  { id: '1', title: 'New Course Available', description: 'We have launched a new course on React Native development. Check it out now!', date: '2024-09-26', category: 'Courses' },
  { id: '2', title: 'Live Webinar', description: 'Join us for a live webinar on improving your app development skills.', date: '2024-09-27', category: 'Webinars' },
  { id: '3', title: 'App Maintenance', description: 'The app will be down for scheduled maintenance on 2024-09-28.', date: '2024-09-28', category: 'Maintenance' },
];

const categories = ['All', 'Courses', 'Webinars', 'Maintenance'];

const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState(announcementsData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = announcementsData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    } else {
      setFilteredAnnouncements(announcementsData);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredAnnouncements(announcementsData);
    } else {
      const filtered = announcementsData.filter(item => item.category === category);
      setFilteredAnnouncements(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderAnnouncement = ({ item }) => (
    <View style={styles.announcementItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Announcements..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <View style={styles.categories}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
            onPress={() => handleCategoryFilter(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAnnouncements}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff', 
  },
  searchBar: {
    padding: 10,
    borderColor: '#4682b4', 
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#f0f8ff', 
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#87cefa', 
  },
  selectedCategoryButton: {
    backgroundColor: '#c3d5f6', 
  },
  categoryText: {
    color: '#333', 
    fontWeight:"bold"
  },
  announcementItem: {
    backgroundColor: '#ffffff', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4682b4', 
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  category: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#888',
  },
});