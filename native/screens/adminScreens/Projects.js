import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import { baseUrl } from '../../constants/url';

const Project = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`,
          'Accept': 'application/json'
        }
      };

      const response = await axios.get(`${baseUrl}/api/case-studies/`,config);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const navigateToProjectDetails = (project) => {
    navigation.navigate('ProjectDetails', { project });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectContainer}
      onPress={() => navigateToProjectDetails(item)}
    >
      {item.project.images.length > 0 && (
        <Image source={{ uri: item.project.images[0].image }} style={styles.projectImage} />
      )}
      <Text style={styles.projectTitle}>{item.project.title}</Text>
      <Text style={styles.caseStudyInfo}>{item.project.description}</Text>
      <Text style={styles.caseStudyInfo}>{item.title}</Text>
      <Text style={styles.caseStudyInfo}>{item.description}</Text>
    </TouchableOpacity>
  );
  
  const navigateToCreateScreen = () => {
    navigation.navigate('AddProjects'); 
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={navigateToCreateScreen}>
        <Text style={styles.createButtonText}>Create Project</Text>
      </TouchableOpacity>
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={(item) => item.title} // Use title as the key if it's unique
        numColumns={2} // Display as a grid with 2 columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    paddingTop:50,
  },
  projectContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  projectTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  caseStudyInfo: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
  },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default Project;
