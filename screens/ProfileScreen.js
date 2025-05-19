import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseconfig";
import defaultAvatar from "../assets/default-avatar.png";

export default function ProfileScreen({ route, navigation }) {
    const { hashtag, currentUser } = route.params; // Retrieve currentUser from route.params
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch the current user's groups
                const currentUserRef = doc(db, "users", currentUser.hashtag);
                const currentUserSnap = await getDoc(currentUserRef);

                if (!currentUserSnap.exists()) {
                    console.error("No such current user document!");
                    setLoading(false);
                    return;
                }

                const currentUserData = currentUserSnap.data();
                const currentUserGroups = Array.isArray(currentUserData.groups)
                    ? currentUserData.groups.map((group) => group.groupReference)
                    : [];

                // Fetch the profile user data
                const userRef = doc(db, "users", hashtag);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    // --- Get all role hashtags ---
                    let roleHashtags = [];
                    if (Array.isArray(userData.roles)) {
                        roleHashtags = userData.roles.map(role => role.hashtag);
                    }
                    // Also include the main hashtag if not present
                    if (!roleHashtags.includes(hashtag)) {
                        roleHashtags.push(hashtag);
                    }

                    // Query groups where the other user is the owner
                    const groupsRef = collection(db, "groups");
                    const groupsQuery = query(
                        groupsRef,
                        where("ownerId", "==", `${hashtag}`) // Other user is the owner
                    );
                    const groupsSnap = await getDocs(groupsQuery);
                    const filteredGroups = groupsSnap.docs
                        .map((doc) => ({ id: doc.id, ...doc.data() }))
                        .filter(
                            (group) =>
                                group.public || // Group is public
                                currentUserGroups.includes(`/groups/${group.id}`) // Current user is a member
                        );
                    // --- Fetch availabilities for all role hashtags ---
                    let filteredAvailabilities = [];
                    if (roleHashtags.length > 0) {
                        const availabilitiesRef = collection(db, "availabilities");
                        // Firestore 'in' operator supports up to 10 values
                        const availabilitiesQuery = query(
                            availabilitiesRef,
                            where("roleHashtag", "in", roleHashtags)
                        );
                        const availabilitiesSnap = await getDocs(availabilitiesQuery);
                        filteredAvailabilities = availabilitiesSnap.docs
                            .map((doc) => doc.data())
                            .filter((availability) =>
                                currentUserGroups.includes(`/groups/${availability.group}`)
                            );
                    }
                    setProfile({
                        ...userData,
                        availabilities: filteredAvailabilities || [],
                        groups: filteredGroups || [],
                    });
                } else {
                    console.error("No such user document!");
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [hashtag, currentUser.hashtag]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#800080" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: profile.photo || Image.resolveAssetSource(defaultAvatar).uri }}
                    style={styles.avatar}
                />
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileHashtag}>#{hashtag}</Text>
                <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => {
                        const routes = navigation.getState().routes;
                        const previousScreen = routes[routes.length - 2]?.name;
                        
                        if (previousScreen !== "ChatDetails") {
                            const chatId = [currentUser.hashtag, profile.hashtag].sort().join("_");

                            navigation.navigate("ChatDetails", {
                                chat: {
                                    id: chatId,
                                    otherParticipantHashtag: profile.hashtag,
                                    otherParticipantName: profile.name,
                                },
                                currentUser: {
                                    hashtag: currentUser.hashtag,
                                },
                            });
                        } else {
                            navigation.goBack();
                        }
                    }}
                >
                    <Text style={styles.messageButtonText}>Send message</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Availability</Text>
                {Array.isArray(profile.availabilities) && profile.availabilities.map((availability, index) => (
                    <View key={index} style={styles.availabilityItem}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MaterialIcons name="access-time" size={20} color="#800080" />
                            <Text style={styles.availabilityTime}>{availability.time}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialIcons name="calendar-today" size={20} color="#800080" />
                                {availability.days ? (
                                    <View style={styles.daysContainer}>
                                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
                                            const fullDayNames = [
                                                "Sunday",
                                                "Monday",
                                                "Tuesday",
                                                "Wednesday",
                                                "Thursday",
                                                "Friday",
                                                "Saturday",
                                            ];

                                            const isActive = availability.days.includes(fullDayNames[index]);

                                            return (
                                                <Text
                                                    key={index}
                                                    style={[styles.day, isActive && styles.activeDay]}
                                                >
                                                    {day}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                ) : (
                                    <Text style={styles.availabilityDate}>{availability.date}</Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={{ marginLeft: "auto" }}
                                onPress={() =>
                                    navigation.navigate("StudentAvailabilityDetails", {
                                        availability: availability, // Pass the availability object directly
                                    })
                                }
                            >
                                <Text style={styles.detailsLink}>Details →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.separator} />
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Public Groups</Text>
                {Array.isArray(profile.groups) && profile.groups.map((group) => (
                    <View key={group.id} style={styles.groupItem}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <Text style={styles.groupId}>#{group.id}</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialIcons name="group" size={20} color="gray" />
                                <Text style={styles.groupMembers}>
                                    {group.groupMembers?.length || 0} members
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.detailsLink}>Details →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        marginHorizontal: 5,
        padding: 25,
        paddingTop: 30,
        marginBottom: 25,
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        backgroundColor: "#ccc",
        borderRadius: 40,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    profileHashtag: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
        fontStyle: "italic",
    },
    messageButton: {
        backgroundColor: "#800080",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 50,
    },
    messageButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    availabilityItem: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    availabilityTime: {
        fontSize: 14,
        marginLeft: 5,
        color: "#000",
    },
    availabilityDays: {
        fontSize: 14,
        marginLeft: 5,
        color: "#800080",
        fontWeight: "bold",
    },
    detailsLink: {
        fontSize: 14,
        color: "black",
        fontWeight: "bold",
        marginLeft: 180,
    },
    groupItem: {
        marginBottom: 10,
        paddingBottom: 15,
    },
    groupName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    groupId: {
        fontSize: 12,
        color: "gray",
    },
    groupMembers: {
        fontSize: 12,
        color: "gray",
        marginBottom: 5,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginVertical: 10,
    },
    daysContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    day: {
        fontSize: 14,
        color: "gray",
        marginHorizontal: 2,
    },
    activeDay: {
        color: "#800080",
        fontWeight: "bold",
    },
    availabilityDate: {
        fontSize: 14,
        color: "#000",
        fontWeight: "bold",
    },
    totalMembers: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
    },
});