// Authentication Context – provides auth state app-wide
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, getUserDoc } from '../firebase/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,        setUser]        = useState(null)  // Firebase Auth user
  const [userDoc,     setUserDoc]     = useState(null)  // Firestore user document
  const [loading,     setLoading]     = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const doc = await getUserDoc(firebaseUser.uid)
          setUserDoc(doc)
          setIsAdminUser(doc?.role === 'admin')
        } catch {
          setUserDoc(null)
          setIsAdminUser(false)
        }
      } else {
        setUserDoc(null)
        setIsAdminUser(false)
      }

      setLoading(false)
    })

    return unsub
  }, [])

  /** Refresh user doc from Firestore (call after updating profile) */
  const refreshUserDoc = async () => {
    if (!user) return
    const doc = await getUserDoc(user.uid)
    setUserDoc(doc)
  }

  return (
    <AuthContext.Provider value={{ user, userDoc, loading, isAdminUser, refreshUserDoc }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook to consume auth context */
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
