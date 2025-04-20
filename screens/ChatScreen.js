import React, {useState} from "react";
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image} from "react-native";
import {defaultStyles} from "../default-styles";
import {useNavigation} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import defaultAvatar from "../assets/default-avatar.png";
import fakeDB from "../data/fakeDB";


export default function ChatScreen({route}) {
    const {currentUser} = route.params; // Access currentUser from route.params
    const [user, setUser] = useState(fakeDB.users.filter((u) => u.id === currentUser.id)[0]);
    const [originalChatData, setOriginalChatData] = useState(user.chats); // Store the original chat data
    const [chatData, setChatData] = useState(user.chats); // Store the filtered chat data
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setChatData(originalChatData); // Reset to the original chat data
        } else {
            const filteredChats = originalChatData.filter((chat) =>
                chat.participants[1].toLowerCase().includes(query.toLowerCase())
            );
            setChatData(filteredChats);
        }
    };

    const handleRemovePress = (chat) => {
        Alert.alert(
            "Delete Chat",
            "Are you sure you want to delete this chat?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedChatData = chatData.filter((item) => item.id !== chat.id);
                        setChatData(updatedChatData);
                        setOriginalChatData(updatedChatData); // Update the original chat data as well
                    },
                },
            ]
        );
    };

    const renderChatItem = ({item}) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
                const updatedChatData = chatData.map((chat) =>
                    chat.id === item.id ? {...chat, isRead: 1} : chat
                );
                setChatData(updatedChatData);
                setOriginalChatData(updatedChatData); // Update the original chat data as well
                navigation.navigate("ChatDetails", {chat: item});
            }}
        >
            <View style={styles.chatInfo}>
                <Image source={{uri: Image.resolveAssetSource(defaultAvatar).uri}} style={styles.avatar}/>
                <View>
                    <Text
                        style={[
                            styles.chatName,
                            item.isRead === 0 && styles.unreadChatName,
                        ]}
                    >
                        {fakeDB.users.find((u) => u.hashtag === item.hashtag)?.name}
                    </Text>
                    <Text style={styles.chatHashtag}>#{item.hashtag}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleRemovePress(item)}>
                <MaterialIcons name="delete" size={24} color="red"/>
            </TouchableOpacity>
        </TouchableOpacity>
    );

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