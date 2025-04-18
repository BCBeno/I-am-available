import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInBox from '../Authentication/sign_in_box';
import SignUpBox from '../Authentication/sign_up_box';
import ProfilePictureUploadBox from '../Authentication/upload_picture_box';

const Stack = createStackNavigator();

const AuthenticationFlow = ({ setLoggedInUser }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn">
      {(props) => <SignInBox {...props} setLoggedInUser={setLoggedInUser} />}
    </Stack.Screen>
    <Stack.Screen name="SignUp" component={SignUpBox} />
    <Stack.Screen name="ProfilePicture" component={ProfilePictureUploadBox} />
  </Stack.Navigator>
);

export default AuthenticationFlow;
