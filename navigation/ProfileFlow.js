//ProfileFlow.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfilePage';

const Stack = createStackNavigator();

const ProfileFlow = ({ user, setLoggedInUser }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen">
        {(props) => (
          <ProfileScreen
            {...props}
            user={user}
            setLoggedInUser={setLoggedInUser}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};



export default ProfileFlow;
