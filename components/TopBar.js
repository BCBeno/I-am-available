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
    paddingTop: 40,
    paddingBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
