// Admin Sidebar Layout
import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BriefcaseBusiness, BarChart3,
  Plus, Menu, X, BriefcaseBusiness as Logo, Home,
  ChevronRight, Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const NAV = [
  { to: '/admin',           label: 'Dashboard',   Icon: LayoutDashboard, exact: true },
  { to: '/admin/jobs',      label: 'All Jobs',    Icon: BriefcaseBusiness             },
  { to: '/admin/jobs/new',  label: 'Add Job',     Icon: Plus                          },
  { to: '/admin/analytics', label: 'Analytics',   Icon: BarChart3                     },
]

const AdminLayout = () => {
  const { user, isAdminUser, loading } = useAuth()
  const { theme, toggleTheme }         = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Guard – must be admin
  if (!user || !isAdminUser) {
    return <Navigate to="/login" replace />
  }

  const isActive = (to, exact = false) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-surface-200 dark:border-surface-700">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow">
          <Logo size={18} className="text-white" />
        </div>
        <div>
          <span className="font-heading font-bold text-base gradient-text">MyJobUniverse</span>
          <p className="text-[10px] text-surface-400 flex items-center gap-0.5">
            <Shield size={9} /> Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, Icon, exact }) => {
          const active = isActive(to, exact)
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50 hover:text-primary-600 dark:hover:text-primary-400'
                }
              `}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-surface-200 dark:border-surface-700 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-surface-500 hover:text-primary-600 hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors"
        >
          <Home size={16} /> View Site
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-surface-100 dark:bg-surface-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="overlay-frosted lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-60 bg-white dark:bg-surface-900 z-50 lg:hidden shadow-glass-dark"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-900/90 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800 px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-surface-500 flex-1 min-w-0">
            <Link to="/admin" className="hover:text-primary-600 transition-colors">Admin</Link>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight size={14} />
                <span className="text-surface-800 dark:text-surface-200 capitalize font-medium truncate">
                  {location.pathname.split('/').at(-1).replace('-', ' ')}
                </span>
              </>
            )}
          </nav>

          {/* FAB for mobile – Add Job */}
          <Link
            to="/admin/jobs/new"
            className="lg:hidden btn-primary py-1.5 px-3 text-sm"
          >
            <Plus size={15} /> Add
          </Link>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile FAB */}
        <Link
          to="/admin/jobs/new"
          className="fixed right-4 bottom-6 lg:hidden w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-full shadow-glow flex items-center justify-center hover:shadow-glow-accent transition-shadow"
          aria-label="Add new job"
        >
          <Plus size={24} />
        </Link>
      </div>
    </div>
  )
}

export default AdminLayout
