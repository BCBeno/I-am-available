import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { defaultStyles } from "../default-styles";
import { useNavigation, useRoute } from "@react-navigation/native";

const AnnouncementDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const notification = route.params?.notification;

  return (
    <View style={defaultStyles.container}>
      <TouchableOpacity
        style={defaultStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text>← Back</Text>
      </TouchableOpacity>

      <View style={defaultStyles.bigCard}>
        <Text style={defaultStyles.title}>{notification.title}</Text>
        <Text style={defaultStyles.groupName}>{notification.subject}</Text>
        <Text style={defaultStyles.groupId}>{notification.group}</Text>
        <ScrollView showsVerticalScrollIndicator={false}
        >
          <Text style={defaultStyles.announcement}>
            {notification.announcement}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default AnnouncementDetails;