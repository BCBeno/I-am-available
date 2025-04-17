import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ChatDetailsScreen({ route }) {
  const { chat } = route.params;
  const [newMessage, setNewMessage] = useState(""); 
  const [messages, setMessages] = useState(chat.messages); 

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === chat.participants[0] ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender !== chat.participants[0] && styles.receivedMessageText, 
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const message = {
      sender: chat.participants[0], 
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]); 
    setNewMessage(""); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.chatName}>{chat.participants[1]}</Text>
          <Text style={styles.chatHashtag}>#{chat.hashtag}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline={true}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
    fontWeight: "bold",
  },
  chatHashtag: {
    fontSize: 14,
    color: "gray",
    fontStyle: "italic",
  },
  messagesList: {
    padding: 15,
    flexGrow: 1, 
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#800080", 
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff", 
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  messageText: {
    fontSize: 16,
    color: "#fff", 
  },
  receivedMessageText: {
    color: "#000", 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    maxHeight: 100, 
  },
  sendButton: {
    backgroundColor: "#800080",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});