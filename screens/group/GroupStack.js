import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GroupScreen from "./GroupScreen";
import GroupDetailsScreen from "./GroupDetailsScreen";
import groupAnnouncementScreen from "./GroupAnnouncementScreen";

const Stack = createNativeStackNavigator();

export default function GroupStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="GroupList" component={GroupScreen}/>
            <Stack.Screen name="GroupDetails" component={GroupDetailsScreen}/>
            <Stack.Screen name="MakeAnouncement" component={groupAnnouncementScreen}/>
        </Stack.Navigator>
    );
}
