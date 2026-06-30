// JobCard – card for displaying a single job listing
import { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Clock, DollarSign, Bookmark, BookmarkCheck,
  Star, TrendingUp, Share2
} from 'lucide-react'
import { timeAgo, formatSalary, WORK_MODE_LABELS, JOB_CATEGORIES } from '../../utils/formatters'
import { useBookmarks } from '../../hooks/useBookmarks'
import { useAuth } from '../../contexts/AuthContext'
import Badge from '../ui/Badge'
import ShareModal from '../common/ShareModal'

const JobCard = memo(({ job, index = 0 }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [shareOpen, setShareOpen] = useState(false)
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const saved    = isBookmarked(job.id)
  const category = JOB_CATEGORIES.find(c => c.id === job.category)

  const workModeBadge = {
    remote: 'accent',
    hybrid: 'warning',
    onsite: 'gray',
  }

  return (
    <motion.article
      className="card p-5 group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -4 }}
      aria-label={`${job.title} at ${job.company}`}
    >
      {/* Featured badge */}
      {job.featured && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            <Star size={10} className="fill-current" /> FEATURED
          </span>
        </div>
      )}

      {/* Gradient hover overlay */}
      <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Company logo */}
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 flex-shrink-0 ring-2 ring-surface-100 dark:ring-surface-700">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain p-1"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {category?.icon || '💼'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link to={`/jobs/${job.id}`}>
              <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 text-base leading-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                {job.title}
              </h3>
            </Link>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5 font-medium">
              {job.company}
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs text-surface-500 dark:text-surface-400">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} className="flex-shrink-0" /> {job.location}
            </span>
          )}
          {(job.salaryMin || job.salaryMax) && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <DollarSign size={11} /> {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          )}
          {job.postedAt && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {timeAgo(job.postedAt)}
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {category && (
            <span className={`badge text-xs ${category.color}`}>
              {category.icon} {category.label}
            </span>
          )}
          {job.workMode && (
            <Badge variant={workModeBadge[job.workMode] || 'gray'}>
              {WORK_MODE_LABELS[job.workMode] || job.workMode}
            </Badge>
          )}
          {job.experience && (
            <Badge variant="gray">{job.experience}</Badge>
          )}
        </div>

        {/* Skills preview */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Array.isArray(job.skills) ? job.skills : job.skills.split(',')).slice(0, 3).map(skill => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-lg"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700">
          <div className="flex items-center gap-2 text-xs text-surface-400">
            {job.views > 0 && (
              <span className="flex items-center gap-1">
                <TrendingUp size={11} /> {job.views} views
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            {/* Share */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShareOpen(true)
              }}
              className="p-2 rounded-xl text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer"
              aria-label="Share job"
            >
              <Share2 size={16} />
            </motion.button>

            {/* Bookmark */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (!user) {
                  navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
                  return
                }
                toggleBookmark(job)
              }}
              className={`
                p-2 rounded-xl transition-all duration-200 cursor-pointer
                ${saved
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }
              `}
              aria-label={saved ? 'Remove bookmark' : 'Save job'}
            >
              {saved
                ? <BookmarkCheck size={16} className="fill-current" />
                : <Bookmark size={16} />
              }
            </motion.button>

            {/* View Info */}
            <Link
              to={`/jobs/${job.id}`}
              className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-xl"
            >
              View Info
            </Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        job={job}
      />
    </motion.article>
  )
})

JobCard.displayName = 'JobCard'
export default JobCard
