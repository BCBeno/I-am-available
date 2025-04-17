import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import background from '../assets/Background.png';
import logo from '../assets/logo.png';

const ScreenWrapper = ({ children }) => {
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.centerContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  centerContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingBottom: 100,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    marginTop: 40,
  },
  
});

export default ScreenWrapper;
