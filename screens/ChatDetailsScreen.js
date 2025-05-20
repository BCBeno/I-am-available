import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import {db} from "../firebaseconfig";
import {collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, arrayUnion, updateDoc, setDoc} from "firebase/firestore";
import defaultAvatar from "../assets/default-avatar.png";
import fakeDB from "../data/fakeDB";

export default function ChatDetailsScreen({route, navigation}) {
    const {chat} = route.params;
    const {currentUser} = route.params;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [otherParticipantPhoto, setOtherParticipantPhoto] = useState(null);
    const [loadingPhoto, setLoadingPhoto] = useState(true);

    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchOtherParticipantPhoto = async () => {
            try {
                const userRef = doc(db, "users", chat.otherParticipantHashtag);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setOtherParticipantPhoto(userSnap.data().photo || null);
                } else {
                    console.error("No such user document!");
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
            } finally {
                setLoadingPhoto(false);
            }
        };

        fetchOtherParticipantPhoto();
    }, [chat.otherParticipantHashtag]);

    useEffect(() => {
        const chatRef = doc(db, "chats", chat.id);

        const unsubscribe = onSnapshot(chatRef, (chatSnap) => {
            if (chatSnap.exists()) {
                const chatData = chatSnap.data();
                setMessages(chatData.messages || []);
            }
        });

        return () => unsubscribe();
    }, [chat.id]);

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({animated: false});
        }
    }, [messages]);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const chatRef = doc(db, "chats", chat.id);
                const chatSnap = await getDoc(chatRef);

                if (!chatSnap.exists()) {
                    await setDoc(chatRef, {
                        id: chat.id,
                        participants: [currentUser.hashtag, chat.otherParticipantHashtag],
                        messages: [],
                        isRead: {
                            [currentUser.hashtag]: true,
                            [chat.otherParticipantHashtag]: false,
                        },
                    });
                    console.log("New chat created!");
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };

        initializeChat();
    }, [chat.id, currentUser.hashtag, chat.otherParticipantHashtag]);

    const handleSend = async () => {
        if (newMessage.trim() === "") return;

        const message = {
            sender: currentUser.hashtag,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        try {
            const chatRef = doc(db, "chats", chat.id);

            await updateDoc(chatRef, {
                messages: arrayUnion(message),
                [`isRead.${chat.otherParticipantHashtag}`]: false,
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const renderMessage = ({item}) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === currentUser.hashtag ? styles.sentMessage : styles.receivedMessage,
            ]}
        >
            <Text
                style={[
                    styles.messageText,
                    item.sender !== currentUser.hashtag && styles.receivedMessageText,
                ]}
            >
                {item.text}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri: otherParticipantPhoto || Image.resolveAssetSource(defaultAvatar).uri,
                    }}
                    style={styles.avatar}
                />
                <View>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Profile", {hashtag: chat.otherParticipantHashtag})
                        }
                    >
                        <Text style={styles.chatName}>{chat.otherParticipantName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.chatHashtag}>#{chat.otherParticipantHashtag}</Text>
                </View>
            </View>

            <View style={{flex: 1}}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, index) => `${item.timestamp}-${index}`}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
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
