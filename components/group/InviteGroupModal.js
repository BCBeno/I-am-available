import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import Button from "../Button";
import {colors} from "../../colors";
import {defaultStyles} from "../../default-styles";
import {collection, getDoc, updateDoc, doc} from "firebase/firestore";
import {db} from "../../firebaseconfig";

export default function JoinGroupModal({modalVisible, setModalVisible, group}) {

    const [username, setUsername] = useState('');

    const sendInvite = async () => {
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            alert(`User not found with username: ${username}`);
            onClose()
            return;
        }

        const user = docSnap.data();

        const alreadyInvited = (user.invites || []).some(invite =>
            (invite?.groupReference?.replace('/groups/', '') === group.id)
        );

        if (alreadyInvited) {
            alert(`User already invited to this group`);
            onClose()
            return;
        }
        const newInvites = [...(user.invites || []), {
            groupReference: `/groups/${group.id}`,
        }];

        await updateDoc(docRef, {invites: newInvites});

        alert(`Invite sent to ${username}`);
        onClose();
    };

    const onClose = () => {
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                width: "85%",
                                padding: 20,
                                backgroundColor: 'white',
                                borderRadius: 20,
                                alignItems: 'center',
                                gap: 20,
                            }}>
                                <Text
                                    style={[defaultStyles.title, {textAlign: 'center'}]}>{`Enter the username`}</Text>
                                <TextInput
                                    style={[
                                        defaultStyles.input,
                                        defaultStyles.text,
                                        {
                                            borderRadius: 20,
                                            textAlignVertical: "top",
                                        }
                                    ]}
                                    placeholderTextColor={colors.mediumGray}
                                    onChangeText={(text) => setUsername(text)}
                                />
                                <Button text={"Invite"}
                                        style={{backgroundColor: colors.primary, width: "100%", marginTop: 10}}
                                        onClick={() => sendInvite()}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        marginLeft: "50%",
        marginBottom: "2.5%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});