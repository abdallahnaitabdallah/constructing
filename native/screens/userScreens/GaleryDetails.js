import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const GaleryDetails = ({ route }) => {
  const project = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.projectTitle}>{project.project.title}</Text>
      <Text style={styles.projectDescription}>{project.project.description}</Text>

      {project.project.images.map((image, index) => (
      <></>
      ))}

      {project.project.videos.map((video, index) => (
        <></>
      ))}

      <Text style={styles.caseStudyTitle}>{project.title}</Text>
      <Text style={styles.caseStudyDescription}>{project.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  projectDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  caseStudyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  caseStudyDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 200,
  },
});

export default GaleryDetails;
