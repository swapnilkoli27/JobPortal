// Firebase Configuration & Initialization
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, isSupported } from 'firebase/messaging'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Prevent duplicate initialization in HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const storage  = getStorage(app)

// Analytics – only in browser
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Messaging – async, only if browser supports it
export const getMessagingInstance = async () => {
  const supported = await isSupported()
  return supported ? getMessaging(app) : null
}

export default app
