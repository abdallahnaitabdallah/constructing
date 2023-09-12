import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux'; // Assuming you're using Redux
import { verify } from '../redux/actions/auth'; // Update the path as needed

const ActivationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  useEffect(() => {
    const { uid, token } = route.params;

    // Call the verify action with the UID and token
    dispatch(verify(uid, token));

    // Navigate to another screen after verification
    navigation.navigate('Login'); // Update with the appropriate screen name
  }, [dispatch, navigation, route.params]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Activation in progress...</Text>
    </View>
  );
};

export default ActivationScreen;
