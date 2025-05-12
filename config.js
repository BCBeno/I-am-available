// devModeConfig.js
import Constants from 'expo-constants';

// Expo dev mode (shows up when running in Expo Go or via `expo start`)
const IS_EXPO_GO = !!Constants?.appOwnership && Constants.appOwnership === 'expo';
const IS_DEV_BUILD = __DEV__; // Native JS macro for development builds

// True when running inside Expo Go in development mode
export const DEV_MODE = true//IS_EXPO_GO && IS_DEV_BUILD;

// Timing constants based on mode
export const LOCATION_CHECK_INTERVAL = DEV_MODE ? 60 * 1000 : 5 * 60 * 1000; // 1 min or 5 min
export const NOTIFY_WINDOW = DEV_MODE ? 2 * 60 * 1000 : 5 * 60 * 1000; // notify before
