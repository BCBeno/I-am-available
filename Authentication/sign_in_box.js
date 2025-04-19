import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';
import { authenticateUser } from '../Fakedatabase/fakeDB'; //  TODO: Replace with real API login call
// import AsyncStorage from '@react-native-async-storage/async-storage'; //  Optional: For JWT storage later
import SHA256 from 'crypto-js/sha256';
const SignInBox = ({ navigation, setLoggedInUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {
    
    if (!username || !password) {
      Alert.alert('Missing info', 'Please enter both username and password.');
      return;
    }
  
    const hashedPassword = SHA256(password).toString(); // hash before checking
    const user = authenticateUser(username, hashedPassword);
  
    if (user) {
      setLoggedInUser(user);
      console.log("🔑 Hashed password:", hashedPassword);
    } else {
      Alert.alert('Login failed', 'Invalid hashtag or password.');
    }
  };
  
  

    


  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.signInBox}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Username"
                value={username}
                onChangeText={setUsername}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

                                <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        setTimeout(() => {
                          navigation.navigate('SignUp');
                        }, 100);
                      }}
                    >
                      <Text style={styles.bottomText}>
                        Not registered yet? <Text style={styles.signUpLink}>Sign Up</Text>
                      </Text>
                    </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  signInBox: {
    width: 300,
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#80004d',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
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
    marginTop: 200,
  },
  signUpLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignInBox;
