import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import RequestItem from "../components/RequestItem";
import { defaultStyles } from "../default-styles";
import { useNavigation, useRoute } from "@react-navigation/native";

const GroupRequests = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const notification = route.params?.notification;
  const [studentRequests, setStudentRequests] = useState(
    notification?.studentRequests || []
  );

  const groupInfo = notification
    ? {
        name: notification.subject,
        id: notification.group,
      }
    : {
        name: "Unknown Group",
        id: "unknown-group",
      };

  const handleStatusChange = (id, newStatus) => {
    setStudentRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
  };

  return (
    <View style={defaultStyles.container}>
      <TouchableOpacity
        style={defaultStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text>← Back</Text>
      </TouchableOpacity>

      <View style={defaultStyles.bigCard}>
        <Text style={defaultStyles.title}>
          There are {studentRequests.length} new requests to join your group
        </Text>
        <Text style={defaultStyles.groupName}>{groupInfo.name}</Text>
        <Text style={defaultStyles.groupId}>{groupInfo.id}</Text>

        <ScrollView style={defaultStyles.requestList}
          showsVerticalScrollIndicator={false}>
          {studentRequests.map((user) => (
            <RequestItem
              key={user.id}
              user={user}
              onStatusChange={handleStatusChange} 
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default GroupRequests;
