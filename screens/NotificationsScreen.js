import {defaultStyles} from "../default-styles";
import {Text, View} from "react-native";
import GroupRequests from "./GroupRequests";

export default function NotificationsScreen() {
    return (
        <View style={defaultStyles.container}>
            <GroupRequests/>
        </View>
    );

}