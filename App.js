//App.js
import { startBackgroundAvailabilityTask } from './LocationTask';
import React, { useEffect, useState,useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthenticationFlow from './navigation/AuthenticationFlow';
import MainTabNavigator from './navigation/MainTabNavigator';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import store from './redux/store';
import { Provider } from 'react-redux';
import {
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold
} from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { auth } from './firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';
import { loadCompleteUserData } from './data/userDataLoader';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseconfig';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.warn('⚠️ Must use a physical device for Push Notifications');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('⚠️ Permission for push notifications not granted');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('📲 Expo Push Token:', token);
    return token;
  } catch (err) {
    console.error('❌ Failed to register push notifications:', err);
    return null;
  }
}


//  Real-time group availability listener

function setupGroupListeners(user) {
  unsubscribeRefs.current.forEach((unsub) => unsub()); // Clear any old ones
  unsubscribeRefs.current = [];

  const groupMap = user.groups || {};
  Object.keys(groupMap).forEach((groupId) => {
    const groupRef = doc(db, 'groups', groupId);
    let lastNotified = null;

    const unsub = onSnapshot(groupRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.owneravailable) {
        const now = Date.now();
        if (!lastNotified || now - lastNotified > 10 * 60 * 1000) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: `📍 Group ${groupId}`,
              body: `The owner is now available in "${data.name || groupId}"`,
            },
            trigger: null,
          });
          lastNotified = now;
        }
      }
    });

    unsubscribeRefs.current.push(unsub);
  });
}


export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const unsubscribeRefs = useRef([]);

  const [fontsLoaded] = useFonts({
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold
  });

  //  Real-time group availability listener
  function setupGroupListeners(user) {
    unsubscribeRefs.current.forEach((unsub) => unsub());
    unsubscribeRefs.current = [];

    const groupMap = user.groups || {};
    Object.keys(groupMap).forEach((groupId) => {
      const groupRef = doc(db, 'groups', groupId);
      let lastNotified = null;

      const unsub = onSnapshot(groupRef, (snapshot) => {
        const data = snapshot.data();
        if (data?.owneravailable) {
          const now = Date.now();
          if (!lastNotified || now - lastNotified > 10 * 60 * 1000) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: `📍 Group ${groupId}`,
                body: `The owner is now available in "${data.name || groupId}"`,
              },
              trigger: null,
            });
            lastNotified = now;
          }
        }
      });

      unsubscribeRefs.current.push(unsub);
    });
  }

  //  Cleanup all Firestore listeners on unmount
  useEffect(() => {
    return () => {
      unsubscribeRefs.current.forEach((unsub) => unsub());
    };
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("📩 Foreground notification received:", notification);
    });

    return () => subscription.remove();
  }, []);

  //  Auth state watcher
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
          const snap = await getDocs(q);
          const userData = snap.docs[0]?.data();
          if (userData) {
            const fullData = await loadCompleteUserData(userData.hashtag);
            setLoggedInUser(fullData);

            const token = await registerForPushNotificationsAsync();
            if (token) {
              const userRef = doc(db, 'users', fullData.hashtag);
              await updateDoc(userRef, { expoPushToken: token });
            } else {
              console.warn("⚠️ Push token registration failed or unavailable");
            }

            setupGroupListeners(fullData);
          } else {
            console.warn("⚠️ Firebase user found, but no matching Firestore user.");
          }
        } catch (err) {
          console.error("❌ Failed to load user from persisted auth:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  //  Background availability + location
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
        startBackgroundAvailabilityTask(loggedInUser.hashtag);
      } else {
        console.log('🚫 Location permission not granted — task not started');
      }
    })();
  }, [loggedInUser]);

  //  Notification tap handler
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📨 Notification tapped:', response);
    });
    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {!loggedInUser ? (
          <AuthenticationFlow setLoggedInUser={setLoggedInUser} />
        ) : (
          <MainTabNavigator user={loggedInUser} setLoggedInUser={setLoggedInUser} />
        )}
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
