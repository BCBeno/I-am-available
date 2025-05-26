import {useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {FlatList, StyleSheet, Text, TextInput, View} from "react-native";
import {defaultStyles} from "../../default-styles";
import BackButton from "../../components/BackButton";
import {colors} from "../../colors";
import Button from "../../components/Button";
import {db} from '../../firebaseconfig';
import {useDispatch, useSelector} from "react-redux";
import {updateGroup} from "../../redux/slices/groupSlice";
import {addDoc, collection, setDoc} from "firebase/firestore";

export default function GroupAnnouncementScreen() {
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");

    const navigation = useNavigation();

    const route = useRoute();
    const {groupId} = route.params;

    const group = useSelector(state => state.groups.items).find(group => group.id === groupId);

    const sendAnnouncement = async () => {
        const announcement = {
            announcement: "New announcement from group",
            subject: subject,
            dateTime: new Date().toISOString(),
            group: `/groups/${groupId}`,
            title: title,
            type: "announcement"
        }

        const notificationCol = collection(db, 'notifications');
        await addDoc(notificationCol, announcement);

        if (subject.trim() && title.trim()) {
            setSubject("");
            setTitle("");
            navigation.goBack();
            alert("Announcement sent!");
        } else {
            alert("Please enter both title and message.");
        }
    };

    return (
        <View style={defaultStyles.container}>
            <BackButton/>
            <View style={styles.content} boxShadow={defaultStyles.dropShadow}>
                <View>
                    <Text style={defaultStyles.title}>Post in Group</Text>
                    <Text style={defaultStyles.subtitle}>{group.groupHashtag}</Text>
                </View>

                <TextInput style={defaultStyles.input}
                           placeholder={"Announcement Title"}
                           value={title}
                           onChangeText={(text) => setTitle(text)}
                />
                <TextInput
                    style={[
                        defaultStyles.input,
                        defaultStyles.text,
                        {
                            height: 100,
                            borderRadius: 20,
                            textAlignVertical: "top",
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                        },
                    ]}
                    placeholder="Write your message here..."
                    value={subject}
                    onChangeText={(text) => setSubject(text)}
                />

                <Button text="Send Announcement" onClick={sendAnnouncement}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 0,
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
        borderRadius: 20,
        backgroundColor: colors.absoluteWhite,
        gap: 20,
    },
});
