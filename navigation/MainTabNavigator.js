//MainTabNavigator.js
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import NotificationNavigator from './/NotificationNavigator';
import ChatNavigator from './/ChatNavigator';
import BottomBar from '../components/BottomBar';
import ProfileFlow from './/ProfileFlow';
import AvailabilityNavigator from './AvailabilityNavigator';
import GroupStack from "../screens/group/GroupStack";

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function Tabs({user, setLoggedInUser}) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            tabBar={(props) => (
                <BottomBar
                    {...props}
                    user={user}
                    setLoggedInUser={setLoggedInUser}
                    onTabChange={(name) => {
                        if (name === 'Availability') {
                            setRefreshTrigger((prev) => prev + 1); 
                        }
                    }}
                />
            )}
        >
            <Tab.Screen name="Groups">{() => <GroupStack/>}</Tab.Screen>

            <Tab.Screen name="Availability">
                {() => <AvailabilityNavigator user={user} refreshTrigger={refreshTrigger}/>}
            </Tab.Screen>

            <Tab.Screen name="Notifications">{() => <NotificationNavigator user={user}/>}</Tab.Screen>

            <Tab.Screen name="Chat">
                {() => <ChatNavigator user={user}/>}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default function MainTabNavigator({user, setLoggedInUser}) {
    return (
        <RootStack.Navigator screenOptions={{headerShown: false}}>
            <RootStack.Screen name="Tabs">
                {() => <Tabs user={user} setLoggedInUser={setLoggedInUser}/>}
            </RootStack.Screen>
            <RootStack.Screen name="ProfileFlow">
                {({ route }) => (
                    <ProfileFlow
                    route={route}               
                    user={user}
                    setLoggedInUser={setLoggedInUser}
                    />
                )}
                </RootStack.Screen>
        </RootStack.Navigator>
    );
}
