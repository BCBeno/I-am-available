import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from './Fakedatabase/fakeDB';
import { DEV_MODE } from './config';

const TASK_NAME = 'CHECK_AVAILABILITY_IN_RADIUS';

// Extracted function for reusability
export async function runAvailabilityCheck() {
  try {
    console.log('📍 Running availability check');

    const location = await Location.getCurrentPositionAsync({});
    const user = getUser(global.loggedInUserHashtag);
    const now = new Date();

    const notified = JSON.parse(await AsyncStorage.getItem('notifiedAvailabilities') || '{}');

    for (const availability of user.availabilities || []) {
      console.log('🔍 Availability:', availability);

      if (availability.locationType !== 'onSite') {
        console.log('⛔ Skipping: Not on-site');
        continue;
      }
      if (availability.repeats === false) {
        const [sh, sm] = availability.time.split(' - ')[0].split(':');
        const fullDateTime = new Date(availability.date);
        fullDateTime.setHours(parseInt(sh), parseInt(sm), 0, 0);
      
        if (fullDateTime < now) {
          console.log('⛔ Skipping: One-time and already in the past');
          continue;
        }
      }

      if (user.settings?.locationRemindersEnabled === false) {
        console.log('⛔ Skipping: Location reminders turned off in settings');
        continue;
      }

      const { latitude, longitude } = location.coords;
      const target = availability.coordinates;

      const distance = getDistanceFromLatLonInMeters(
        latitude, longitude, target.latitude, target.longitude
      );

      const [startTimeStr] = availability.time.split(' - ');
      const start = new Date();
      const [sh, sm] = startTimeStr.split(':');
      start.setHours(parseInt(sh), parseInt(sm), 0, 0);

      const diff = start - now;
      const isWithinTime = diff > 0 && diff <= (DEV_MODE ? 2 * 60 * 1000 : 5 * 60 * 1000);

      const key = availability.id || `${availability.group}-${startTimeStr}`;

      console.log(`📅 Checking: "${availability.complement}" for group #${availability.group}`);
      console.log(`📏 Distance: ${Math.round(distance)}m, ⏱️ Time diff: ${Math.round(diff / 60000)} min`);

      if (distance <= availability.radius && isWithinTime && !notified[key]) {
        console.log('✅ User is within radius & time window — sending notification');

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Heads up!',
            body: `📍 In ${DEV_MODE ? '2' : '5'} mins: "${availability.complement}" with group #${availability.group}`,
          },
          trigger: null,
        });

        notified[key] = true;
      }
    }

    await AsyncStorage.setItem('notifiedAvailabilities', JSON.stringify(notified));

  } catch (error) {
    console.error('❌ Availability check error:', error);
  }
}


TaskManager.defineTask(TASK_NAME, runAvailabilityCheck);

export async function startBackgroundAvailabilityTask() {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (fgStatus !== 'granted' || bgStatus !== 'granted') return;

  const hasStarted = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: DEV_MODE ? 10 * 1000 : 5 * 60 * 1000,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: false,
      foregroundService: {
        notificationTitle: 'Location Active',
        notificationBody: 'Monitoring your availability zones...'
      },
    });
  }
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
