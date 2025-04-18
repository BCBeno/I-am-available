import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { defaultStyles } from "../default-styles";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { chats } from "../data/fakeDatabase.json";
import defaultAvatar from "../assets/default-avatar.png";
import TopBar from "../components/TopBar";

export default function ChatScreen({ user }) {
  const [originalChatData, setOriginalChatData] = useState(chats); // Keep the original data
  const [chatData, setChatData] = useState(chats); // Filtered data for display
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setChatData(originalChatData); // Reset to the updated original data
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
            const updatedChatData = originalChatData.filter((item) => item.id !== chat.id);
            setOriginalChatData(updatedChatData); // Update the original data
            setChatData(updatedChatData); // Update the displayed data
          },
        },
      ]
    );
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        const updatedChatData = originalChatData.map((chat) =>
          chat.id === item.id ? { ...chat, isRead: 1 } : chat
        );
        setOriginalChatData(updatedChatData);
        setChatData(updatedChatData);
        navigation.navigate("ChatDetails", { chat: item });
      }}
    >
      <View style={styles.chatInfo}>
        <Image source={{ uri: Image.resolveAssetSource(defaultAvatar).uri }} style={styles.avatar} />
        <View>
          <Text
            style={[
              styles.chatName,
              item.isRead === 0 && styles.unreadChatName,
            ]}
          >
            {item.participants[1]}
          </Text>
          <Text style={styles.chatHashtag}>#{item.hashtag}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleRemovePress(item)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar profileImage={user.photo} />
      {/* TopBar */}

      {/* Search Bar Overlay */}
      <View style={styles.searchBarOverlay}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <MaterialIcons name="search" size={24} color="gray" />
        </View>
      </View>

      {/* Chat List */}
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
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchBarOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 100,
    zIndex: 1,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  chatList: {
    paddingTop: 10,
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
    shadowOffset: { width: 0, height: 2 },
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