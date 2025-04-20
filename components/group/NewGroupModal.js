import React from 'react';
import {Button, Modal, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import AddButton from "../AddButton";
import NewGroupForm from "./NewGroupForm";

export default function NewGroupModal({modalVisible, setModalVisible}) {
    const onClose = () => {
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <AddButton onPress={() => setModalVisible(true)} style={styles.button}></AddButton>
            <Modal
                animationType="fade" // Tipo de animação do modal
                transparent={true} // Define se o fundo será transparente
                visible={modalVisible} // Controla a visibilidade do modal
                onRequestClose={onClose} // Fecha o modal ao pressionar o botão "back" no Android
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <NewGroupForm onClose={onClose}/>
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