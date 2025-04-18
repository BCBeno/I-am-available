import {StyleSheet, TouchableOpacity, View} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {colors} from "../colors";

export default function BottomBar({state, navigation}) {
    const screenToIcon = {
        Home: "group",
        Availability: "event-available",
        Notifications: "notifications",
        Chat: "chat",
    };

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const icon = screenToIcon[route.name];

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        }}
                    >
                        <MaterialIcons
                            name={icon}
                            size={36}
                            color="#fff"
                            style={[
                                styles.icon,
                                isFocused && styles.selected,
                                index === 0 ? styles.iconLeft : index === state.routes.length - 1 ? styles.iconRight : null
                            ]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.primary,
    },
    icon: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    iconLeft: {
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
    },
    iconRight: {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    selected: {
        backgroundColor: colors.tertiary,
    },
});