import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Video,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Video as VideoPlayer } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';
import { baseUrl } from '../../constants/url';

const ProjectDetails = ({ route }) => {
  const project = route.params;
  const [updatedProject, setUpdatedProject] = useState(project);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    // Fetch project details from your API and set them in the state
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('access');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
          Accept: 'application/json',
        },
      };

      const response = await axios.put(
        `${baseUrl}/api/case-studies/${project.id}/`,
        updatedProject,
        config
      );

      if (response.status === 200) {
        alert('Project and Case Study updated successfully');
        fetchProjectDetails();
      } else {
        alert('Failed to update project and case study.');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (imageIndex) => {
    // Delete image at the given index
    const updatedImages = updatedProject.project.images
      ? [...updatedProject.project.images]
      : [];
    updatedImages.splice(imageIndex, 1);
    setUpdatedProject({
      ...updatedProject,
      project: { ...updatedProject.project, images: updatedImages },
    });
  };

  const handleDeleteVideo = (videoIndex) => {
    // Delete video at the given index
    const updatedVideos = updatedProject.project.videos
      ? [...updatedProject.project.videos]
      : [];
    updatedVideos.splice(videoIndex, 1);
    setUpdatedProject({
      ...updatedProject,
      project: { ...updatedProject.project, videos: updatedVideos },
    });
  };

  const handleAddImage = async () => {
    // Open the image picker and add the selected image to the state
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled) {
      return;
    }

    const newImages = updatedProject.project.images
      ? [...updatedProject.project.images, { image: pickerResult.uri }]
      : [{ image: pickerResult.uri }];
    setUpdatedProject({
      ...updatedProject,
      project: { ...updatedProject.project, images: newImages },
    });
  };

  const handleAddVideo = async () => {
    // Open the video picker and add the selected video to the state
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (pickerResult.canceled) {
      return;
    }

    const newVideos = updatedProject.project.videos
      ? [...updatedProject.project.videos, { video_url: pickerResult.uri }]
      : [{ video_url: pickerResult.uri }];
    setUpdatedProject({
      ...updatedProject,
      project: { ...updatedProject.project, videos: newVideos },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Details</Text>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={updatedProject.title}
        onChangeText={(text) =>
          setUpdatedProject({
            ...updatedProject,
            title: text,
          })
        }
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={updatedProject.description}
        onChangeText={(text) =>
          setUpdatedProject({
            ...updatedProject,
            description: text,
          })
        }
        multiline
      />
      <Text style={styles.label}>Project Title:</Text>
      <TextInput
        style={styles.input}
        value={updatedProject.project.title}
        onChangeText={(text) =>
          setUpdatedProject({
            ...updatedProject,
            project: { ...updatedProject.project, title: text },
          })
        }
      />
      <Text style={styles.label}>Project Description:</Text>
      <TextInput
        style={styles.input}
        value={updatedProject.project.description}
        onChangeText={(text) =>
          setUpdatedProject({
            ...updatedProject,
            project: { ...updatedProject.project, description: text },
          })
        }
        multiline
      />
      <Text style={styles.label}>Images:</Text>
      <View style={styles.mediaContainer}>
        {(updatedProject.project.images || []).map((image, index) => (
          <View key={index} style={styles.mediaItem}>
            <Image source={{ uri: image.image }} style={styles.media} />
            <TouchableOpacity onPress={() => handleDeleteImage(index)}>
              <Icon name="ios-close-circle" size={30} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={handleAddImage} style={styles.addIcon}>
          <Icon name="ios-add-circle" size={50} color="green" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Videos:</Text>
      <View style={styles.mediaContainer}>
        {(updatedProject.project.videos || []).map((video, index) => (
          <View key={index} style={styles.mediaItem}>
            <VideoPlayer
              source={{ uri: video.video_url }}
              style={styles.media}
              isLooping
              shouldPlay={false}
              useNativeControls
            />
            <TouchableOpacity onPress={() => handleDeleteVideo(index)}>
              <Icon name="ios-close-circle" size={30} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={handleAddVideo} style={styles.addIcon}>
          <Icon name="ios-add-circle" size={50} color="green" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdate}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Updating...' : 'Update Project'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  mediaItem: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  media: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: '#007260',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIcon: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default ProjectDetails;
