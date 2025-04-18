import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../screens/ChatScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatHome" component={ChatScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;