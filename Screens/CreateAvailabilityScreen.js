import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import { Marker, Circle } from 'react-native-maps';
import CalendarIcon from '../assets/Calendar.png';
import fakeDB from '../Fakedatabase/fakeDB';
import { getUser } from '../Fakedatabase/fakeDB';
export default function CreateAvailabilityScreen({ navigation, route }) {
    
    
    
    const { user: originalUser } = route.params;
    const user = getUser(originalUser.hashtag); //  ensure fresh user data
    

  const [location, setLocation] = useState({
        latitude: 41.8068, 
        longitude: -6.7574,
    });

const roleOptions = user?.roles || [];
const [profile, setProfile] = useState(roleOptions[0]?.hashtag || '');
 
const [radius, setRadius] = useState('100'); 
  const [group, setGroup] = useState('dmgroup-A-2024-2');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeats, setRepeats] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [locationType, setLocationType] = useState('onSite');
  const [complement, setComplement] = useState('Estig - Gabinet 72');
const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };
  
  const handleConfirm = () => {
    // Validate role selection
    if (!profile) {
      alert("Please create a role before setting availability.");
      return;
    }
  
    // Validate time logic
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const start = new Date();
    const end = new Date();
    start.setHours(startH, startM);
    end.setHours(endH, endM);
    if (end <= start) {
      alert('End time must be after start time.');
      return;
    }
  
    // Validate repeats
    if (repeats && selectedDays.length === 0) {
      alert('Please select at least one day.');
      return;
    }
    if (!repeats && !date) {
      alert('Please select a date.');
      return;
    }
  
    const newAvailability = {
        roleHashtag: profile,
        group,
        time: `${startTime} - ${endTime}`,
        repeats,
        ...(repeats ? { days: selectedDays } : { date: date.toISOString().split('T')[0] }),
        locationType,
        ...(locationType === 'onSite' && {
          coordinates: location,
          radius: parseInt(radius)
        }),
        complement
      };
      
  
    // Prevent duplicates
    const currentUser = fakeDB.users.find((u) => u.hashtag === user.hashtag);
    if (!currentUser) {
      alert('User not found.');
      return;
    }
    if (!currentUser.availabilities) currentUser.availabilities = [];
  
    const isDuplicate = currentUser.availabilities.some((a) =>
      a.roleHashtag === newAvailability.roleHashtag &&
      a.time === newAvailability.time &&
      a.group === newAvailability.group &&
      (a.repeats
        ? JSON.stringify(a.days) === JSON.stringify(newAvailability.days)
        : a.date === newAvailability.date)
    );
  
    if (isDuplicate) {
      alert('You already have this availability set.');
      return;
    }
  
    // Save it
    currentUser.availabilities.push(newAvailability);
    navigation.navigate('AvailabilityMain', { refreshed: true });
  };
  


  const availability = {
    roleHashtag: profile,
    group,
    time: `${startTime} - ${endTime}`,
    repeats,
    ...(repeats
      ? { days: selectedDays }
      : { date: date.toISOString().split('T')[0] }),
    locationType,
    ...(locationType === 'onSite' && {
      coordinates: location,
      radius: parseInt(radius)
    }),
    complement,
  };
  


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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Role</Text>
      <Picker
            selectedValue={profile}
            onValueChange={(itemValue) => setProfile(itemValue)}
            style={styles.picker}
            >
            {roleOptions.map((role) => (
                <Picker.Item key={role.hashtag} label={role.hashtag} value={role.hashtag} />
            ))}
        </Picker>


      <Text style={styles.label}>Group</Text>
      <Picker
        selectedValue={group}
        onValueChange={(itemValue) => setGroup(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="dmgroup-A-2024-2" value="dmgroup-A-2024-2" />
      </Picker>

      <View style={styles.rowBetween}>
  <View style={styles.timeInputWrapper}>
    <Text style={styles.label}>From</Text>
    <TouchableOpacity
      onPress={() => setShowStartPicker(true)}
      style={styles.datePickerButton}
    >
      <Text>{startTime}</Text>
    </TouchableOpacity>
    {showStartPicker && (
      <DateTimePicker
        value={new Date()}
        mode="time"
        is24Hour
        display="default"
        onChange={(event, selectedDate) => {
          setShowStartPicker(false);
          if (selectedDate) {
            const timeStr = selectedDate.toTimeString().slice(0, 5); // "HH:mm"
            setStartTime(timeStr);
          }
        }}
      />
    )}
  </View>

  <View style={styles.timeInputWrapper}>
    <Text style={styles.label}>To</Text>
    <TouchableOpacity
      onPress={() => setShowEndPicker(true)}
      style={styles.datePickerButton}
    >
      <Text>{endTime}</Text>
    </TouchableOpacity>
    {showEndPicker && (
      <DateTimePicker
        value={new Date()}
        mode="time"
        is24Hour
        display="default"
        onChange={(event, selectedDate) => {
          setShowEndPicker(false);
          if (selectedDate) {
            const timeStr = selectedDate.toTimeString().slice(0, 5);
            setEndTime(timeStr);
          }
        }}
      />
    )}
  </View>
</View>


      <View style={styles.rowBetween}>
        <Text style={styles.label}>Repeats?</Text>
        <Switch
            value={repeats}
            onValueChange={(value) => {
                setRepeats(value);
                if (value) {
                setDate(new Date());        // reset selected single date
                } else {
                setSelectedDays([]);        // clear selected days to avoid possible data overlaping bugs
                }
            }}
/>
      </View>

      {!repeats && (
          <View style={styles.iconRow}>
            <Image source={CalendarIcon} style={styles.calendarIcon} />
            <TouchableOpacity
              style={[styles.datePickerButton, { flex: 1 }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
        )}

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

        {repeats && (
          <View style={styles.iconRow}>
            <Image source={CalendarIcon} style={styles.calendarIcon} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {daysOfWeek.map((dayObj) => {
                const isActive = selectedDays.includes(dayObj.full);
                return (
                  <TouchableOpacity
                    key={dayObj.full}
                    style={[styles.dayButton, isActive && styles.activeDayButton]}
                    onPress={() => toggleDay(dayObj.full)}
                  >
                    <Text style={[styles.dayButtonText, isActive && styles.activeDayButtonText]}>
                      {dayObj.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

      <Text style={styles.label}>Where?</Text>
      <View style={styles.rowBetween}>
        <TouchableOpacity onPress={() => setLocationType('onSite')} style={styles.radioOption}>
          <View style={[styles.radioCircle, locationType === 'onSite' && styles.selected]} />
          <Text>On Site</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLocationType('remote')} style={styles.radioOption}>
          <View style={[styles.radioCircle, locationType === 'remote' && styles.selected]} />
          <Text>Remote</Text>
        </TouchableOpacity>
      </View>

      {locationType === 'onSite' && (
  <>
  <Text style={styles.label}>Location details</Text>
  <MapView
    style={styles.map}
    initialRegion={{
      ...location,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }}
    onPress={handleMapPress}
  >
    <Marker coordinate={location} />
    <Circle
      center={location}
      radius={Math.min(parseInt(radius) || 0, 1000)} // max 1000m
      strokeColor="#7C0152"
      fillColor="rgba(124, 1, 82, 0.1)"
    />
  </MapView>

  <Text style={styles.label}>Radius (in meters, max 1000)</Text>
  <TextInput
    style={styles.input}
    keyboardType="numeric"
    value={radius}
    onChangeText={(val) => {
      const sanitized = val.replace(/[^0-9]/g, '');
      setRadius(sanitized.length ? Math.min(parseInt(sanitized), 1000).toString() : '');
    }}
    maxLength={4}
    placeholder="e.g., 100"
  />
</>
)}

      <Text style={styles.label}>Complement</Text>
      <TextInput style={styles.input} value={complement} onChangeText={setComplement} />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  input: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginBottom: 10,

  },
  picker: {
    backgroundColor: '#eee',
    borderRadius: 40,
    marginBottom: 10,
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
  datePickerButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
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
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCircle: {
    backgroundColor: '#7C0152',
  },
  dayLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dayButton: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#eee',
    marginRight: 5,
    marginBottom: 5,
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
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#7C0152',
  },
  
  
});
