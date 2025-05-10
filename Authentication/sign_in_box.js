//sign_in_box.js
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
import { loadCompleteUserData } from '../data/userDataLoader';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';

const SignInBox = ({ navigation, setLoggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  const handleSignIn = async () => {
    if (isSigningIn) return;
  
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter both email and password.');
      return;
    }
  
    setIsSigningIn(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const q = query(collection(db, 'users'), where('email', '==', userCredential.user.email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        throw new Error('User not found');
      }
  
      const userData = querySnapshot.docs[0].data();
      const fullUserData = await loadCompleteUserData(userData.hashtag);
      setLoggedInUser(fullUserData);
    } catch (err) {
      console.log("❌ Sign-in error:", err);
      let errorMessage = 'An unexpected error occurred. Please try again.';

      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'The email address is badly formatted.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please check or sign up.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please wait a moment before trying again.';
          break;
      }
      
      Alert.alert('Sign-in failed', errorMessage);
    } finally {
      setTimeout(() => setIsSigningIn(false), 5000);
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
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

                <TouchableOpacity style={[styles.button, isSigningIn && { opacity: 0.5 }]} onPress={handleSignIn} disabled={isSigningIn}>
                <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

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
    marginTop: 150,
  },
  signUpLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
});

export default SignInBox;
