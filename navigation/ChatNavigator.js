import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../Screens/ChatScreen";
import ChatDetailsScreen from "../Screens/ChatDetailsScreen";
import ProfileScreen from "../Screens/ProfileScreen";

const Stack = createStackNavigator();

const ChatNavigator = ({user}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatHome">
        {(props) => <ChatScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;