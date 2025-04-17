import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import EventsScreen from "./screens/EventsScreen";
import BottomBar from "./components/BottomBar";
import NotificationNavigator from "./navigation/NotificationNavigator";
import ChatNavigator from "./navigation/ChatNavigator"; // Import ChatNavigator

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Notifications" component={NotificationNavigator} />
        <Tab.Screen name="Chat" component={ChatNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
