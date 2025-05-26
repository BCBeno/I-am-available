import React, {useState, useEffect} from "react";
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Button} from "react-native";
import {defaultStyles} from "../default-styles";
import {useNavigation} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import defaultAvatar from "../assets/default-avatar.png";
import {collection, query, where, onSnapshot, doc, getDoc, updateDoc, deleteDoc} from "firebase/firestore";
import {db} from "../firebaseconfig";

export default function ChatScreen({route}) {
    const {currentUser} = route.params;
    const [originalChatData, setOriginalChatData] = useState([]);
    const [chatData, setChatData] = useState([]);
    const [participantNames, setParticipantNames] = useState({});
    const [participantPhotos, setParticipantPhotos] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("participants", "array-contains", currentUser.hashtag));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chats = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setOriginalChatData(chats);
            setChatData(chats);

            const names = {};
            const photos = {};
            for (const chat of chats) {
                const otherParticipant = chat.participants.find(
                    (participant) => participant !== currentUser.hashtag
                );
                if (otherParticipant && !names[otherParticipant]) {
                    try {
                        const userRef = doc(db, "users", otherParticipant);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            const userData = userSnap.data();
                            names[otherParticipant] = userData.name || "Unknown User";
                            photos[otherParticipant] = userData.photo || null;
                        } else {
                            names[otherParticipant] = "Unknown User";
                            photos[otherParticipant] = null;
                        }
                    } catch (error) {
                        console.error("Error fetching user document:", error);
                        names[otherParticipant] = "Unknown User";
                        photos[otherParticipant] = null;
                    }
                }
            }
            setParticipantNames(names);
            setParticipantPhotos(photos);
        });

        return () => unsubscribe();
    }, [currentUser.hashtag]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setChatData(originalChatData);
        } else {
            const filteredChats = originalChatData.filter((chat) => {
                const otherParticipant = chat.participants.find(
                    (participant) => participant !== currentUser.hashtag
                );
                const participantName = participantNames[otherParticipant] || "Unknown User";
                return participantName.toLowerCase().includes(query.toLowerCase());
            });
            setChatData(filteredChats);
        }
    };

    const handleRemovePress = (chat) => {
        Alert.alert(
            "Delete Chat",
            "Are you sure you want to delete this chat? Every message will be removed for both users.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Remove the chat from Firestore
                            const chatRef = doc(db, "chats", chat.id);
                            await deleteDoc(chatRef);

                            // Update the local state
                            const updatedChatData = chatData.filter((item) => item.id !== chat.id);
                            setChatData(updatedChatData);
                            setOriginalChatData(updatedChatData);
                        } catch (error) {
                            console.error("Error deleting chat:", error);
                        }
                    },
                },
            ]
        );
    };

    const renderChatItem = ({item}) => {
        const otherParticipant = item.participants.find(
            (participant) => participant !== currentUser.hashtag
        );

        const isUnread = item.isRead && !item.isRead[currentUser.hashtag];

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={async () => {
                    try {
                        const chatRef = doc(db, "chats", item.id);
                        await updateDoc(chatRef, {
                            [`isRead.${currentUser.hashtag}`]: true,
                        });

                        const updatedChatData = chatData.map((chat) =>
                            chat.id === item.id
                                ? {
                                    ...chat,
                                    isRead: {
                                        ...chat.isRead,
                                        [currentUser.hashtag]: true,
                                    },
                                }
                                : chat
                        );
                        setChatData(updatedChatData);
                        setOriginalChatData(updatedChatData);

                        navigation.navigate("ChatDetails", {
                            chat: {
                                ...item,
                                otherParticipantName: participantNames[otherParticipant] || "Unknown User",
                                otherParticipantHashtag: otherParticipant,
                            },
                        });
                    } catch (error) {
                        console.error("Error updating chat as read:", error);
                    }
                }}
            >
                <View style={styles.chatInfo}>
                    <Image
                        source={{
                            uri: participantPhotos[otherParticipant] || Image.resolveAssetSource(defaultAvatar).uri,
                        }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text
                            style={[
                                styles.chatName,
                                isUnread && styles.unreadChatName,
                            ]}
                        >
                            {String(participantNames[otherParticipant] || "Unknown User")}
                        </Text>
                        <Text style={styles.chatHashtag}>#{otherParticipant}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => handleRemovePress(item)}>
                    <MaterialIcons name="delete" size={24} color="red"/>
                </TouchableOpacity>
            </TouchableOpacity>


        );
    };

    return (
        <View style={defaultStyles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <MaterialIcons name="search" size={24} color="gray"/>
            </View>
            <FlatList
                data={chatData}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
                contentContainerStyle={styles.chatList}
            />
            <Button title="Debug Profile" onPress={
                () => {
                    navigation.navigate("Profile", {userHashtag: "ben1"})
                }
            }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    chatList: {
        paddingBottom: 20,
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    chatInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        backgroundColor: "#ccc",
        borderRadius: 20,
        marginRight: 10,
    },
    chatName: {
        fontSize: 16,
    },
    chatHashtag: {
        fontSize: 14,
        color: "gray",
        fontStyle: "italic",
    },
    unreadChatName: {
        fontWeight: "bold",
        fontSize: 17,
    },
});
