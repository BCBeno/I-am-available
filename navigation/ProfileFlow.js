//ProfileFlow.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createStackNavigator();

const ProfileFlow = ({user, setLoggedInUser}) => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProfileScreen">
                {(props) => (
                    <UserProfileScreen
                        {...props}
                        user={user}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
};


export default ProfileFlow;
