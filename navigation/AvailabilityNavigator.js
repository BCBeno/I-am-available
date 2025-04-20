import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import OwnerAvailabilityDetailsScreen from '../screens/OwnerAvailabilityDetailsScreen';
import CreateAvailabilityScreen from '../screens/CreateAvailabilityScreen';
import LocationDetailsScreen from '../screens/LocationDetailsScreen';

const Stack = createStackNavigator();

export default function AvailabilityNavigator({user, refreshTrigger}) { // ADD refreshTrigger
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {/* 1) Main list */}
            <Stack.Screen name="AvailabilityMain">
                {({navigation, route}) => (
                    <AvailabilityScreen
                        user={user}
                        navigation={navigation}
                        route={route}
                        refreshTrigger={refreshTrigger} //   defined
                    />
                )}
            </Stack.Screen>

            {/* 2) Details view */}
            <Stack.Screen
                name="OwnerAvailabilityDetails"
                component={OwnerAvailabilityDetailsScreen}
                initialParams={{user}}
            />

            {/* 3) Create new availability */}
            <Stack.Screen
                name="CreateAvailability"
                component={CreateAvailabilityScreen}
                initialParams={{user}}
            />

            {/* 4) Location details */}
            <Stack.Screen
                name="LocationDetails"
                component={LocationDetailsScreen}
            />
        </Stack.Navigator>
    );
}
