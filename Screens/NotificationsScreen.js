import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationCard from "../components/NotificationCard";
import TopBar from "../components/TopBar";

export default function NotificationsScreen({ user }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TopBar profileImage={user.photo} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {user.notifications.map((notification, index) => (
          <NotificationCard
            key={index}
            title={notification.title}
            subject={notification.subject}
            group={notification.group}
            dateTime={notification.dateTime}
            onPressDetails={() =>
              navigation.navigate(
                notification.type === "announcement"
                  ? "AnnouncementDetails"
                  : "GroupRequests",
                { notification }
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});
