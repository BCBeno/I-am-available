import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import Button from "../Button";
import {colors} from "../../colors";
import {defaultStyles} from "../../default-styles";
import {useDispatch, useSelector} from "react-redux";
import {updateGroupInFirestore} from "../../redux/slices/groupSlice";

export default function JoinGroupModal({modalVisible, setModalVisible, groupId}) {

    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.items).find(group => group.id === groupId);
    const user = useSelector(state => state.user.data);

    const [message, setMessage] = useState('');

    const sendRequest = () => {
        const request = {
            hashtag: user.hashtag,
            message: message,
        }

        if (group?.joinRequests?.some(r => r.hashtag === user.hashtag)) {
            alert("You already sent a request to join this group");
            onClose()
            return;
        }

        const newGroup = {
            ...group,
            joinRequests: [...group?.joinRequests, request],
        }

        dispatch(updateGroupInFirestore(newGroup));

        onClose()
        alert("Request sent!")
    }

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
                                    style={[defaultStyles.title, {textAlign: 'center'}]}>{`Send a request to join the group ${group.groupHashtag}`}</Text>
                                <TextInput
                                    style={[
                                        defaultStyles.input,
                                        defaultStyles.text,
                                        {
                                            height: 100,
                                            borderRadius: 20,
                                            textAlignVertical: "top",
                                        }
                                    ]}
                                    onChangeText={(text) => setMessage(text)}
                                    placeholder={"Type a message"}
                                    placeholderTextColor={colors.mediumGray}
                                    multiline
                                    numberOfLines={4}/>
                                <Button text={"Request"}
                                        style={{backgroundColor: colors.primary, width: "100%", marginTop: 10}}
                                        onClick={sendRequest}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
;

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