import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsScreen from '../screens/NotificationsScreen';
import GroupRequests from '../screens/GroupRequests';

const Stack = createStackNavigator();

const NotificationNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NotificationsHome" component={NotificationsScreen} />
      <Stack.Screen name="GroupRequests" component={GroupRequests} />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
