import {colors} from "../colors";
import HomeScreen from "./HomeScreen";
import EventsScreen from "./EventsScreen";
import NotificationsScreen from "./NotificationsScreen";
import ChatScreen from "./ChatScreen";


export function Main() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {backgroundColor: colors.primary},
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Events" component={EventsScreen}/>
            <Stack.Screen name="Notifications" component={NotificationsScreen}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
        </Stack.Navigator>
    );
}