import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthenticationFlow from './Navigation/AuthenticationFlow';
import MainTabNavigator from './Navigation/MainTabNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <NavigationContainer>
      {!loggedInUser ? (
        <AuthenticationFlow setLoggedInUser={setLoggedInUser} />
      ) : (
        <MainTabNavigator user={loggedInUser} setLoggedInUser={setLoggedInUser} />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}