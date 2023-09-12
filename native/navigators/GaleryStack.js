import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GaleryDetails from '../screens/userScreens/GaleryDetails';
import Galery from '../screens/userScreens/Galery';

const Stack = createStackNavigator();

const Galerytack = () => {
  return (
    <Stack.Navigator initialRouteName="Galery" headerMode="none">
      <Stack.Screen name="Galery" component={Galery} />
      <Stack.Screen name="GaleryDetails" component={GaleryDetails} />
    </Stack.Navigator>
  );
};

export default Galerytack;
