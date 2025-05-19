//LocationTask.js
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_MODE } from './config';
import { db } from './firebaseconfig';
import { doc, updateDoc,getDoc } from 'firebase/firestore';

const TASK_NAME = 'CHECK_AVAILABILITY_IN_RADIUS';

let currentHashtag = null;

export async function runAvailabilityCheck() {
  if (!currentHashtag) return console.warn("⚠️ No hashtag for location check");

  try {
    console.log('📍 Running availability check');

    const userDoc = await getDoc(doc(db, 'users', currentHashtag));
    const user = userDoc.exists() ? userDoc.data() : null;
    if (!user) return console.warn("⚠️ Failed to fetch user data from Firestore");

    const location = await Location.getCurrentPositionAsync({});
    if (!location?.coords) {
      console.warn("⚠️ No location data available.");
      return;
    }

    const now = new Date();
    const weekdayName = now.toLocaleDateString('en-US', { weekday: 'long' });

    const notified = JSON.parse(await AsyncStorage.getItem('notifiedAvailabilities') || '{}');

    for (const availability of user.availabilities || []) {
      if (availability.locationType !== 'onSite') continue;

      if (!availability.coordinates?.latitude || !availability.coordinates?.longitude) {
        console.warn("⚠️ Skipping availability with invalid coordinates");
        continue;
      }

      const [startTimeStr, endTimeStr] = availability.time.split(' - ');
      const [sh, sm] = startTimeStr.split(':').map(Number);
      const [eh, em] = endTimeStr.split(':').map(Number);

      const start = new Date();
      start.setHours(sh, sm, 0, 0);
      const end = new Date();
      end.setHours(eh, em, 0, 0);

      const nowDateStr = now.toISOString().split('T')[0];
      const key = `${availability.id || availability.group}-${nowDateStr}`;

      let isMatch = false;
      if (availability.repeats) {
        isMatch = availability.days?.includes(weekdayName);
      } else if (availability.date === nowDateStr) {
        isMatch = true;
      }

      if (!isMatch) continue;

      const diff = start - now;
      const isWithinTime = diff > -5 * 60 * 1000 && diff <= (DEV_MODE ? 2 * 60 * 1000 : 5 * 60 * 1000);
      if (!isWithinTime) continue;

      if (user.settings?.locationRemindersEnabled === false) continue;

      const { latitude, longitude } = location.coords;
      const target = availability.coordinates;
      const distance = getDistanceFromLatLonInMeters(
        latitude, longitude, target.latitude, target.longitude
      );

      if (availability.isavailable && now > end) {
        try {
          await updateDoc(doc(db, 'availabilities', availability.id), { isavailable: false });
          await updateDoc(doc(db, 'groups', availability.group), { owneravailable: false });
          console.log(`🔁 Reset expired availability for group ${availability.group}`);
        } catch (err) {
          console.error("❌ Failed to auto-reset expired availability:", err);
        }
        continue;
      }

      if (distance <= availability.radius && !notified[key]) {
        console.log(`✅ Available: ${availability.complement} in group ${availability.group}`);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Heads up!',
            body: `📍 "${availability.complement}" starts soon in group ${availability.group}`,
          },
          trigger: null,
        });

        notified[key] = true;

        try {
          if (availability.id) {
            await updateDoc(doc(db, 'availabilities', availability.id), { isavailable: true });
          }
          await updateDoc(doc(db, 'groups', availability.group), { owneravailable: true });
        } catch (err) {
          console.error("❌ Failed to update Firestore:", err);
        }

        const resetDelay = end - now + 60 * 1000;
        if (resetDelay > 0) {
          setTimeout(async () => {
            try {
              console.log(`⏳ Resetting availability for group ${availability.group}`);
              await updateDoc(doc(db, 'groups', availability.group), { owneravailable: false });
              if (availability.id) {
                await updateDoc(doc(db, 'availabilities', availability.id), { isavailable: false });
              }
              delete notified[key];
              await AsyncStorage.setItem('notifiedAvailabilities', JSON.stringify(notified));
            } catch (err) {
              console.error('❌ Failed to reset availability status:', err);
            }
          }, resetDelay);
        }
      }
    }

    await AsyncStorage.setItem('notifiedAvailabilities', JSON.stringify(notified));
  } catch (error) {
    console.error('❌ Availability check error:', error);
  }
}

TaskManager.defineTask(TASK_NAME, runAvailabilityCheck);

export async function startBackgroundAvailabilityTask(hashtag) {
  currentHashtag = hashtag;
  console.log("🔄 Starting background location task setup...");
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (fgStatus !== 'granted' || bgStatus !== 'granted') return;

  const hasStarted = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: DEV_MODE ? 5000 : 5 * 60 * 1000,
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
