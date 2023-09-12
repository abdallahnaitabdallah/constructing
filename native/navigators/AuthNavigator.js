import React, { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Linking } from 'react-native';

import ActivationScreen from '../screens/ActivationScreen'; // Update the path as needed
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import Login from '../screens/Login';
import ResetPasswordConfirmScreen from '../screens/ResetPasswordConfirmScreen';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';


const Stack = createNativeStackNavigator();

const baseUrl = "https://ec0e-105-158-41-46.ngrok-free.app"

export default function AuthNavigator() {
  const navigation = useNavigation(); 

  const handleDeepLink = async (event) => {
    const url = event.url;
    console.log(url)
    if (url) {
      // Handle activation link
      if (url.includes('activate')) {
        const [, uid, token] = url.match(/activate\/([^/]+)\/([^/]+)/);
        // Navigate to the ActivationScreen with UID and token as params
        navigation.navigate('Activation', { uid, token });
      }
      
      // Handle reset password confirmation link
      if (url.includes('password/reset/confirm')) {
        const [, uid, token] = url.match(/password\/reset\/confirm\/([^/]+)\/([^/]+)/);
        // Navigate to the ResetPasswordConfirmScreen with UID and token as params
        navigation.navigate('ResetPasswordConfirm', { uid, token });
      }
    }
  };
  useEffect(() => {
    
    Linking.addEventListener(baseUrl, handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
      return () => {
      Linking.removeEventListener(baseUrl, handleDeepLink);
    }
  }, []);
  
  return (
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
        <Stack.Screen name='SignUp' component={Signup}  options={{headerShown: false}} />
        <Stack.Screen name='Activation' component={ActivationScreen}  options={{headerShown: false}} />
        <Stack.Screen name='ResetPassword' component={ResetPasswordScreen}  options={{headerShown: false}} />
        <Stack.Screen name='ResetPasswordConfirm' component={ResetPasswordConfirmScreen} options={{headerShown: false}} />
      </Stack.Navigator>
  );
        
}