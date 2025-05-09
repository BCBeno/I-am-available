//App.js
import {startBackgroundAvailabilityTask} from './LocationTask';
import React, {useEffect, useState} from 'react';
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

let lastResume = 0;
const TASK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes


export default function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

    const [fontsLoaded] = useFonts({
        Poppins_200ExtraLight,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold
    });

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
            const {status} = await Location.getForegroundPermissionsAsync();
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
        <Provider store={store}>
            <NavigationContainer>
                {!loggedInUser ? (
                    <AuthenticationFlow setLoggedInUser={setLoggedInUser}/>
                ) : (
                    <MainTabNavigator user={loggedInUser} setLoggedInUser={setLoggedInUser}/>
                )}
                <StatusBar style="auto"/>
            </NavigationContainer>
        </Provider>
    );
}
