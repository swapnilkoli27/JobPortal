// NotificationBell – dropdown of in-app notifications
import { useRef, useState, useEffect } from 'react'
import { Bell, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatDistanceToNow } from 'date-fns'

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead, enableNotifications } = useNotifications()
  const [open, setOpen]   = useState(false)
  const ref               = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(p => !p); if (open) markAllRead() }}
        className="relative btn-ghost p-2 rounded-xl"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-12 w-80 card-glass rounded-2xl shadow-glass-dark overflow-hidden border border-surface-200 dark:border-surface-700 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.95, y: -8  }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-100 dark:border-surface-700">
              <h3 className="font-heading font-semibold text-surface-900 dark:text-surface-50">
                Notifications
              </h3>
              <div className="flex gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="btn-ghost text-xs p-1 rounded-lg"
                    title="Mark all read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="btn-ghost p-1 rounded-lg">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
                  <p className="text-sm text-surface-500">No notifications yet</p>
                  <button
                    onClick={enableNotifications}
                    className="mt-3 btn-primary text-xs py-1.5 px-3"
                  >
                    Enable Job Alerts
                  </button>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`
                      flex gap-3 p-4 border-b border-surface-100 dark:border-surface-700/50
                      hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors
                      ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}
                    `}
                  >
                    <span className="text-xl flex-shrink-0">🔔</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-50 truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-xs text-surface-400 mt-1">
                        {formatDistanceToNow(n.time, { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell
