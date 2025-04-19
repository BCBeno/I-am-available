import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  Alert,
  ToastAndroid
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import CalendarIcon from '../assets/Calendar.png';
import { getUser } from '../Fakedatabase/fakeDB';

export default function StudentAvailabilityDetailsScreen({ route, navigation }) {
  const { user: originalUser, availabilityIndex } = route.params;
  const user = getUser(originalUser.hashtag);
  const availability = user.availabilities?.[availabilityIndex];

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (!availability) {
    console.warn('❌ Invalid availability index or deleted entry:', availabilityIndex);

    if (Platform.OS === 'android') {
      ToastAndroid.show('This availability no longer exists.', ToastAndroid.SHORT);
    } else {
      Alert.alert('Not Found', 'This availability no longer exists.');
    }

    setTimeout(() => {
      navigation.navigate('AvailabilityMain');
    }, 0);

    return null;
  }

  const daysOfWeek = [
    { label: 'S', full: 'Sunday' },
    { label: 'M', full: 'Monday' },
    { label: 'T', full: 'Tuesday' },
    { label: 'W', full: 'Wednesday' },
    { label: 'T', full: 'Thursday' },
    { label: 'F', full: 'Friday' },
    { label: 'S', full: 'Saturday' }
  ];


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.readOnlyField}>{availability.roleHashtag}</Text>

        <Text style={styles.label}>Group</Text>
        <Text style={styles.readOnlyField}>{availability.group}</Text>

        <View style={styles.rowBetween}>
          <View style={styles.timeInputWrapper}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.readOnlyField}>{availability.time.split(' - ')[0]}</Text>
          </View>
          <View style={styles.timeInputWrapper}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.readOnlyField}>{availability.time.split(' - ')[1]}</Text>
          </View>
        </View>


        {!availability.repeats && (
          <View style={[styles.iconRow, { marginBottom: 20 }]}>
            <Image source={require('../assets/Calendar.png')} style={styles.calendarIcon} />
            <View style={[styles.readOnlyField, { flex: 1 }]}>
              <Text style={{ fontSize: 16, color: '#000' }}>{availability.date.replace(/-/g, '/')}</Text>
            </View>
          </View>
)}

{availability.repeats && (
  <View style={styles.iconRow}>
    <Image source={require('../assets/Calendar.png')} style={styles.calendarIcon} />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
      {daysOfWeek.map((dayObj) => {
        const isActive = availability.days.includes(dayObj.full);
        return (
          <View
            key={dayObj.full}
            style={[styles.dayButton, isActive && styles.activeDayButton]}
          >
            <Text style={[styles.dayButtonText, isActive && styles.activeDayButtonText]}>
              {dayObj.label}
            </Text>
          </View>
        );
      })}
    </View>
  </View>
)}



        <Text style={styles.label}>Where?</Text>
        <View style={styles.iconRow}>
          <View style={styles.radioOption}>
            <View style={[styles.radioCircle, availability.locationType === 'onSite' && styles.selected]} />
            <Text style={{ color: availability.locationType === 'onSite' ? '#7C0152' : '#333', fontWeight: 'bold' }}>On Site</Text>
          </View>
          <View style={{ width: 20 }} />
          <View style={styles.radioOption}>
            <View style={[styles.radioCircle, availability.locationType === 'remote' && styles.selected]} />
            <Text style={{ color: availability.locationType === 'remote' ? '#7C0152' : '#333', fontWeight: 'bold' }}>Remote</Text>
          </View>
        </View>



        {availability.locationType === 'onSite' && (
          <>
            <Text style={styles.label}>Location details</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                ...availability.coordinates,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={availability.coordinates}
                onPress={() => {
                  navigation.navigate('LocationDetails', {
                    coordinates: availability.coordinates,
                    radius: availability.radius,
                  });
                }}
              />
              <Circle
                center={availability.coordinates}
                radius={Math.min(availability.radius, 1000)}
                strokeColor="#7C0152"
                fillColor="rgba(124, 1, 82, 0.1)"
              />
            </MapView>

            <Text style={styles.label}>Radius (in meters, max 1000)</Text>
            <Text style={styles.readOnlyField}>{availability.radius.toString()}</Text>
          </>
        )}

        <Text style={styles.label}>Complement</Text>
        <Text style={styles.readOnlyField}>{availability.complement}</Text>


      </ScrollView>
    </SafeAreaView>
  );


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  readOnlyField: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    color: '#444',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeInputWrapper: {
    flex: 0.48,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',       // vertical center
    justifyContent: 'center',   // horizontal center 
    marginBottom: 10,
  },
  dayButton: {
    paddingVertical: 12, 
    paddingHorizontal: 14, 
    borderRadius: 10,
    backgroundColor: '#eee',
    marginRight: 5,
    marginBottom: 5,
    minWidth: 28, 
    alignItems: 'center',
  },
  
  dayButtonText: {
    fontSize: 13, 
    color: '#000',
    fontWeight: 'bold',
  },
  
  activeDayButton: {
    backgroundColor: '#7C0152',
  },
  dayButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeDayButtonText: {
    color: '#fff',
  },
  map: {
    width: '100%',
    height: 350,
    marginBottom: 10,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: '#7C0152',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#7C0152',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#7C0152',
    marginRight: 8,
  },
  selected: {
    backgroundColor: '#7C0152',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  selectedToggle: {
    backgroundColor: '#7C0152',
  },
  toggleButtonText: {
    color: '#333',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  selectedToggleText: {
    color: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },

});
}
