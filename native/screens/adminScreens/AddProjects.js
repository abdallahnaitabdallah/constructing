import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // Import Axios
import { useSelector } from 'react-redux';
import { baseUrl } from '../../constants/url';
import COLORS from '../../constants/colors';
import Video from 'react-native-video';

const AddProjects = () => {
  const imageIcon = <FontAwesome name="image" size={24} color="green" />;
  const videoIcon = <FontAwesome name="video-camera" size={24} color="green" />;

  const access = useSelector((state) => state.auth.access);

  const [caseStudyData, setCaseStudyData] = useState({
    title: '',
    description: '',
    project: {
      title: '',
      description: '',
      images: [],
      videos: [],
    },
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageObj = {
        image: result.uri,
      };
  
      const updatedImages = [...selectedImages, imageObj];
      setSelectedImages(updatedImages);
    }
  };
  
  const handleAddVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Video,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const videoObj = {
        video_url: result.uri,
      };
  
      const updatedVideos = [...selectedVideos, videoObj];
      setSelectedVideos(updatedVideos);
    }
  };
  
  const handleSubmit = async () => {
    // Ensure all required fields are filled
    if (
      !caseStudyData.title ||
      !caseStudyData.description ||
      !caseStudyData.project.title ||
      !caseStudyData.project.description
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    console.log(caseStudyData)
    try {
      const response = await axios.post(`${baseUrl}/api/case-studies/`, caseStudyData, {
        headers: {
          'Content-Type': 'application/json', // Change content type to JSON
          Authorization: `JWT ${access}`,
          Accept: 'application/json',
        },
      });
  
      if (response.status === 200) {
        alert('Case study created successfully!');
        setSelectedImages([]);
        setSelectedVideos([]);
        setCaseStudyData({
          title: '',
          description: '',
          project: {
            title: '',
            description: '',
            images: [],
            videos: [],
          },
        });
      } else {
        alert('Failed to create a case study.');
      }
    } catch (error) {
      console.error('Error creating case study:', error.response);
      alert('An error occurred while creating the case study.');
    }
  };
  
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a Case Study</Text>

      <Text style={styles.label}>Case Study Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={caseStudyData.title}
        onChangeText={(text) => setCaseStudyData({ ...caseStudyData, title: text })}
      />

      <Text style={styles.label}>Case Study Description:</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter description"
        value={caseStudyData.description}
        onChangeText={(text) => setCaseStudyData({ ...caseStudyData, description: text })}
        multiline
      />

      <Text style={styles.label}>Project Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project title"
        value={caseStudyData.project.title}
        onChangeText={(text) =>
          setCaseStudyData({
            ...caseStudyData,
            project: { ...caseStudyData.project, title: text },
          })
        }
      />

      <Text style={styles.label}>Project Description:</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter project description"
        value={caseStudyData.project.description}
        onChangeText={(text) =>
          setCaseStudyData({
            ...caseStudyData,
            project: { ...caseStudyData.project, description: text },
          })
        }
        multiline
      />

      <Text style={styles.label}>Project Images:</Text>
      <View style={styles.imageContainer}>
        <ScrollView horizontal={true}>
          {selectedImages.map((imageObj, index) => (
            <Image key={index} source={{ uri: imageObj.image }} style={styles.image} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
          {imageIcon}
          <Text style={styles.addButtonText}>Add Image</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Project Videos:</Text>
      <View style={styles.videoContainer}>
        <ScrollView horizontal={true}>
          {selectedVideos.map((videoObj, index) => (
            <Video
              key={index}
              source={{ uri: videoObj.video_url }} // Make sure videoObj.video_url is a valid video URL
              style={{ width: 100, height: 100 }}
              controls={true} // You can add controls if needed
            />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddVideo}>
          {videoIcon}
          <Text style={styles.addButtonText}>Add Video</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  multilineInput: {
    height: 80,
  },
  imageContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  addButton: {
    width: 100,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
  },
  addButtonText: {
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  videoContainer: {
    marginBottom: 16,
    flexDirection:'column'
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddProjects;
