import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NotificationCard = ({ title, subject, group, dateTime, onPressDetails }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subject}>{subject}</Text>
      <Text style={styles.group}>{group}</Text>
      <View style={styles.footer}>
        <Text style={styles.datetime}>{dateTime}</Text>
        <TouchableOpacity onPress={onPressDetails}>
          <Text style={styles.details}>Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  group: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datetime: {
    fontSize: 12,
    color: '#aaa',
  },
  details: {
    fontSize: 14,
    color: '#800080',
  },
});

export default NotificationCard;
