import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../Screens/ChatScreen";
import ChatDetailsScreen from "../Screens/ChatDetailsScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import StudentAvailabilityDetailsScreen from "../Screens/StudentAvailabilityDetailsScreen";
import LocationDetailsScreen from '../Screens/LocationDetailsScreen';


const Stack = createStackNavigator();

const ChatNavigator = ({ user }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ChatHome"
        component={ChatScreen}
        initialParams={{ currentUser: user }} // Pass user as initialParams
      />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
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