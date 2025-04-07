import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import RequestItem from "../components/RequestItem";
import { defaultStyles } from "../default-styles"; // Import the default styles

const GroupRequests = () => {
  const groupInfo = {
    name: "Desenvolvimento Multiplataforma",
    id: "dmgroup-A-2024-2",
  };

  const [requests, setRequests] = useState([
    { id: 1, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 2, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 3, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 4, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 5, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 6, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 7, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 8, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 9, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
    { id: 10, name: "Lucas Alvarenga Lopes", username: "lucasalopes" },
  ]);

  return (
    <View style={defaultStyles.container}>
      <TouchableOpacity style={defaultStyles.backButton}>
        <Text>← Back</Text>
      </TouchableOpacity>

      {/* Big Card */}
      <View style={defaultStyles.bigCard}>
        <Text style={defaultStyles.title}>
          There are {requests.length} new requests to join your group
        </Text>
        <Text style={defaultStyles.groupName}>{groupInfo.name}</Text>
        <Text style={defaultStyles.groupId}>{groupInfo.id}</Text>

        {/* Scrollable Requests */}
        <ScrollView style={defaultStyles.requestList}>
          {requests.map((user) => (
            <RequestItem key={user.id} user={user} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default GroupRequests;
