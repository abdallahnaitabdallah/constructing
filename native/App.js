import { Provider } from 'react-redux'; 
import store from './redux/store'; 
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthenticated, load_user } from './redux/actions/auth';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

import AuthNavigator from './navigators/AuthNavigator';
import UserNavigator from './navigators/UserNavigator';
import AdminNavigator from './navigators/AdminNavigator';

const Stack = createNativeStackNavigator();

const Root = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user?.is_superuser);

  useEffect(() => {
    dispatch(checkAuthenticated());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(load_user());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated 
          ? <>
            {user ? (
              <Stack.Screen
                name="User"
                component={AdminNavigator}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="User"
                component={UserNavigator}
                options={{ headerShown: false }}
              />
            )}
          </>
          : (
            <Stack.Screen name="Welcome" component={AuthNavigator} options={{ headerShown: false }} />
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <Provider store={store}>
        <Root />
    </Provider>
  );
}
export default App;
