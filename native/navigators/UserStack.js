import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Users from '../screens/adminScreens/Users';
import Chat from '../screens/adminScreens/Chat';

const Stack = createStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator initialRouteName="Users" headerMode="none">
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default UserStack;
