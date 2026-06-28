// Firebase Cloud Messaging Helpers
import { getToken, onMessage } from 'firebase/messaging'
import { getMessagingInstance } from './config'
import { saveFcmToken } from './firestore'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

/**
 * Request notification permission and return the FCM token.
 * Saves token to Firestore user document.
 */
export const requestNotificationPermission = async (userId) => {
  try {
    const messaging = await getMessagingInstance()
    if (!messaging) {
      console.warn('FCM messaging is not supported in this browser environment.')
      return null
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('FCM Notification permission denied by user.')
      return null
    }

    if (!VAPID_KEY || VAPID_KEY === 'your_vapid_key_here') {
      console.error(
        'FCM Configuration Error: VAPID Key is missing or invalid in your .env file.\n' +
        '1. Go to Firebase Console -> Project Settings -> Cloud Messaging.\n' +
        '2. Scroll down to Web Configuration -> Web Push certificates.\n' +
        '3. Click Generate Key Pair.\n' +
        '4. Copy the key and add it to your VITE_FIREBASE_VAPID_KEY variable in your .env file.'
      )
      return null
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY })
    if (token && userId) {
      await saveFcmToken(userId, token)
    }
    return token
  } catch (err) {
    console.error('FCM token error:', err)
    return null
  }
}

/**
 * Listen for foreground FCM messages.
 * Returns unsubscribe function.
 */
export const listenForMessages = async (callback) => {
  const messaging = await getMessagingInstance()
  if (!messaging) return () => {}

  return onMessage(messaging, payload => {
    callback({
      title: payload.notification?.title || 'New Job Alert',
      body:  payload.notification?.body  || 'A new job matching your interests was posted!',
      data:  payload.data,
    })
  })
}
