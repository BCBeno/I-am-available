import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import ChatScreen from "../screens/ChatScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StudentAvailabilityDetailsScreen from "../screens/StudentAvailabilityDetailsScreen";
import LocationDetailsScreen from '../screens/LocationDetailsScreen';


const Stack = createStackNavigator();

const ChatNavigator = ({user}) => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="ChatHome"
                component={ChatScreen}
                initialParams={{currentUser: user}} // Pass user as initialParams
            />
            <Stack.Screen name="ChatDetails" component={ChatDetailsScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen
                name="StudentAvailabilityDetails"
                component={StudentAvailabilityDetailsScreen}
            />
            <Stack.Screen
                name="LocationDetails"
                component={LocationDetailsScreen}
            />
        </Stack.Navigator>

    );
};

export default ChatNavigator;