import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import AvailabilityScreen from '../Screens/AvailabilityScreen';
import NotificationNavigator from '../Navigation/NotificationNavigator';
import ChatNavigator from '../Navigation/ChatNavigator';
import BottomBar from '../components/BottomBar';
import ProfileFlow from './ProfileFlow';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function Tabs({ user }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <BottomBar {...props} />}>
      <Tab.Screen name="Home">{() => <HomeScreen user={user} />}</Tab.Screen>
      <Tab.Screen name="Availability">{() => <AvailabilityScreen user={user} />}</Tab.Screen>
      <Tab.Screen name="Notifications">{() => <NotificationNavigator user={user} />}</Tab.Screen>
      <Tab.Screen name="Chat" >{() => <ChatNavigator user={user} />}</Tab.Screen>
    </Tab.Navigator>
  );
}
export default function MainTabNavigator({ user, setLoggedInUser }) {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs">
        {() => <Tabs user={user} />}
      </RootStack.Screen>
      <RootStack.Screen name="ProfileFlow">
        {() => <ProfileFlow user={user} setLoggedInUser={setLoggedInUser} />}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
}