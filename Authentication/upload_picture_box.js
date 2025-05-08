import {useRoute, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ScreenWrapper from './ScreenWrapper';
import defaultphoto from '../assets/defaulticon.png';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const ProfilePictureUploadBox = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params || {}; // Get user data from navigation params

    const [photoBase64, setPhotoBase64] = useState(null);

    // Log the received user data when the component mounts
    useEffect(() => {
        console.log("📸 ProfilePictureUploadBox mounted. Received user data:", user);
        if (!user?.name || !user?.hashtag || !user?.password || !user?.email) { // Added check for email
            Alert.alert('Error', 'User data is incomplete. Please sign up again.');
            navigation.navigate('SignUp');
        }
    }, [user, navigation]); // Added dependencies

    const handleFileChange = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets[0]?.base64) {
            const base64String = result.assets[0].base64;
            setPhotoBase64(base64String);
            console.log("🖼️ Photo selected and base64 set."); // Log when photo is selected
        } else {
             console.log("🖼️ Photo selection cancelled or failed."); // Log if selection is cancelled or fails
        }
    };

    const handleSignUp = async () => {
        console.log("👆 'Sign Up' button pressed."); // Log when button is pressed

        if (!photoBase64) {
            Alert.alert('Wait!', 'Please select a photo before signing up.');
            console.log("🛑 Photo not selected, returning early."); // Log if returning early
            return;
        }

        console.log("✅ Passed photo check, attempting Firebase signup..."); // Log before Firebase calls

        const finalUser = {
            ...user,
            photo: `data:image/jpeg;base64,${photoBase64}`,
        };

        // Log the data we are about to send to Firebase Auth
        console.log("📧 Email to use:", finalUser.email);
        console.log("🔑 Password to use:", finalUser.password ? "********" : "No password provided"); // Mask password

        const auth = getAuth();

        try {
            console.log("✅ Successfully entered the try block."); // <-- Add this line!
            console.log("➡️ Attempting createUserWithEmailAndPassword...");

            console.log("➡️ Attempting createUserWithEmailAndPassword...");
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                finalUser.email, // Ensure email is here
                finalUser.password // Ensure password is here
            );
             console.log("✅ createUserWithEmailAndPassword succeeded.");

            console.log("➡️ Attempting updateProfile...");
            await updateProfile(userCredential.user, {
                displayName: finalUser.name, // Ensure name is here
                photoURL: finalUser.photo, // Ensure photo is here
            });
            console.log("✅ updateProfile succeeded.");

            console.log('🎉 Firebase user created successfully:', userCredential.user.email);
            Alert.alert('Success', 'User registered successfully!');
            navigation.navigate('SignIn');
        } catch (error) {
            console.error('❌ Firebase registration error:', error); // This is your original catch
            Alert.alert('Registration failed', error.message);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                style={{flex: 1, width: '100%'}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.uploadBox}>
                            <Text style={styles.text}>Profile Picture</Text>

                            <View style={styles.imageContainer}>
                                <Image
                                    source={
                                        photoBase64
                                            ? {uri: `data:image/jpeg;base64,${photoBase64}`}
                                            : defaultphoto
                                    }
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </View>

                            <TouchableOpacity onPress={handleFileChange}>
                                <Text style={styles.selectPhotoLink}>Select Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={styles.loginLink}>
                                Already registered? <Text style={styles.loginBold}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 30,
    },
    uploadBox: {
        width: 300,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '400',
        color: '#555',
        marginBottom: 10,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    selectPhotoLink: {
        color: '#000',
        fontSize: 16,
        textDecorationLine: 'underline',
        fontFamily: 'Poppins, sans-serif',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#80004d',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
    },
    loginLink: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
    loginBold: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default ProfilePictureUploadBox;
