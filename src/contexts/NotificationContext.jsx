// Notification Context – FCM + in-app toast notifications
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'
import { requestNotificationPermission, listenForMessages } from '../firebase/fcm'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const [fcmToken,       setFcmToken]       = useState(null)
  const [notifications,  setNotifications]  = useState([])
  const [unreadCount,    setUnreadCount]    = useState(0)

  /** Request FCM permission and subscribe */
  const enableNotifications = useCallback(async () => {
    if (!user) return
    const token = await requestNotificationPermission(user.uid)
    if (token) {
      setFcmToken(token)
      toast.success('🔔 Job alerts enabled!')
    } else {
      if (Notification.permission === 'denied') {
        toast.error('Permission denied. Click the lock/info icon in your browser address bar to reset permissions.')
      } else if (!import.meta.env.VITE_FIREBASE_VAPID_KEY || import.meta.env.VITE_FIREBASE_VAPID_KEY === 'your_vapid_key_here') {
        toast.error('VAPID Key not found. Please add a valid VAPID Key to your .env file.')
      } else {
        toast.error('Could not enable notifications. Check console for error details.')
      }
    }
  }, [user])

  /** Add an in-app notification */
  const addNotification = useCallback((notif) => {
    setNotifications(prev => [
      { ...notif, id: Date.now(), read: false, time: new Date() },
      ...prev.slice(0, 49), // max 50
    ])
    setUnreadCount(c => c + 1)
  }, [])

  /** Mark all as read */
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  /** Listen for foreground FCM messages */
  useEffect(() => {
    if (!user) return
    let unsub = () => {}

    listenForMessages((payload) => {
      addNotification({ title: payload.title, body: payload.body, data: payload.data })
      toast.custom((t) => (
        <div className={`bg-white dark:bg-surface-800 shadow-card rounded-xl p-4 flex gap-3 max-w-sm
                         border border-surface-200 dark:border-surface-700
                         ${t.visible ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="text-2xl">🔔</span>
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-50 text-sm">{payload.title}</p>
            <p className="text-surface-500 dark:text-surface-400 text-xs mt-0.5">{payload.body}</p>
          </div>
        </div>
      ), { duration: 5000 })
    }).then(fn => { unsub = fn })

    return () => unsub()
  }, [user, addNotification])

  return (
    <NotificationContext.Provider value={{
      fcmToken, notifications, unreadCount,
      enableNotifications, addNotification, markAllRead
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

export default NotificationContext
