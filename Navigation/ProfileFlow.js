import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfilePage from '../Screens/ProfilePage';

const Stack = createStackNavigator();

const ProfileFlow = ({ user }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfilePage">
      {(props) => <ProfilePage {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
);

export default ProfileFlow;
