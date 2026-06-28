// Firebase Authentication Helpers
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

/**
 * Sign in with Google popup. Creates a Firestore user doc if first time.
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  await ensureUserDoc(result.user)
  return result.user
}

/**
 * Sign in with email & password.
 */
export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

/**
 * Register a new user with email, password, and display name.
 */
export const signUpWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  await ensureUserDoc(result.user, { displayName })
  return result.user
}

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  await firebaseSignOut(auth)
}

/**
 * Send a password reset email.
 */
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

/**
 * Subscribe to auth state changes. Returns an unsubscribe function.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Creates a user document in Firestore if it does not already exist.
 * Preserves existing data (e.g., role field set by admin).
 */
export const ensureUserDoc = async (user, extra = {}) => {
  const ref  = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid:           user.uid,
      email:         user.email,
      displayName:   user.displayName || extra.displayName || '',
      photoURL:      user.photoURL    || '',
      role:          'user',          // Default role; change to 'admin' in Firestore manually
      bookmarks:     [],
      recentlyViewed:[],
      fcmTokens:     [],
      categories:    [],              // Subscribed notification categories
      createdAt:     serverTimestamp(),
      updatedAt:     serverTimestamp(),
      ...extra,
    })
  } else {
    // Update last seen
    await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true })
  }
}

/**
 * Fetch user document from Firestore.
 */
export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Check if the given user is an admin.
 */
export const isAdmin = async (uid) => {
  const userDoc = await getUserDoc(uid)
  return userDoc?.role === 'admin'
}
