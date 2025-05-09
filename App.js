// App.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence,getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseconfig'; // Import the config object

import {startBackgroundAvailabilityTask} from './LocationTask';
import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native'; // Import View and Text for loading screen
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationFlow from './navigation/AuthenticationFlow';
import MainTabNavigator from './navigation/MainTabNavigator';
import {StatusBar} from 'expo-status-bar';
import * as Location from 'expo-location';
import store from "./redux/store";
import {Provider} from "react-redux";
import {
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold
} from "@expo-google-fonts/poppins";
import {useFonts} from "expo-font";

// 👇 Import Firebase initialization functions and config


let lastResume = 0;
const TASK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes


export default function App() {
    // State for initialized Firebase services and loading status
    const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
    const [firebaseAuth, setFirebaseAuth] = useState(null);
    const [firebaseDb, setFirebaseDb] = useState(null);
    const [firebaseApp, setFirebaseApp] = useState(null);

    // Existing states
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

    // Font loading
    const [fontsLoaded] = useFonts({
        Poppins_200ExtraLight,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold
    });

    // 👇 EFFECT TO INITIALIZE FIREBASE ONCE AFTER COMPONENT MOUNTS
    useEffect(() => {
        const initFirebase = async () => {
            try {
              console.error("✨ Attempting to initialize Firebase App inside useEffect...");
              const app = initializeApp(firebaseConfig);
              console.error("✅ Firebase App initialized in useEffect.");
              setFirebaseApp(app);
          
              // Wait a bit to allow native modules to load (especially for Hermes-based dev builds)
              await new Promise(resolve => setTimeout(resolve, 100));
          
              console.error("🔐 Attempting to initialize Firebase Auth with persistence...");
              const auth = initializeAuth(app, {
                persistence: getReactNativePersistence(ReactNativeAsyncStorage),
              });
              console.error("✅ Firebase Auth initialized with AsyncStorage persistence.");
              setFirebaseAuth(auth);
          
              const db = getFirestore(app);
              setFirebaseDb(db);
              console.error("✅ Firestore initialized.");
          
              setIsFirebaseInitialized(true);
              console.error("🎉 Firebase initialization complete!");
            } catch (error) {
              console.error("❌ Firebase initialization error:", error);
            }
          };
          

        initFirebase(); // Call the async init function

    }, []); // Empty dependency array means this effect runs only ONCE after the initial render


    // ... Existing effects for notifications and location (they might need firebaseAuth/db eventually)

    // Loading state: Show loading until fonts AND firebase are initialized
    if (!fontsLoaded || !isFirebaseInitialized) {
        console.error("⏳ Loading fonts or firebase...");
        // You can replace this with a proper loading screen component
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading app resources...</Text>
          </View>
        );
    }

    // Now render the main application structure
    console.error("✅ Fonts and Firebase loaded. Rendering main app structure.");
    return (
        <Provider store={store}>
            <NavigationContainer>
                {/* You will need to pass firebaseAuth and firebaseDb down through props or Context */}
                {/* ProfilePictureUploadBox needs `auth`. */}
                {!loggedInUser ? (
                    // Update AuthenticationFlow to receive firebaseAuth and setLoggedInUser
                    <AuthenticationFlow firebaseAuth={firebaseAuth} setLoggedInUser={setLoggedInUser}/>
                ) : (
                    // Update MainTabNavigator to receive user, setLoggedInUser, firebaseAuth, firebaseDb
                    <MainTabNavigator user={loggedInUser} setLoggedInUser={setLoggedInUser} firebaseAuth={firebaseAuth} firebaseDb={firebaseDb}/>
                )}
                <StatusBar style="auto"/>
            </NavigationContainer>
        </Provider>
    );
}