import { StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../colors";

//DO NOT TOUCH
//  DEBUGGED IT SO THAT WHEN PRESSING ANY OF THE TAB BUTTONS THE LOGGED IN USER'S INFORMATION IS REFRESHED SO WE DON'T HAVE CASES WHERE YOU DELETE AN ENTRY AND THEN IT SHOWS UP BACK OUT OF NOWHERE and other things

// onTabChange-this one gets rid of tabs having a "nested stack with its own state" EXPLINATION:When you press a tab, React navigation does not reset that nested stack by default. So if you press into a "Details" screen (or oe that takes you further into the Tab), delete an entry, and go back via the tab bar — you see the old stack unless it is manually reset or updated.

//MY CASE:When you're already on the Availability tab and press its button again, React navigation does not remount or re-render the tab’s stack or component.

//Those added things "help" reset it when going from a tab to another to deal with the "bug" completly you have to :Manually force a refresh when pressing the tab — even if it's already focused
//The fix done to the "OnPress" SHOULD FIX ALL BUG RELATED TO TABS i hope just add them to your assigned tab

export default function BottomBar({ state, navigation, onTabChange }) {
  const screenToIcon = {
    Groups: "group",
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

              if (!event.defaultPrevented) {
                //  Force a remount (refresh stack) via onTabChange
                if (typeof onTabChange === 'function') {
                  onTabChange(route.name); // triggers refreshTrigger++
                }

                //  Always navigate even if already focused
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
