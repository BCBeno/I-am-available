import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import NotificationNavigator from '../Navigation/NotificationNavigator';
import ChatNavigator from '../Navigation/ChatNavigator';
import BottomBar from '../components/BottomBar';
import ProfileFlow from '../Navigation/ProfileFlow';
import AvailabilityNavigator from './AvailabilityNavigator';
import { getUser } from '../Fakedatabase/fakeDB'; 

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function Tabs({ user, setLoggedInUser }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <BottomBar
          {...props}
          user={user}
          setLoggedInUser={setLoggedInUser}
          onTabChange={(name) => {
            if (name === 'Availability') {
              const fresh = getUser(user.hashtag);
              setLoggedInUser(fresh);
              setRefreshTrigger((prev) => prev + 1);
            }
          }}
        />
      )}
    >
      <Tab.Screen name="Home">{() => <HomeScreen user={user} />}</Tab.Screen>

      <Tab.Screen name="Availability">
        {() => <AvailabilityNavigator user={user} refreshTrigger={refreshTrigger} />}
      </Tab.Screen>

      <Tab.Screen name="Notifications">{() => <NotificationNavigator user={user} />}</Tab.Screen>

      <Tab.Screen name="Chat" component={ChatNavigator} />
    </Tab.Navigator>
  );
}

export default function MainTabNavigator({ user, setLoggedInUser }) {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs">
        {() => <Tabs user={user} setLoggedInUser={setLoggedInUser} />}
      </RootStack.Screen>
      <RootStack.Screen name="ProfileFlow">
        {() => <ProfileFlow user={user} setLoggedInUser={setLoggedInUser} />}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
}
