import React from 'react';
import {Modal, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import Button from "./Button";
import {colors} from "../colors";
import {defaultStyles} from "../default-styles";

export default function ConfirmActionModal({modalVisible, setModalVisible, onClick, title}) {
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
                                <Text style={[defaultStyles.title, {textAlign: 'center'}]}>{title}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    gap: '10%'
                                }}>
                                    <Button text={"No"} style={{backgroundColor: colors.mediumGray, width: "45%"}}
                                            onClick={onClose}/>
                                    <Button text={"Yes"} style={{backgroundColor: colors.primary, width: "45%"}}
                                            onClick={onClick}/>
                                </View>
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