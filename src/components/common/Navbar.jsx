// Navbar – sticky, blur backdrop, auth-aware, dark mode toggle
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, BriefcaseBusiness, Moon, Sun,
  User, LogOut, LayoutDashboard, Shield, Bookmark
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { signOut } from '../../firebase/auth'
import { getInitials } from '../../utils/formatters'
import NotificationBell from '../notifications/NotificationBell'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { label: 'Find Jobs',   to: '/jobs'        },
  { label: 'Categories',  to: '/categories'  },
]

const Navbar = () => {
  const { user, userDoc, isAdminUser } = useAuth()
  const { theme, toggleTheme }         = useTheme()
  const navigate     = useNavigate()
  const location     = useLocation()
  const [profileOpen,setProfileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const profileRef   = useRef(null)

  // Detect scroll for blur effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setProfileOpen(false)
    navigate('/')
    toast.success('Signed out successfully')
  }

  const isActive = (to) => location.pathname.startsWith(to)

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-white/90 dark:bg-surface-950/90 backdrop-blur-lg shadow-card border-b border-surface-200 dark:border-surface-800'
        : 'bg-transparent'
      }
    `}>
      <div className="page-container">
        <nav className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="MyJobUniverse Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-accent transition-all duration-300">
              <BriefcaseBusiness size={18} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text hidden sm:block">
              MyJobUniverse
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(link.to)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <button
              onClick={() => navigate('/jobs')}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>

            {/* Notification bell */}
            {user && <NotificationBell />}

            {/* Auth */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full ring-2 ring-primary-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.displayName || user.email)}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="absolute right-0 top-12 w-56 card-glass rounded-2xl shadow-glass-dark overflow-hidden border border-surface-200 dark:border-surface-700"
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1,    y: 0  }}
                      exit={{    opacity: 0, scale: 0.95, y: -8  }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="p-4 border-b border-surface-100 dark:border-surface-700">
                        <p className="font-semibold text-sm text-surface-900 dark:text-surface-50 truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-surface-500 truncate">{user.email}</p>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-surface-700 dark:text-surface-300 transition-colors"
                        >
                          <LayoutDashboard size={16} />  Dashboard
                        </Link>
                        <Link
                          to="/dashboard/bookmarks"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-surface-700 dark:text-surface-300 transition-colors"
                        >
                          <Bookmark size={16} />  Saved Jobs
                        </Link>
                        {isAdminUser && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-primary-600 dark:text-primary-400 font-medium transition-colors"
                          >
                            <Shield size={16} />  Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition-colors mt-1"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-5 text-sm hidden sm:flex">
                <User size={16} /> Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
