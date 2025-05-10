import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import RequestItem from "../components/RequestItem";
import { defaultStyles } from "../default-styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebaseconfig";
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";

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

    const handleStatusChange = async (id, action) => {
        try {
            const groupDocRef = doc(db, "groups", groupInfo.id.split("/").pop());
            const notificationDocRef = doc(db, "notifications", notification.id);

            const groupDoc = await getDoc(groupDocRef);
            if (!groupDoc.exists()) {
                console.error("Group not found.");
                return;
            }

            const groupData = groupDoc.data();
            const joinRequests = Array.isArray(groupData.joinRequests) ? groupData.joinRequests : [];

            const userRequest = joinRequests.find((request) => request.hashtag === id);
            if (!userRequest) {
                console.error(`User request with ID ${id} not found in joinRequests.`);
                return;
            }

            await updateDoc(groupDocRef, {
                joinRequests: arrayRemove(userRequest),
            });

            const notificationDoc = await getDoc(notificationDocRef);
            if (!notificationDoc.exists()) {
                console.error("Notification not found.");
                return;
            }

            const notificationData = notificationDoc.data();
            const studentRequests = Array.isArray(notificationData.studentRequests)
                ? notificationData.studentRequests
                : [];

            const updatedStudentRequests = studentRequests.filter(
                (request) => request.hashtag !== id
            );

            await updateDoc(notificationDocRef, {
                studentRequests: updatedStudentRequests,
                dateTime: new Date().toISOString(),
            });

            if (action === "accepted") {
                await updateDoc(groupDocRef, {
                    groupMembers: arrayUnion({
                        userReference: `/users/${userRequest.hashtag}`,
                        userRole: `${userRequest.hashtag}-member`,
                        notifications: false,
                    }),
                });
            }

            setStudentRequests((prevRequests) =>
                prevRequests.filter((request) => request.hashtag !== id)
            );

            if (updatedStudentRequests.length === 0) {
                await deleteDoc(notificationDocRef);
            }

            console.log(`User ${id} ${action} successfully.`);
        } catch (error) {
            console.error("Error updating group requests:", error);
        }
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

                <ScrollView
                    style={defaultStyles.requestList}
                    showsVerticalScrollIndicator={false}
                >
                    {studentRequests.map((user) => (
                        <RequestItem
                            key={user.hashtag}
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
