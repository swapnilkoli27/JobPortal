// Job Detail Page – full job info with schema, share, bookmark, similar jobs
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  MapPin, DollarSign, Clock, Briefcase, Calendar, Eye,
  Bookmark, BookmarkCheck, ExternalLink, Share2,
  ArrowLeft, Star, Building2
} from 'lucide-react'
import { getJob, getSimilarJobs } from '../firebase/firestore'
import { saveRecentlyViewed } from '../firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { useBookmarks } from '../hooks/useBookmarks'
import { formatDate, formatSalary, timeAgo, WORK_MODE_LABELS, EXPERIENCE_LABELS, JOB_CATEGORIES } from '../utils/formatters'
import { generateJobPostingSchema, injectSchema } from '../utils/schema'
import { SkeletonJobDetail } from '../components/ui/Skeleton'
import JobCard from '../components/jobs/JobCard'
import AdBanner from '../components/ads/AdBanner'
import toast from 'react-hot-toast'
import ShareModal from '../components/common/ShareModal'

const JobDetail = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [shareOpen, setShareOpen] = useState(false)

  const [job,          setJob]          = useState(null)
  const [similarJobs,  setSimilarJobs]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [notFound,     setNotFound]     = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await getJob(id)
      if (!data) { setNotFound(true); setLoading(false); return }

      setJob(data)
      setLoading(false)

      // Save recently viewed
      if (user) saveRecentlyViewed(user.uid, id).catch(() => {})

      // Inject JSON-LD schema
      const schema = generateJobPostingSchema(data)
      const cleanup = injectSchema(schema)

      // Fetch similar jobs
      getSimilarJobs(data.category, id, 3).then(setSimilarJobs).catch(() => {})

      return cleanup
    }

    const cleanup = load()
    return () => { cleanup.then(fn => fn?.()) }
  }, [id, user])

  const handleShare = () => {
    setShareOpen(true)
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 mb-2">Job Not Found</h1>
          <p className="text-surface-500 mb-6">This job may have been removed or expired.</p>
          <Link to="/jobs" className="btn-primary">Browse Other Jobs</Link>
        </div>
      </div>
    )
  }

  const category = job ? JOB_CATEGORIES.find(c => c.id === job.category) : null

  return (
    <>
      {job && (
        <Helmet>
          <title>{job.title} at {job.company} – MyJobUniverse</title>
          <meta name="description" content={`${job.title} at ${job.company} in ${job.location}. ${formatSalary(job.salaryMin, job.salaryMax)}. Apply now on MyJobUniverse.`} />
          <meta property="og:title"       content={`${job.title} at ${job.company}`} />
          <meta property="og:description" content={`${job.location} · ${formatSalary(job.salaryMin, job.salaryMax)}`} />
          <meta property="og:image"       content={job.logoUrl || ''} />
          <meta property="og:type"        content="article" />
        </Helmet>
      )}

      <div className="pt-20 min-h-screen">
        <div className="page-container py-8">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost mb-6 text-sm"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </button>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="card p-8"><SkeletonJobDetail /></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header card */}
                <div className="card p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    {/* Company logo */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 flex-shrink-0 ring-2 ring-surface-100 dark:ring-surface-700">
                      {job.logoUrl ? (
                        <img src={job.logoUrl} alt={job.company} className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {category?.icon || '💼'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h1 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 leading-tight mb-1">
                            {job.title}
                          </h1>
                          <p className="text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1.5">
                            <Building2 size={15} /> {job.company}
                          </p>
                        </div>
                        {job.featured && (
                          <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                            <Star size={11} className="fill-current" /> FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { icon: MapPin,    label: 'Location',   value: job.location              },
                      { icon: DollarSign,label: 'Salary',     value: formatSalary(job.salaryMin, job.salaryMax), green: true },
                      { icon: Briefcase, label: 'Experience', value: EXPERIENCE_LABELS[job.experience] || job.experience },
                      { icon: Clock,     label: 'Work Mode',  value: WORK_MODE_LABELS[job.workMode] || job.workMode },
                      { icon: Calendar,  label: 'Last Date',  value: job.lastDate ? formatDate(job.lastDate) : 'Not specified' },
                      { icon: Eye,       label: 'Views',      value: `${job.views || 0} views` },
                    ].filter(i => i.value).map(({ icon: Icon, label, value, green }) => (
                      <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                        <Icon size={16} className={`flex-shrink-0 mt-0.5 ${green ? 'text-emerald-500' : 'text-primary-500'}`} />
                        <div>
                          <p className="text-xs text-surface-400 font-medium">{label}</p>
                          <p className={`text-sm font-semibold mt-0.5 ${green ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-800 dark:text-surface-200'}`}>
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(job.skills) ? job.skills : job.skills.split(',')).map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-200 dark:border-primary-800"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category badge */}
                  {category && (
                    <span className={`badge ${category.color} mb-6 inline-flex`}>
                      {category.icon} {category.label}
                    </span>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    {job.applyLink && (
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 sm:flex-none justify-center"
                      >
                        Apply Now <ExternalLink size={16} />
                      </a>
                    )}

                    <button
                      onClick={() => toggleBookmark(job)}
                      className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border-2 transition-all
                        ${isBookmarked(job.id)
                          ? 'bg-primary-50 border-primary-400 text-primary-600 dark:bg-primary-900/30 dark:border-primary-600 dark:text-primary-400'
                          : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-primary-400 hover:text-primary-600'
                        }
                      `}
                    >
                      {isBookmarked(job.id)
                        ? <><BookmarkCheck size={18} className="fill-current" /> Saved</>
                        : <><Bookmark size={18} /> Save Job</>
                      }
                    </button>

                    <button
                      onClick={handleShare}
                      className="btn-ghost border-2 border-surface-200 dark:border-surface-700 px-5"
                    >
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="card p-6 md:p-8">
                  <h2 className="font-heading font-bold text-lg text-surface-900 dark:text-surface-50 mb-4">
                    Job Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-heading prose-a:text-primary-600"
                    dangerouslySetInnerHTML={{ __html: job.description || '' }}
                  />
                </div>

                {/* Ad */}
                <AdBanner slot="job-detail" />
              </motion.div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick info card */}
                <motion.div
                  className="card p-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-4">
                    Job Overview
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Posted',      value: timeAgo(job.postedAt)              },
                      { label: 'Deadline',    value: job.lastDate ? formatDate(job.lastDate) : 'Open'  },
                      { label: 'Category',    value: category?.label || job.category    },
                      { label: 'Work Mode',   value: WORK_MODE_LABELS[job.workMode] || job.workMode },
                      { label: 'Experience',  value: EXPERIENCE_LABELS[job.experience] || job.experience },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className="text-surface-500">{label}</span>
                        <span className="text-surface-900 dark:text-surface-100 font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {job.applyLink && (
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full justify-center mt-5"
                    >
                      Apply Now <ExternalLink size={16} />
                    </a>
                  )}
                </motion.div>

                {/* Similar jobs */}
                {similarJobs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-4">
                      Similar Jobs
                    </h3>
                    <div className="space-y-4">
                      {similarJobs.map((sj, i) => (
                        <JobCard key={sj.id} job={sj} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        job={job}
      />
    </>
  )
}

export default JobDetail
