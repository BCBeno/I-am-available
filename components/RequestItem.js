import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { defaultStyles } from "../default-styles"; // Import the default styles
import { MaterialIcons } from "@expo/vector-icons";

const RequestItem = ({ user, onStatusChange }) => {
  const [status, setStatus] = useState(null);

  const handlePress = (action) => {
    setStatus(action); 
    onStatusChange(user.hashtag, action); // Call the function with the user's hashtag and action
  };

  const handleUserPress = () => {
    Alert.alert(
      "User Info",
      `Name: ${user.name}\nHashtag: #${user.hashtag}\nMessage: ${user.message}`,
      [{ text: "OK" }]
    );
  };

  if (status) {
    return null;
  }

  return (
    <TouchableOpacity style={defaultStyles.requestCard} onPress={() => handleUserPress()}>
      <View style={defaultStyles.userInfo}>
        <View style={defaultStyles.avatar}></View>
        <View>
          <Text style={defaultStyles.userName}>{user.name}</Text>
          <Text style={defaultStyles.username}>#{user.hashtag}</Text>
        </View>
      </View>

      <View style={defaultStyles.buttons}>
        <TouchableOpacity
          onPress={() => handlePress("accepted")} // Pass "accepted" action
          style={defaultStyles.acceptBtn}
        >
          <MaterialIcons name="check-box" size={28} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePress("rejected")} // Pass "rejected" action
          style={defaultStyles.rejectBtn}
        >
          <MaterialIcons name="disabled-by-default" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RequestItem;