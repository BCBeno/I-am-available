import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {  View,  Text,  Image,  TouchableOpacity,  StyleSheet,  Platform,  KeyboardAvoidingView,  ScrollView,  TouchableWithoutFeedback,Keyboard,Alert,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from './ScreenWrapper';
import defaultphoto from '../assets/defaulticon.png';
import { addUser } from '../Fakedatabase/fakeDB'; //  TODO: replace this with real API POST call

const ProfilePictureUploadBox = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, userHashtag, password } = route.params || {};

  // defensive check
  if (!name || !userHashtag || !password) {
    useEffect(() => {
      Alert.alert('Error', 'User not found. Please sign up again.');
      navigation.navigate('SignUp');
    }, []);
    return null;
  }

  const [photoBase64, setPhotoBase64] = useState(null);

  const handleFileChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({

      // [expo-image-picker] MediaTypeOptions is deprecated
      // But it works for now
   
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, 
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64String = result.assets[0].base64;
      setPhotoBase64(base64String);
    }
  };

  const handleSignUp = async () => {
    if (!photoBase64) {
      Alert.alert('Wait!', 'Please select a photo before signing up.');
      return;
    }

    const newUser = {
      name,
      hashtag: userHashtag,
      password,
      photo: photoBase64, //  sent as base64
    };

   

    addUser(newUser); //  Temporary mock function for local testing
    console.log('Final user saved:', newUser);
    Alert.alert('Success', 'User registered successfully!');
    navigation.navigate('SignIn'); //  TODO: navigate to Home screen and store token
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
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.uploadBox}>
              <Text style={styles.text}>Profile Picture</Text>

              <View style={styles.imageContainer}>
                <Image
                  source={
                    photoBase64
                      ? { uri: `data:image/jpeg;base64,${photoBase64}` }
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
    shadowOffset: { width: 0, height: 6 },
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
