import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';

const availabilityData = [
  { id: '1', time: '8 am - 10 pm', days: 'SMTWTFS' },
  { id: '2', time: '10 am - 2 pm', days: 'SMTW' },
  { id: '3', time: '4 pm - 6 pm', date: '12 / 04 / 2025' },
];

export default function AvailabilityScreen({ user }) {
    return (
      <>
        <TopBar profileImage={user.photo} />
        <View style={styles.container}>
          <FlatList
            data={availabilityData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Ionicons name="time-outline" size={24} color="#5C005C" />
                  <Text style={styles.cardText}>{item.time}</Text>
                </View>
                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={24} color="#5C005C" />
                  <Text style={styles.cardText}>{item.days || item.date}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.details}>Details →</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.floatingButton}>
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </>
    );
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#7C0152',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 3,
  },
  cardText: {
    fontSize: 16,
  },
  details: {
    textAlign: 'right',
    color: '#7C0152',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#7C0152',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
