//DEV MODE FILE 

//// Toggle this before final version
export const DEV_MODE = true;

// Timing constants based on mode
export const LOCATION_CHECK_INTERVAL = DEV_MODE ? 60 * 1000 : 5 * 60 * 1000; // 1 min or 5 min
export const NOTIFY_WINDOW = DEV_MODE ? 2 * 60 * 1000 : 5 * 60 * 1000; // notify before
