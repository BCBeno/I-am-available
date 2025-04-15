import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationCard from "../components/NotificationCard";
import fakeDatabase from "../data/fakeDatabase.json";

export default function NotificationsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 60 }}>
      {fakeDatabase.notifications.map((notification, index) => (
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
  );
}
