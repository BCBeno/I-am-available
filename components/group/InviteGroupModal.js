import React from 'react';
import {Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import Button from "../Button";
import {colors} from "../../colors";
import {defaultStyles} from "../../default-styles";
import {useDispatch, useSelector} from "react-redux";

export default function JoinGroupModal({modalVisible, setModalVisible}) {

    const sendInvite = () => {
        // send the invite to the user
        onClose()
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
                                    multiline
                                    numberOfLines={4}/>
                                <Button text={"Invite"}
                                        style={{backgroundColor: colors.primary, width: "100%", marginTop: 10}}
                                        onClick={sendInvite}/>
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