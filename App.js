import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthenticationFlow from './Navigation/AuthenticationFlow';
import ProfileFlow from './Navigation/ProfileFlow';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <NavigationContainer>
      {!loggedInUser ? (
        <AuthenticationFlow setLoggedInUser={setLoggedInUser} />
      ) : (
        <ProfileFlow user={loggedInUser} />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
