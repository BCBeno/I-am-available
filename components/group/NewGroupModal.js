import React from 'react';
import {Button, Modal, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import AddButton from "../AddButton";
import NewGroupForm from "./NewGroupForm";

export default function NewGroupModal({modalVisible, setModalVisible, edit, group}) {
    const onClose = () => {
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <AddButton onPress={() => setModalVisible(true)} style={styles.button}></AddButton>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <NewGroupForm onClose={onClose} group={group} edit={edit}/>
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
    modalContent: {
        width: "85%",
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
    },
});