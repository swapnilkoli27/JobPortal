// Bottom Navigation – mobile-only fixed bar
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Bookmark, LayoutDashboard, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

const ITEMS = [
  { to: '/',          label: 'Home',     Icon: Home          },
  { to: '/jobs',      label: 'Search',   Icon: Search        },
  { to: '/dashboard/bookmarks', label: 'Saved', Icon: Bookmark },
  { to: '/dashboard', label: 'Profile',  Icon: LayoutDashboard },
  { to: '/notifications', label: 'Alerts', Icon: Bell },
]

const BottomNav = () => {
  const location = useLocation()
  const { user }         = useAuth()
  const { unreadCount }  = useNotifications()

  // Don't show on admin pages or desktop
  if (location.pathname.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="
        glass border-t border-white/30 dark:border-white/10
        flex items-center justify-around
        px-2 pt-2 pb-safe
      ">
        {ITEMS.map(({ to, label, Icon }) => {
          const active = location.pathname === to ||
            (to !== '/' && location.pathname.startsWith(to))

          if ((to === '/dashboard' || to === '/dashboard/bookmarks' || to === '/notifications') && !user) {
            return (
              <Link
                key={to}
                to="/login"
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl min-w-[56px]"
              >
                <Icon size={22} className="text-surface-400" />
                <span className="text-xs text-surface-400">{label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={to}
              to={to}
              className={`
                relative flex flex-col items-center gap-0.5 p-2 rounded-xl min-w-[56px]
                transition-all duration-200
                ${active
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-surface-500 dark:text-surface-400'
                }
              `}
              aria-label={label}
            >
              {active && (
                <motion.div
                  className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-xl"
                  layoutId="bottom-nav-active"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div className="relative">
                <Icon size={22} />
                {label === 'Alerts' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium relative z-10">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
