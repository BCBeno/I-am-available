import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TopBar({ profileImage }) {
  const navigation = useNavigation();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileFlow')}>
        <Image source={{ uri: profileImage }} style={styles.profilePic} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#7C0152',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 10,
  },
  profilePic: {
    top: -10,
    width: 50,
    height: 50,
    borderRadius: 20,
  },
});
