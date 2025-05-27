//MainTabNavigator.js
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import NotificationNavigator from './/NotificationNavigator';
import ChatNavigator from './/ChatNavigator';
import BottomBar from '../components/BottomBar';
import ProfileFlow from './/ProfileFlow';
import AvailabilityNavigator from './AvailabilityNavigator';
import GroupStack from "../screens/group/GroupStack";
import {useDispatch} from "react-redux";
import {fetchUser} from "../redux/slices/userSlice";
import GroupDetailsScreen from "../screens/group/GroupDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";
import StudentAvailabilityDetailsScreen from "../screens/StudentAvailabilityDetailsScreen";

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
            <Tab.Screen name="Groups" component={GroupStack} />
            <Tab.Screen name="Availability">
                {() => (
                    <AvailabilityNavigator
                        user={user}
                        setLoggedInUser={setLoggedInUser}
                        refreshTrigger={refreshTrigger}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen name="Notifications">
                {() => <NotificationNavigator user={user}/>}
            </Tab.Screen>
            <Tab.Screen name="Chat">
                {() => <ChatNavigator user={user}/>}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default function MainTabNavigator({user, setLoggedInUser}) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(fetchUser(user.hashtag));
        }
    }, [dispatch, user]);

    return (
        <RootStack.Navigator screenOptions={{headerShown: false}}>
            <RootStack.Screen
                name="Tabs"
                children={() => (
                    <Tabs
                        key={user?.photo}
                        user={user}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
            />
            <RootStack.Screen
                name="ProfileFlow"
                children={({route}) => (
                    <ProfileFlow
                        route={route}
                        user={user}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
            />
            <RootStack.Screen name="GroupDetails" component={GroupDetailsScreen}/>
            <RootStack.Screen name="Profile" component={ProfileScreen}/>
            <RootStack.Screen name="ChatDetails" component={ChatDetailsScreen}/>
            <RootStack.Screen name="StudentAvailabilityDetails" component={StudentAvailabilityDetailsScreen}/>
        </RootStack.Navigator>
    );
}
