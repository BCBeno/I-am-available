//AvailabilityNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import OwnerAvailabilityDetailsScreen from '../screens/OwnerAvailabilityDetailsScreen';
import CreateAvailabilityScreen from '../screens/CreateAvailabilityScreen';
import LocationDetailsScreen from '../screens/LocationDetailsScreen';

const Stack = createStackNavigator();

export default function AvailabilityNavigator({refreshTrigger, setLoggedInUser, user}) {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="AvailabilityMain">
                {({navigation, route}) => (
                    <AvailabilityScreen
                        user={user}
                        navigation={navigation}
                        route={route}
                        refreshTrigger={refreshTrigger}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
            </Stack.Screen>


            <Stack.Screen name="OwnerAvailabilityDetails">
                {(props) => (
                    <OwnerAvailabilityDetailsScreen
                        {...props}
                        user={user}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
            </Stack.Screen>


            <Stack.Screen name="CreateAvailability">
                {(props) => (
                    <CreateAvailabilityScreen
                        {...props}
                        user={user}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
            </Stack.Screen>


            <Stack.Screen name="LocationDetails" component={LocationDetailsScreen}/>
        </Stack.Navigator>
    );
}
  