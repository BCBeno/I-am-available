import { runAvailabilityCheck } from './LocationTask'; 
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthenticationFlow from './Navigation/AuthenticationFlow';
import MainTabNavigator from './Navigation/MainTabNavigator';
import { StatusBar } from 'expo-status-bar';
import { AppState,Alert } from 'react-native';
import { startBackgroundAvailabilityTask } from './LocationTask';
import * as Location from 'expo-location'; 
import * as TaskManager from 'expo-task-manager';

let lastResume = 0;
const TASK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes


export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  //  Re-check location permission when app comes back
  useEffect(() => {
    if (loggedInUser) {
      setTimeout(async () => {
        console.log('🔔 Sending test notification');
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚨 Test',
            body: 'This is a test local notification',
          },
          trigger: null,
        });
      }, 3000); // 3 seconds after login
    }
  }, [loggedInUser]);

  //  Initial permission check when user logs in
  useEffect(() => {
    if (!loggedInUser) return;

    global.loggedInUserHashtag = loggedInUser.hashtag;
    console.log('🔐 Logged in as:', loggedInUser.hashtag);

    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      const isGranted = status === 'granted';
      setLocationPermissionGranted(isGranted);

      if (isGranted) {
        console.log('🛰️ Starting background availability task...');
        startBackgroundAvailabilityTask();
      } else {
        console.log('🚫 Location permission not granted — task not started');
      }
    })();
  }, [loggedInUser]);
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
