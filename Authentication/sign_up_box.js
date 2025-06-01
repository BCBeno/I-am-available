// sign_up_box.js
import { db } from '../firebaseconfig'; 
import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';
import {DEV_MODE} from '../config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const SignUpBox = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [userHashtag, setUserHashtag] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(''); 

    // Function to show custom alert message
    const showMessage = (title, message) => {
        setModalMessage(`${title}\n\n${message}`);
        setModalVisible(true);
    };

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

    const validateEmail = (emailToCheck) => { 
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(emailToCheck); // Validate the already lowercased email
    };
    
    const handleSignUp = async () => {
        // Convert email to lowercase for all internal logic and storage
        const lowercasedEmail = email.toLowerCase();

        if (!name || !lowercasedEmail || !userHashtag || !password || !confirmPassword) {
          showMessage('Error', 'Please fill out all fields.');
          return;
        }
        if (!validateEmail(lowercasedEmail)) { // Validate the lowercased email
          showMessage('Invalid Email', 'Please enter a valid email address.');
          return;
        }
      
        if (password !== confirmPassword) {
          showMessage('Error', 'Passwords do not match.');
          return;
        }
      
        if (!DEV_MODE && !validatePassword(password)) {
          showMessage(
            'Weak Password',
            'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.'
          );
          return;
        }
      
        //  Check if hashtag is already taken
        try {
          const hashtagDoc = await getDoc(doc(db, 'hashtags', userHashtag));
          if (hashtagDoc.exists()) {
            showMessage('Hashtag Taken', 'That hashtag is already taken. Please choose another.');
            return;
          }
        } catch (error) {
          console.error('❌ Error checking hashtag uniqueness:', error);
          showMessage('Error', 'Something went wrong checking hashtag uniqueness.');
          return;
        }
      
        // Check if email is already in use (using the lowercased email for consistency)
        try {
          const q = query(collection(db, 'emails'), where('value', '==', lowercasedEmail)); // Use lowercased email here
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            showMessage('Email Taken', 'That email is already registered. Try logging in or using a different one.');
            return;
          }
        } catch (error) {
          console.error('❌ Error checking email uniqueness:', error);
          showMessage('Error', 'Something went wrong checking email uniqueness.');
          return;
        }
      
        const newUser = {
          name,
          email: lowercasedEmail, // Pass the lowercased email to the next screen
          hashtag: userHashtag,
          password,
          photo: '',
          roles: [],
          groups: [],
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
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email} 
                        onChangeText={setEmail} 
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


            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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