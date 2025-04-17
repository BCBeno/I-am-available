import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';
import { isHashtagTaken } from '../Fakedatabase/fakeDB'; //  TODO: replace with API call to check if hashtag is taken
import { Keyboard } from 'react-native';
import uuid from 'react-native-uuid';

const SignUpBox = () => {

  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [userHashtag, setUserHashtag] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !userHashtag || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    const alreadyExists = isHashtagTaken(userHashtag);
    if (alreadyExists) {
      Alert.alert('Error', 'That hashtag is already taken.');
      return;
    }
  
    // Prepare user object with placeholder photo and empty roles
    const newUser = {
      id: uuid.v4(),
      name: name,
      hashtag: userHashtag,
      password: password,
      photo: '',
      roles: [],
      groups: [],
      availabilities: [],
      chats:[],
    };
    
    
  
    //Pass the full user object to the ProfilePicture screen
    Keyboard.dismiss(); //  dismiss keyboard first

    setTimeout(() => {
      navigation.navigate('ProfilePicture', newUser); //  delay avoids visual glitch
    }, 100);
  };
  

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.signUpBox}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>User Hashtag</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. lucasalopes"
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
    marginTop: 20,
  },
  signUpLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignUpBox;
