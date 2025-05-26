import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {ScrollView} from "react-native-gesture-handler";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseconfig";
import defaultAvatar from "../assets/default-avatar.png";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useSelector} from "react-redux";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const {userHashtag} = route.params; // profile hashtag

    // current logged-in user from Redux
    const currentUser = useSelector((state) => state.user.data);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser || !currentUser.hashtag) {
                console.error("Current user not found in store");
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch target user data
                const userRef = doc(db, "users", userHashtag);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    console.error("No such user document!");
                    setLoading(false);
                    return;
                }
                const userData = userSnap.data();

                // 2. Prepare role hashtags
                const roleHashtags = Array.isArray(userData.roles)
                    ? userData.roles.map((r) => r.hashtag)
                    : [];
                if (!roleHashtags.includes(userHashtag)) roleHashtags.push(userHashtag);

                // 3. Fetch currentUser groups (refs)
                const currentUserRef = doc(db, "users", currentUser.hashtag);
                const currentUserSnap = await getDoc(currentUserRef);
                const currentUserGroups = currentUserSnap.exists() && Array.isArray(currentUserSnap.data().groups)
                    ? currentUserSnap.data().groups.map((g) => g.groupReference)
                    : [];

                // 4. Fetch target user's owned groups, filter by public or membership
                const groupsRef = collection(db, "groups");
                const groupsQuery = query(
                    groupsRef,
                    where("ownerId", "==", userHashtag)
                );
                const groupsSnap = await getDocs(groupsQuery);
                const filteredGroups = groupsSnap.docs
                    .map((doc) => ({id: doc.id, ...doc.data()}))
                    .filter((g) => g.public || currentUserGroups.includes(`/groups/${g.id}`));

                // 5. Fetch availabilities for the target user's roles
                let availabilities = [];
                if (roleHashtags.length) {
                    const availRef = collection(db, "availabilities");
                    const chunks = [];
                    // Firestore 'in' supports max 10
                    for (let i = 0; i < roleHashtags.length; i += 10) {
                        chunks.push(roleHashtags.slice(i, i + 10));
                    }
                    const docs = [];
                    for (const chunk of chunks) {
                        const q = query(availRef, where("roleHashtag", "in", chunk));
                        const snap = await getDocs(q);
                        docs.push(...snap.docs);
                    }
                    availabilities = docs
                        .map((d) => d.data())
                        .filter((a) => currentUserGroups.includes(`/groups/${a.group}`));
                }

                setProfile({...userData, groups: filteredGroups, availabilities});
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser, userHashtag]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#800080"/>
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

    const goToChat = () => {
        const chatId = [currentUser.hashtag, userHashtag].sort().join("_");
        navigation.navigate("ChatDetails", {
            chat: {id: chatId, otherParticipantHashtag: userHashtag, otherParticipantName: profile.name},
            currentUser: {hashtag: currentUser.hashtag},
        });
    };

    const navigateToGroupDetails = (groupId) => {
        navigation.navigate('GroupDetails', {groupId});
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={{uri: profile.photo || Image.resolveAssetSource(defaultAvatar).uri}}
                    style={styles.avatar}
                />
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileHashtag}>#{userHashtag}</Text>
                <TouchableOpacity style={styles.messageButton} onPress={goToChat}>
                    <Text style={styles.messageButtonText}>Send message</Text>
                </TouchableOpacity>
            </View>

            {/* Availability Section */}
            <View style={styles.separator}/>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Availability</Text>
                {profile.availabilities.map((a, i) => (
                    <View key={i} style={styles.availabilityItem}>
                        <View style={styles.rowCenter}>
                            <MaterialIcons name="access-time" size={20} color="#800080"/>
                            <Text style={styles.availabilityTime}>{a.time}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                            <View style={styles.rowCenter}>
                                <MaterialIcons name="calendar-today" size={20} color="#800080"/>
                                {a.days ? (
                                    <View style={styles.daysContainer}>
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => {
                                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                            const active = a.days.includes(days[idx]);
                                            return (
                                                <Text key={idx} style={[styles.day, active && styles.activeDay]}>
                                                    {d}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                ) : (
                                    <Text style={styles.availabilityDate}>{a.date}</Text>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('StudentAvailabilityDetails', {availability: a})}>
                                <Text style={styles.detailsLink}>Details →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            {/* Public Groups Section */}
            <View style={styles.separator}/>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Public Groups</Text>
                {
                    profile.groups.map((g) => (
                        <View key={g.id} style={styles.groupItem}>
                            <Text style={styles.groupName}>{g.name}</Text>
                            <Text style={styles.groupId}>#{g.id}</Text>
                            <View style={styles.rowBetween}>
                                <View style={styles.rowCenter}>
                                    <MaterialIcons name="group" size={20} color="gray"/>
                                    <Text style={styles.groupMembers}>{g.groupMembers?.length || 0} members</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigateToGroupDetails(g.id)}>
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
    container: {flex: 1, padding: 20, paddingTop: 80},
    profileHeader: {alignItems: "center", marginBottom: 20},
    avatar: {width: 80, height: 80, borderRadius: 40, backgroundColor: "#ccc", marginBottom: 10},
    profileName: {fontSize: 18, fontWeight: "bold"},
    profileHashtag: {fontSize: 14, color: "gray", fontStyle: "italic"},
    messageButton: {backgroundColor: "#800080", padding: 12, borderRadius: 25, marginTop: 10},
    messageButtonText: {color: "#fff", fontWeight: "bold"},
    separator: {height: 1, backgroundColor: "#ddd", marginVertical: 15},
    section: {marginBottom: 20},
    sectionTitle: {fontSize: 16, fontWeight: "bold", marginBottom: 10, textAlign: "center"},
    availabilityItem: {marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10},
    rowCenter: {flexDirection: "row", alignItems: "center"},
    rowBetween: {flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
    availabilityTime: {marginLeft: 5, fontSize: 14},
    daysContainer: {flexDirection: "row", marginLeft: 5},
    day: {marginHorizontal: 2, fontSize: 14, color: "gray"},
    activeDay: {color: "#800080", fontWeight: "bold"},
    availabilityDate: {marginLeft: 5, fontSize: 14, fontWeight: "bold"},
    detailsLink: {fontSize: 14, fontWeight: "bold", color: "black"},
    groupItem: {marginBottom: 10},
    groupName: {fontSize: 14, fontWeight: "bold"},
    groupId: {fontSize: 12, color: "gray", marginBottom: 5},
    groupMembers: {fontSize: 12, color: "gray"},
    loadingContainer: {flex: 1, justifyContent: "center", alignItems: "center"},
    errorContainer: {flex: 1, justifyContent: "center", alignItems: "center"},
    errorText: {color: "red", fontSize: 16},
});
