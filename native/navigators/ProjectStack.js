import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Projects from '../screens/adminScreens/Projects';
import ProjectDetails from '../screens/adminScreens/ProjectDetails';
import AddProjects from '../screens/adminScreens/AddProjects'
const Stack = createStackNavigator();

const ProjectStack = () => {
  return (
    <Stack.Navigator initialRouteName="Projects" headerMode="none">
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      <Stack.Screen name="AddProjects" component={AddProjects} />

    </Stack.Navigator>
  );
};

export default ProjectStack;
