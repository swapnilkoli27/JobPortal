// Admin Analytics Page
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { BarChart3, Eye, Briefcase, Star, TrendingUp } from 'lucide-react'
import { getAnalytics } from '../../firebase/firestore'
import { SkeletonAnalyticsCard } from '../../components/ui/Skeleton'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const AnalyticsCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="font-heading font-black text-2xl text-surface-900 dark:text-surface-50">
        {value ?? '–'}
      </p>
      <p className="text-xs text-surface-500 font-medium">{label}</p>
    </div>
  </div>
)

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categoryChartData = stats
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
    : []

  const viewTrend = [
    { day: 'Mon', views: 420 }, { day: 'Tue', views: 680 }, { day: 'Wed', views: 540 },
    { day: 'Thu', views: 890 }, { day: 'Fri', views: 1200 }, { day: 'Sat', views: 760 },
    { day: 'Sun', views: 580 },
  ]

  return (
    <>
      <Helmet>
        <title>Detailed Analytics – MyJobUniverse</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading font-black text-2xl text-surface-900 dark:text-surface-50">
            Performance Analytics
          </h1>
          <p className="text-surface-500 text-sm mt-1">Real-time statistics and channel distribution reports.</p>
        </div>

        {/* Stats row */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonAnalyticsCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <AnalyticsCard icon={Briefcase} label="Total Listings" value={stats?.total} color="bg-primary-600" />
            <AnalyticsCard icon={Eye} label="Cumulative Views" value={stats?.totalViews} color="bg-accent-500" />
            <AnalyticsCard icon={Star} label="Featured Jobs" value={stats?.featured} color="bg-purple-500" />
            <AnalyticsCard icon={TrendingUp} label="Published Channels" value={stats?.published} color="bg-emerald-500" />
          </div>
        )}

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-5">
              Traffic Trend (Job Views)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-5">
              Job Category Distribution
            </h3>
            {categoryChartData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={85}
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
                <div className="space-y-2">
                  {categoryChartData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-surface-600 dark:text-surface-400 capitalize">{item.name}</span>
                      </span>
                      <span className="font-semibold text-surface-900 dark:text-surface-50">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-surface-400 text-sm">
                No active records.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminAnalytics
