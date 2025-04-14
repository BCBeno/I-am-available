import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationCard from "../components/NotificationCard";
import fakeDatabase from "../data/fakeDatabase.json"; // Import the fake database

export default function NotificationsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
      {fakeDatabase.notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          title={notification.title}
          subject={notification.subject}
          group={notification.group}
          dateTime={notification.dateTime}
          onPressDetails={() =>
            navigation.navigate("GroupRequests", { notification })
          }
        />
      ))}
    </ScrollView>
  );
}
