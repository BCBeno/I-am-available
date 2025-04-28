import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";
import fakeDB, {getUser} from "../data/fakeDB";
import {MaterialIcons} from "@expo/vector-icons";
import {ScrollView} from "react-native-gesture-handler";
import defaultAvatar from "../assets/default-avatar.png";

export default function ProfileScreen({route, navigation}) {
    const {hashtag} = route.params;
    const profile = fakeDB.users.find((user) => user.hashtag === hashtag);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={{uri: profile.photo || Image.resolveAssetSource(defaultAvatar).uri}}
                    style={styles.avatar}
                />
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileHashtag}>#{profile.hashtag}</Text>
                <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => {
                        const routes = navigation.getState().routes;
                        const previousScreen = routes[routes.length - 2]?.name;

                        if (previousScreen !== "ChatDetails")
                            navigation.navigate("ChatDetails", {chat})
                        else
                            navigation.goBack(); 
                    }}
                >
                    <Text style={styles.messageButtonText}>Send message</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.separator}/>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Availability</Text>
                {profile.availabilities.map((availability, index) => (
                    <View key={index} style={styles.availabilityItem}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <MaterialIcons name="access-time" size={20} color="#800080"/>
                            <Text style={styles.availabilityTime}>{availability.time}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center", 
                            }}
                        >
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <MaterialIcons name="calendar-today" size={20} color="#800080"/>
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
                                style={{marginLeft: "auto"}} // Pushes the button to the right
                                onPress={() =>
                                    navigation.navigate("StudentAvailabilityDetails", {
                                        user: profile,
                                        availabilityIndex: index,
                                    })
                                }
                            >
                                <Text style={styles.detailsLink}>Details →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.separator}/>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Public Groups</Text>
                {profile.groups.map((group) => (
                    <View key={group.id} style={styles.groupItem}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <Text style={styles.groupId}>#{group.hashtag}</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <MaterialIcons name="group" size={20} color="gray"/>
                                <Text style={styles.groupMembers}>
                                    {group.members.length} members
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
        marginLeft: 180, // Pushes the text to the right
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
});