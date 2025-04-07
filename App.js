import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import EventsScreen from "./screens/EventsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ChatScreen from "./screens/ChatScreen";
import BottomBar from "./components/BottomBar";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{
                headerShown: false // Isso remove o header de todas as telas
            }} tabBar={(props) => <BottomBar {...props} />}>
                <Tab.Screen name="Home" component={HomeScreen}/>
                <Tab.Screen name="Events" component={EventsScreen}/>
                <Tab.Screen name="Notifications" component={NotificationsScreen}/>
                <Tab.Screen name="Chat" component={ChatScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}