import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { defaultStyles } from "../default-styles"; // Import the default styles
import { MaterialIcons } from '@expo/vector-icons';


const RequestItem = ({ user }) => {
  const [status, setStatus] = useState(null);

  const handlePress = (newStatus) => {
    setStatus(newStatus); // Set the status and hide the buttons
  };

  return (
    <View style={defaultStyles.requestCard}>
      {/* User Info */}
      <View style={defaultStyles.userInfo}>
        <View style={defaultStyles.avatar}></View>
        <View>
          <Text style={defaultStyles.userName}>{user.name}</Text>
          <Text style={defaultStyles.username}>@{user.username}</Text>
        </View>
      </View>

      {/* Buttons or Placeholder */}
      <View style={defaultStyles.buttons}>
        {!status ? (
          <>
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
          </>
        ) : (
          // Placeholder to maintain the card size
          <View style={defaultStyles.buttonPlaceholder}></View>
        )}
      </View>

      {/* Status */}
      {status && (
        <Text
          style={
            status === "accepted"
              ? defaultStyles.accepted
              : defaultStyles.rejected
          }
        >
          {status === "accepted" ? "Accepted" : "Rejected"}
        </Text>
      )}
    </View>
  );
};

export default RequestItem;
