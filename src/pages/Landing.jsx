// Landing Page – hero, categories, latest jobs, trending companies
import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import {
  ArrowRight, Sparkles, Users, Briefcase, Building2,
  TrendingUp, CheckCircle2, Zap
} from 'lucide-react'
import { listenToLatestJobs } from '../firebase/firestore'
import { JOB_CATEGORIES } from '../utils/formatters'
import JobCard from '../components/jobs/JobCard'
import JobSearch from '../components/jobs/JobSearch'
import { SkeletonJobCard } from '../components/ui/Skeleton'
import AdBanner from '../components/ads/AdBanner'

// Trending companies (static demo data – replace with Firestore query)
const COMPANIES = [
  { name: 'Google',    logo: '🔵', jobs: 42 },
  { name: 'Microsoft', logo: '🟦', jobs: 38 },
  { name: 'Amazon',    logo: '🟠', jobs: 65 },
  { name: 'Flipkart',  logo: '🛒', jobs: 29 },
  { name: 'Infosys',   logo: '🏢', jobs: 87 },
  { name: 'TCS',       logo: '🌐', jobs: 120},
  { name: 'Wipro',     logo: '💡', jobs: 54 },
  { name: 'Zomato',    logo: '🍕', jobs: 18 },
]



const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const Landing = () => {
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(true)
  const navigate  = useNavigate()

  // Real-time job listener
  useEffect(() => {
    const unsub = listenToLatestJobs(newJobs => {
      setJobs(newJobs)
      setLoading(false)
    }, 8)
    return unsub
  }, [])

  return (
    <>
      <Helmet>
        <title>MyJobUniverse – Find Your Dream Job in India</title>
        <meta name="description"
          content="Discover thousands of job opportunities in India. Search by category, location, and salary. Apply instantly to top companies." />
        <meta property="og:title"       content="MyJobUniverse – Find Your Dream Job in India" />
        <meta property="og:description" content="India's fastest growing job universe." />
        <meta property="og:type"        content="website" />
      </Helmet>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-surface-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(79,70,229,0.2),_transparent_60%)]" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="page-container relative z-10 py-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >


            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
            >
              Find Your{' '}
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />Without the Hassle
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-base text-white/70 mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Your gateway to top-tier opportunities. Explore verified listings from elite brands, and receive instant, real-time alerts for the newest job posts.
            </motion.p>

            {/* Search bar */}
            <motion.div variants={fadeUp} className="max-w-2xl mx-auto mb-8">
              <JobSearch
                placeholder="Search job title, company or skill..."
                className="w-full"
                onSearch={term => navigate(`/jobs?search=${encodeURIComponent(term)}`)}
              />
            </motion.div>


          </motion.div>


        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
              className="fill-surface-50 dark:fill-surface-950" />
          </svg>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="py-16 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="section-title">Browse by <span className="gradient-text">Category</span></h2>
          <p className="section-subtitle">Find the perfect role in your field</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {JOB_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={`/jobs?category=${cat.id}`}
                className="card-glass p-5 flex flex-col items-center gap-3 text-center rounded-2xl group cursor-pointer block"
                aria-label={`Browse ${cat.label} jobs`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Ad Banner ────────────────────────────────────────────────── */}
      <AdBanner slot="after-categories" />

      {/* ── Latest Jobs ──────────────────────────────────────────────── */}
      <section className="py-16 bg-surface-100 dark:bg-surface-900/50">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title flex items-center gap-2">
                <Zap size={24} className="text-accent-500" />
                Latest <span className="gradient-text">Opportunities</span>
              </h2>
              <p className="section-subtitle">Updated in real-time · No refresh needed</p>
            </motion.div>

            <Link
              to="/jobs"
              className="btn-outline text-sm hidden md:flex"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonJobCard key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-surface-500">No jobs posted yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/jobs" className="btn-primary">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trending Companies ────────────────────────────────────────── */}
      <section className="py-16 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="section-title flex items-center justify-center gap-2">
            <TrendingUp size={24} className="text-primary-500" />
            Trending <span className="gradient-text">Companies</span>
          </h2>
          <p className="section-subtitle">Top employers hiring right now</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {COMPANIES.map((co, i) => (
            <motion.div
              key={co.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                to={`/jobs?company=${co.name}`}
                className="card p-5 flex flex-col items-center gap-3 group text-center"
              >
                <span className="text-4xl">{co.logo}</span>
                <p className="font-heading font-semibold text-surface-800 dark:text-surface-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {co.name}
                </p>
                <span className="badge-accent text-xs">{co.jobs} open roles</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-4xl overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 p-10 md:p-16 text-center relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),_transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Create your profile today and receive instant, real-time notifications of recent job posts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login" className="btn-accent text-base px-8 py-4">
                  Get Started Free
                </Link>
                <Link to="/jobs" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-colors">
                  Browse Jobs <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Landing
