import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NotificationCard from "../components/NotificationCard";

const notifications = [
  {
    title: "New announcement from your group",
    subject: "Desenvolvimento Multiplataforma",
    group: "dmgroup-A-2024-2",
    dateTime: "01/01/2025 - 14:00",
  },
  {
    title: "Upcoming Deadline",
    subject: "Project Submission",
    group: "projgroup-X-2024-2",
    dateTime: "03/01/2025 - 23:59",
  },
  // Add more if needed
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
      {notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          {...notification}
          onPressDetails={() =>
            navigation.navigate("GroupRequests", { notification })
          }
        />
      ))}
    </ScrollView>
  );
}
