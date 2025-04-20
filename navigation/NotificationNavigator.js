import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import NotificationsScreen from "../screens/NotificationsScreen";
import GroupRequests from "../screens/GroupRequests";
import AnnouncementDetails from "../screens/AnnouncementDetails";

const Stack = createStackNavigator();

const NotificationNavigator = ({user}) => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="NotificationsHome">
                {(props) => <NotificationsScreen {...props} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="GroupRequests" component={GroupRequests}/>
            <Stack.Screen name="AnnouncementDetails" component={AnnouncementDetails}/>
        </Stack.Navigator>
    );
};

export default NotificationNavigator;
