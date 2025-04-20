import {colors} from "../colors";
import EventsScreen from "./EventsScreen";
import NotificationsScreen from "./NotificationsScreen";
import ChatScreen from "./ChatScreen";
import GroupScreen from "./group/GroupScreen";
import {Provider} from "react-redux";
import store from "../redux/store";
import GroupStack from "./group/GroupStack";


export function Main() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {backgroundColor: colors.primary},
            }}
        >
            <Stack.Screen name="Groups" component={GroupStack}/>
            <Stack.Screen name="Events" component={EventsScreen}/>
            <Stack.Screen name="Notifications" component={NotificationsScreen}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
        </Stack.Navigator>
    );
}