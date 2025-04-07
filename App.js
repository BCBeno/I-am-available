import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import GroupScreen from "./screens/group/GroupScreen";
import EventsScreen from "./screens/EventsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ChatScreen from "./screens/ChatScreen";
import BottomBar from "./components/BottomBar";
import Store from "./redux/store";
import {Provider} from "react-redux";
import GroupStack from "./screens/group/GroupStack";
import {useFonts} from "expo-font";
import {
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold
} from "@expo-google-fonts/poppins";

const Tab = createBottomTabNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_200ExtraLight,
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold
    });

    return (
        <Provider store={Store}>
            <NavigationContainer>
                <Tab.Navigator screenOptions={{
                    headerShown: false // Isso remove o header de todas as telas
                }} tabBar={(props) => <BottomBar {...props} />}>
                    <Tab.Screen name="Groups" component={GroupStack}/>
                    <Tab.Screen name="Events" component={EventsScreen}/>
                    <Tab.Screen name="Notifications" component={NotificationsScreen}/>
                    <Tab.Screen name="Chat" component={ChatScreen}/>
                </Tab.Navigator>
            </NavigationContainer>
        </Provider>
    );
}