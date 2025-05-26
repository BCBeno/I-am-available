import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";
import NotificationCard from "../components/NotificationCard";
import TopBar from "../components/TopBar";
import { format } from "date-fns";

export default function NotificationsScreen({ user, setLoggedInUser }) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserAndNotifications = async () => {
        try {
            setLoading(true);
            const userQuery = query(collection(db, "users"), where("hashtag", "==", user.hashtag));
            const userSnap = await getDocs(userQuery);

            if (!userSnap.empty) {
                const userData = userSnap.docs[0].data();
                setUserData(userData);

                // Fetch system notifications
                const systemNotificationsQuery = query(
                    collection(db, "notifications"),
                    where("group", "==", "system")
                );
                const systemNotificationsSnap = await getDocs(systemNotificationsQuery);

                const systemNotifications = systemNotificationsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Fetch group request notifications
                const groupNotificationsQuery = query(
                    collection(db, "notifications"),
                    where("type", "==", "groupRequests")
                );
                const groupNotificationsSnap = await getDocs(groupNotificationsQuery);

                const groupNotifications = await Promise.all(
                    groupNotificationsSnap.docs.map(async (notificationDoc) => {
                        const notificationData = notificationDoc.data();
                        const groupId = notificationData.group.split("/").pop();

                        // Fetch the group document to check ownership
                        const groupDocRef = doc(db, "groups", groupId);
                        const groupDoc = await getDoc(groupDocRef);

                        if (groupDoc.exists()) {
                            const groupData = groupDoc.data();
                            // Use ownerId instead of ownerRoleHashtag if needed
                            if (groupData.ownerRoleHashtag === user.hashtag) {
                                return {
                                    id: notificationDoc.id,
                                    ...notificationData,
                                };
                            }
                        }
                        return null; // Exclude notifications for groups the user does not own
                    })
                );

                // Filter out null values (notifications the user does not own)
                const filteredGroupNotifications = groupNotifications.filter((notification) => notification !== null);

                // Fetch announcements from groups the user is joined in
                const userGroups = Array.isArray(userData.groups) ? userData.groups : [];
                const groupIds = userGroups.map((group) => group.groupReference.split("/").pop());

                let announcements = [];
                if (groupIds.length > 0) {
                    const announcementsQuery = query(
                        collection(db, "notifications"),
                        where("type", "==", "announcement"),
                        where("group", "in", groupIds.map((id) => `/groups/${id}`))
                    );
                    const announcementsSnap = await getDocs(announcementsQuery);

                    announcements = announcementsSnap.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                }

                // Combine all notifications
                const allNotifications = [
                    ...systemNotifications,
                    ...filteredGroupNotifications,
                    ...announcements,
                ].sort((a, b) => {
                    const dateA = new Date(a.dateTime);
                    const dateB = new Date(b.dateTime);
                    return dateB - dateA;
                });

                setNotifications(allNotifications);
            } else {
                console.error("User not found!");
            }
        } catch (error) {
            console.error("Error fetching user or notifications:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const createGroupRequestNotifications = async (userHashtag) => {
        try {
            const groupsQuery = query(
                collection(db, "groups"),
                where("ownerRoleHashtag", "==", `${userHashtag}`)
            );
            const groupsSnap = await getDocs(groupsQuery);

            for (const groupDoc of groupsSnap.docs) {
                const groupData = groupDoc.data();
                const joinRequests = Array.isArray(groupData.joinRequests) ? groupData.joinRequests : [];

                if (joinRequests.length > 0) {
                    const enrichedRequests = await Promise.all(
                        joinRequests.map(async (request) => {
                            const userDocRef = doc(db, "users", request.hashtag);
                            const userDoc = await getDoc(userDocRef);

                            if (userDoc.exists()) {
                                const userData = userDoc.data();
                                return {
                                    ...request,
                                    name: userData.name,
                                };
                            } else {
                                console.error(`User with hashtag ${request.hashtag} not found.`);
                                return request;
                            }
                        })
                    );

                    const notificationsQuery = query(
                        collection(db, "notifications"),
                        where("group", "==", `/groups/${groupDoc.id}`),
                        where("type", "==", "groupRequests")
                    );
                    const notificationsSnap = await getDocs(notificationsQuery);

                    if (notificationsSnap.empty) {
                        await addDoc(collection(db, "notifications"), {
                            group: `/groups/${groupDoc.id}`,
                            type: "groupRequests",
                            title: `New requests to join your group.`,
                            subject: groupData.name,
                            dateTime: new Date().toISOString(),
                            studentRequests: enrichedRequests,
                        });
                    } else {
                        const notificationDocRef = notificationsSnap.docs[0].ref;
                        const existingNotification = notificationsSnap.docs[0].data();

                        const existingRequests = existingNotification.studentRequests || [];
                        const mergedRequests = [
                            ...existingRequests,
                            ...enrichedRequests.filter(
                                (newRequest) =>
                                    !existingRequests.some(
                                        (existingRequest) => existingRequest.hashtag === newRequest.hashtag
                                    )
                            ),
                        ];

                        await updateDoc(notificationDocRef, {
                            studentRequests: mergedRequests,
                            dateTime: new Date().toISOString(),
                        });
                    }
                } else {
                    const notificationsQuery = query(
                        collection(db, "notifications"),
                        where("group", "==", `/groups/${groupDoc.id}`),
                        where("type", "==", "groupRequests")
                    );
                    const notificationsSnap = await getDocs(notificationsQuery);

                    if (!notificationsSnap.empty) {
                        const notificationDocRef = notificationsSnap.docs[0].ref;
                        await deleteDoc(notificationDocRef);
                    }
                }
            }
        } catch (error) {
            console.error("Error creating or updating group request notifications:", error);
        }
    };

    useEffect(() => {
        fetchUserAndNotifications();
        createGroupRequestNotifications(user.hashtag);
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserAndNotifications();
        createGroupRequestNotifications(user.hashtag);
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#800080" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* TOP BAR MODIFICATIONS TO MATCH THE FIGMA DESIGN */}
            <TopBar
                style={{ paddingTop: "15%" }}
                setText={() => {}}
                setLoggedInUser={setLoggedInUser}
                hideSearch={true}
                user={user}
            />
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {notifications.map((notification) => (
                    <NotificationCard
                        key={notification.id}
                        title={notification.title}
                        subject={notification.subject}
                        group={notification.group.startsWith("/groups/") ? `#${notification.group.split("/").pop()}` : notification.group}
                        dateTime={format(new Date(notification.dateTime), "dd-MM-yyyy HH:mm")}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    scrollView: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
});
