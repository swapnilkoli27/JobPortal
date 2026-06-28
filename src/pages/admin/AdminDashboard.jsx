// Admin Dashboard – overview cards, analytics, recent activity
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  Briefcase, Eye, Star, FileDiff, TrendingUp, Plus,
  Upload, BarChart3, Users, ArrowUpRight
} from 'lucide-react'
import { getAnalytics, getAllJobsAdmin } from '../../firebase/firestore'
import { SkeletonAnalyticsCard } from '../../components/ui/Skeleton'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const StatCard = ({ icon: Icon, label, value, delta, color, to }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card p-5"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      {to && (
        <Link to={to} className="text-surface-400 hover:text-primary-600 transition-colors">
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
    <p className="font-heading font-black text-3xl text-surface-900 dark:text-surface-50 mb-1">
      {value ?? '–'}
    </p>
    <p className="text-sm text-surface-500">{label}</p>
    {delta != null && (
      <p className={`text-xs font-semibold mt-1 ${delta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% this week
      </p>
    )}
  </motion.div>
)

const AdminDashboard = () => {
  const [stats,      setStats]      = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      const [analytics, jobs] = await Promise.all([
        getAnalytics(),
        getAllJobsAdmin(),
      ])
      setStats(analytics)
      setRecentJobs(jobs.slice(0, 5))
      setLoading(false)
    }
    load().catch(console.error)
  }, [])

  // Chart data from category breakdown
  const categoryChartData = stats
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
    : []

  // Mock weekly view trend (replace with Firestore analytics in production)
  const viewTrend = [
    { day: 'Mon', views: 420 }, { day: 'Tue', views: 680 }, { day: 'Wed', views: 540 },
    { day: 'Thu', views: 890 }, { day: 'Fri', views: 1200 }, { day: 'Sat', views: 760 },
    { day: 'Sun', views: 580 },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard – JobPortal</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-2xl text-surface-900 dark:text-surface-50">
              Dashboard
            </h1>
            <p className="text-surface-500 text-sm mt-1">Welcome back, Admin! Here's your portal overview.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/jobs/new" className="btn-primary text-sm">
              <Plus size={16} /> Add Job
            </Link>
            <Link to="/admin/jobs" className="btn-secondary text-sm hidden sm:flex">
              <Briefcase size={16} /> Manage Jobs
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonAnalyticsCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={Briefcase}   label="Total Jobs"   value={stats?.total}      color="bg-primary-600"  to="/admin/jobs" />
            <StatCard icon={TrendingUp}  label="Published"    value={stats?.published}   color="bg-emerald-500" to="/admin/jobs?status=published" />
            <StatCard icon={FileDiff}    label="Drafts"       value={stats?.drafts}      color="bg-amber-500"   to="/admin/jobs?status=draft" />
            <StatCard icon={Eye}         label="Total Views"  value={stats?.totalViews}  color="bg-accent-500"  />
            <StatCard icon={Star}        label="Featured"     value={stats?.featured}    color="bg-purple-500"  />
            <StatCard icon={Users}       label="Top Company"  value={stats?.topCompanies?.[0]?.name || '–'} color="bg-rose-500" />
            <StatCard icon={BarChart3}   label="Categories"   value={Object.keys(stats?.byCategory || {}).length} color="bg-indigo-500" to="/admin/analytics" />
            <StatCard icon={Upload}      label="Bulk Upload"  value="CSV/XLS"            color="bg-teal-500"    to="/admin/jobs" />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* View trend */}
          <div className="lg:col-span-2 card p-6">
            <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-5">
              Weekly Job Views
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={viewTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', r: 5 }}
                  activeDot={{ r: 8, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category pie */}
          <div className="card p-6">
            <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-5">
              Jobs by Category
            </h3>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,23,42,0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-surface-400 text-sm">
                No data yet
              </div>
            )}
            {/* Legend */}
            <div className="space-y-1.5 mt-3">
              {categoryChartData.slice(0, 5).map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-surface-600 dark:text-surface-400 capitalize">{item.name}</span>
                  </span>
                  <span className="font-semibold text-surface-900 dark:text-surface-50">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent jobs table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50">Recent Jobs</h3>
            <Link to="/admin/jobs" className="btn-ghost text-sm">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-surface-500 border-b border-surface-100 dark:border-surface-700">
                  <th className="pb-3 font-medium">Job Title</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Company</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Category</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Views</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(job => (
                  <tr key={job.id} className="border-b border-surface-50 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-surface-900 dark:text-surface-100 truncate max-w-[160px]">
                        {job.title}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-surface-500 hidden md:table-cell truncate max-w-[120px]">
                      {job.company}
                    </td>
                    <td className="py-3 pr-4 text-surface-500 capitalize hidden lg:table-cell">
                      {job.category}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge text-xs ${
                        job.status === 'published'
                          ? 'badge-success'
                          : job.status === 'draft'
                          ? 'badge-warning'
                          : 'badge-error'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-surface-500 hidden sm:table-cell">{job.views || 0}</td>
                    <td className="py-3">
                      <Link to={`/admin/jobs/edit/${job.id}`} className="btn-ghost text-xs py-1">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentJobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-surface-400">
                      No jobs yet. <Link to="/admin/jobs/new" className="text-primary-600 hover:underline">Create your first job</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/admin/jobs/new',  icon: Plus,    label: 'Create New Job',   desc: 'Add a job in seconds',         color: 'from-primary-600 to-primary-800' },
            { to: '/admin/jobs',      icon: Upload,  label: 'Bulk Upload',      desc: 'Import CSV/Excel file',        color: 'from-accent-500 to-accent-700'   },
            { to: '/admin/analytics', icon: BarChart3,label: 'View Analytics',  desc: 'Detailed performance report', color: 'from-emerald-500 to-emerald-700' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className={`card p-5 bg-gradient-to-br ${color} text-white group hover:shadow-glow transition-all duration-300`}
            >
              <Icon size={28} className="mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-heading font-bold text-lg">{label}</p>
              <p className="text-white/70 text-sm mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
