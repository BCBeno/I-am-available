import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Screens/Home';
import SignInBox from './Authentication/sign_in_box';
import SignUpBox from './Authentication/sign_up_box';
import ProfilePictureUploadBox from './Authentication/upload_picture_box';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignInBox} />
        <Stack.Screen name="SignUp" component={SignUpBox} />
        <Stack.Screen name="ProfilePicture" component={ProfilePictureUploadBox} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
