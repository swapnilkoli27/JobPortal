// User Dashboard – saved jobs, recently viewed, notification preferences
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  Bookmark, Clock, Bell, BellOff, User, LogOut,
  ChevronRight, Briefcase, Settings
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { useNotifications } from '../contexts/NotificationContext'
import { getRecentlyViewed, updateUserCategories } from '../firebase/firestore'
import { signOut } from '../firebase/auth'
import { getInitials, JOB_CATEGORIES } from '../utils/formatters'
import JobCard from '../components/jobs/JobCard'
import { SkeletonJobCard } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const navigate  = useNavigate()
  const { user, userDoc, refreshUserDoc } = useAuth()
  const { bookmarkedJobs, loading: bookmarkLoading, fetchBookmarkedJobs } = useBookmarks()
  const { enableNotifications, fcmToken } = useNotifications()

  const [recentJobs,    setRecentJobs]    = useState([])
  const [recentLoading, setRecentLoading] = useState(false)
  const [activeTab,     setActiveTab]     = useState('saved')
  const [subCategories, setSubCategories] = useState(userDoc?.categories || [])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchBookmarkedJobs()
  }, [user])

  useEffect(() => {
    if (!user || activeTab !== 'recent') return
    setRecentLoading(true)
    getRecentlyViewed(user.uid)
      .then(setRecentJobs)
      .catch(() => {})
      .finally(() => setRecentLoading(false))
  }, [user, activeTab])

  const toggleCategory = async (catId) => {
    const updated = subCategories.includes(catId)
      ? subCategories.filter(c => c !== catId)
      : [...subCategories, catId]
    setSubCategories(updated)
    await updateUserCategories(user.uid, updated)
    await refreshUserDoc()
    toast.success('Notification preferences saved')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    toast.success('Signed out')
  }

  if (!user) return null

  const TABS = [
    { key: 'saved',   label: 'Saved Jobs',    Icon: Bookmark, count: bookmarkedJobs.length },
    { key: 'recent',  label: 'Recent',         Icon: Clock,    count: recentJobs.length   },
    { key: 'alerts',  label: 'Job Alerts',     Icon: Bell,     count: subCategories.length },
    { key: 'profile', label: 'Profile',        Icon: User,     count: null               },
  ]

  return (
    <>
      <Helmet>
        <title>My Dashboard – MyJobUniverse</title>
        <meta name="description" content="Manage your saved jobs, recently viewed, and job alert preferences." />
      </Helmet>

      <div className="pt-20 min-h-screen bg-surface-100 dark:bg-surface-900/30">
        <div className="page-container py-8">
          {/* Profile header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-6 flex items-center gap-5"
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-2xl ring-4 ring-primary-200 dark:ring-primary-800" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
                {getInitials(user.displayName || user.email)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-heading font-bold text-xl text-surface-900 dark:text-surface-50">
                {user.displayName || 'Job Seeker'}
              </h1>
              <p className="text-surface-500 text-sm">{user.email}</p>
              {userDoc?.role === 'admin' && (
                <Link to="/admin" className="inline-flex items-center gap-1 mt-1 text-xs text-primary-600 font-semibold">
                  <Settings size={12} /> Admin Panel
                </Link>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="badge-success text-xs">{bookmarkedJobs.length} saved</span>
              <button onClick={handleSignOut} className="btn-ghost text-sm text-red-500">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-200 dark:bg-surface-800 p-1 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
            {TABS.map(({ key, label, Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all
                  ${activeTab === key
                    ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-card'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700'
                  }
                `}
              >
                <Icon size={15} />
                {label}
                {count != null && count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'saved' && (
            <div>
              {bookmarkLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonJobCard key={i} />)}
                </div>
              ) : bookmarkedJobs.length === 0 ? (
                <div className="text-center py-20">
                  <Bookmark size={48} className="mx-auto text-surface-300 mb-3" />
                  <h3 className="font-heading font-bold text-xl text-surface-700 dark:text-surface-300 mb-2">No saved jobs yet</h3>
                  <p className="text-surface-500 mb-4">Bookmark jobs to save them here</p>
                  <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bookmarkedJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recent' && (
            <div>
              {recentLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonJobCard key={i} />)}
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center py-20">
                  <Clock size={48} className="mx-auto text-surface-300 mb-3" />
                  <h3 className="font-heading font-bold text-xl text-surface-700 dark:text-surface-300 mb-2">No recently viewed jobs</h3>
                  <p className="text-surface-500 mb-4">Jobs you view will appear here</p>
                  <Link to="/jobs" className="btn-primary">Explore Jobs</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="card p-6 max-w-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg text-surface-900 dark:text-surface-50">
                  Job Alert Preferences
                </h2>
                <button
                  onClick={enableNotifications}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors
                    ${fcmToken
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'btn-primary text-sm py-2'
                    }`}
                >
                  {fcmToken ? <><Bell size={14} /> Alerts On</> : <><BellOff size={14} /> Enable Alerts</>}
                </button>
              </div>

              <p className="text-sm text-surface-500 mb-5">
                Select categories to receive instant notifications when new jobs are posted.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {JOB_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`
                      flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left
                      ${subCategories.includes(cat.id)
                        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-primary-200'
                      }
                    `}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card p-6 max-w-md">
              <h2 className="font-heading font-bold text-lg text-surface-900 dark:text-surface-50 mb-5">
                Profile Information
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Display Name', value: user.displayName || '–' },
                  { label: 'Email',        value: user.email             },
                  { label: 'Account Type', value: userDoc?.role === 'admin' ? '👑 Admin' : '👤 Job Seeker' },
                  { label: 'Member Since', value: userDoc?.createdAt ? new Date(userDoc.createdAt.seconds * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '–' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                    <span className="text-sm text-surface-500">{label}</span>
                    <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/jobs" className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <span className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                    <Briefcase size={16} className="text-primary-500" /> Browse Jobs
                  </span>
                  <ChevronRight size={16} className="text-surface-400" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
