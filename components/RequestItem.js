import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { defaultStyles } from "../default-styles"; // Import the default styles
import { MaterialIcons } from "@expo/vector-icons";

const RequestItem = ({ user, onStatusChange }) => {
  const [status, setStatus] = useState(null);

  const handlePress = (newStatus) => {
    setStatus(newStatus); 
    onStatusChange(user.id, newStatus); 
  };

  if (status) {
    return null;
  }

  return (
    <View style={defaultStyles.requestCard}>
      <View style={defaultStyles.userInfo}>
        <View style={defaultStyles.avatar}></View>
        <View>
          <Text style={defaultStyles.userName}>{user.name}</Text>
          <Text style={defaultStyles.username}>@{user.username}</Text>
        </View>
      </View>

      <View style={defaultStyles.buttons}>
        <TouchableOpacity
          onPress={() => handlePress("accepted")}
          style={defaultStyles.acceptBtn}
        >
          <MaterialIcons name="check-box" size={28} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePress("rejected")}
          style={defaultStyles.rejectBtn}
        >
          <MaterialIcons name="disabled-by-default" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RequestItem;
