import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';
import {isHashtagTaken} from '../data/fakeDB';
import uuid from 'react-native-uuid';
import {DEV_MODE} from '../config';
import SHA256 from 'crypto-js/sha256';


const SignUpBox = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [userHashtag, setUserHashtag] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (pass) => {
        const minLength = 8;
        const hasNumber = /\d/.test(pass);
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasSpecial = /[^A-Za-z0-9]/.test(pass);
        return (
            pass.length >= minLength &&
            hasNumber &&
            hasUpper &&
            hasLower &&
            hasSpecial
        );
    };

    const handleSignUp = async () => {
        if (!name || !userHashtag || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (!DEV_MODE && !validatePassword(password)) {
            Alert.alert(
                'Weak Password',
                'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.'
            );
            return;
        }

        const alreadyExists = isHashtagTaken(userHashtag);
        if (alreadyExists) {
            Alert.alert('Error', 'That hashtag is already taken.');
            return;
        }

        const hashedPassword = SHA256(password).toString();

        const newUser = {
            jwttoken:'',
            name,
            hashtag: userHashtag,
            password: hashedPassword,
            photo: '',
            profiles: [],
            roles: [],
            groups: [],
            availabilities: [],
            chats: [],
            notifications: []
        };


        Keyboard.dismiss();
        setTimeout(() => {
            navigation.navigate('ProfilePicture', newUser);
        }, 100);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.signUpBox}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter User Name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>User Hashtag</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Hashtag"
                        value={userHashtag}
                        onChangeText={setUserHashtag}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="********"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="********"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Next →</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                        setTimeout(() => {
                            navigation.navigate('SignIn');
                        }, 100);
                    }}
                >
                    <Text style={styles.bottomText}>
                        Already registered? <Text style={styles.signUpLink}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 30,
    },
    signUpBox: {
        width: 300,
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        fontFamily: 'Poppins',
    },
    input: {
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 15,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#80004d',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    bottomText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 50,
    },
    signUpLink: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default SignUpBox;

/*
NEW USER DATABASE ENTRY:
{
  id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // generated with uuid.v4()
  name: 'Alex Santos',                        // user input
  hashtag: 'alex123',                         // user input
  password: '"e7cf3ef4f17c3999a94f2c6f612e8a888e5eab8f07fbb5c80b5e9766c8fdf9c3"                 // user input encrypted
  photo: '',                                  // empty by default (will be added in profile picture screen) SAVED IN BASE64
  profiles: [],                               // initialized empty
  roles: [],                                  // initialized empty
  groups: [],                                 // initialized empty
  availabilities: [],                         // initialized empty
  chats: [],                                  // initialized empty
}

*/ 