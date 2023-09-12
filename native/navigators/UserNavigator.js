import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/userScreens/Home';
import GaleryStack from './GaleryStack';
import Request from '../screens/userScreens/Request';
import Profile from '../screens/userScreens/Profile';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors'; 

const Tab = createBottomTabNavigator();

const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={
        {
          "tabBarActiveTintColor": "#007260",
          "tabBarInactiveTintColor": "#CCCCCC",
          "tabBarShowLabel": false,
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ]
        }
        
      }
      tabBarOptions={{
        activeTintColor: COLORS.primary, // Active tab icon color
        inactiveTintColor: COLORS.grey, // Inactive tab icon color
        showLabel: false, // Hide tab labels
        style: {
          backgroundColor: COLORS.white, // Tab bar background color
          borderTopWidth: 1, // Top border width
          borderTopColor: COLORS.grey, // Top border color
          height: 60, // Tab bar height
          paddingVertical: 5, // Vertical padding
          borderTopLeftRadius: 20, // Border radius for top left corner
          borderTopRightRadius: 20, // Border radius for top right corner
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={30} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GaleryStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="images-outline" size={30} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Request"
        component={Request}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={30} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={30} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

export default UserNavigator;
