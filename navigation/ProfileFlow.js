import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfilePage from '../screens/ProfilePage';

const Stack = createStackNavigator();
const ProfileFlow = ({user, setLoggedInUser}) => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="ProfilePage">
            {(props) => <ProfilePage {...props} user={user} setLoggedInUser={setLoggedInUser}/>}
        </Stack.Screen>
    </Stack.Navigator>
);

export default ProfileFlow;