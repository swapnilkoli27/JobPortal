// Job Listings Page – search results with filters and infinite scroll
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { BriefcaseBusiness, SearchX } from 'lucide-react'
import { useJobs } from '../hooks/useJobs'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useAuth } from '../contexts/AuthContext'
import { JOB_CATEGORIES } from '../utils/formatters'
import JobCard from '../components/jobs/JobCard'
import JobFilters from '../components/jobs/JobFilters'
import JobSearch from '../components/jobs/JobSearch'
import { SkeletonJobCard } from '../components/ui/Skeleton'

const SearchResults = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialFilters = {
    search:     searchParams.get('search')   || undefined,
    category:   searchParams.get('category') || undefined,
    workMode:   searchParams.get('workMode') || undefined,
    experience: searchParams.get('experience') || undefined,
    featured:   searchParams.get('featured') === 'true' ? true : undefined,
    sort:       searchParams.get('sort')     || 'newest',
  }

  const { jobs, loading, error, hasMore, filters, updateFilters, clearFilters, loadMore } = useJobs(initialFilters)
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading && !error)

  // Sync URL with filters
  useEffect(() => {
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = String(v) })
    setSearchParams(params, { replace: true })
  }, [filters])

  const handleSearch = (term) => updateFilters({ search: term })

  const handleQuickLink = (category) => {
    updateFilters({
      search: '',
      location: '',
      experience: '',
      jobType: '',
      workMode: '',
      salaryMin: '',
      category: category
    })
  }

  const categoryObject = JOB_CATEGORIES.find(c => c.id === filters.category)
  const categoryLabel = categoryObject ? categoryObject.label : ''
  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'undefined').length

  const getSeoTitle = () => {
    if (filters.search && categoryLabel) {
      return `"${filters.search}" in ${categoryLabel} Jobs | MyJobUniverse`
    }
    if (filters.search) {
      return `"${filters.search}" Jobs | MyJobUniverse`
    }
    if (categoryLabel) {
      return `${categoryLabel} Jobs in India | MyJobUniverse`
    }
    return 'Find Your Next Job – Browse All Jobs | MyJobUniverse'
  }

  return (
    <>
      <Helmet>
        <title>{getSeoTitle()}</title>
        <meta name="description"
          content={`Search and filter thousands of ${categoryLabel || 'IT & non-IT'} job listings in India. Find career opportunities matching your skills and experience.`} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Search header */}
        <div className="bg-gradient-to-br from-primary-950 to-surface-900 py-10">
          <div className="page-container">
            <motion.h1
              className="font-heading font-bold text-2xl text-white mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {filters.search ? `Results for "${filters.search}"` : 'Browse All Jobs'}
            </motion.h1>
            <JobSearch
              initialValue={filters.search || ''}
              onSearch={handleSearch}
              className="max-w-2xl"
            />
          </div>
        </div>

        <div className="page-container py-8">
          {/* Results header with Filter trigger & Sort selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-200/60 dark:border-surface-700/60">
            <div className="flex items-center gap-3">
              <JobFilters
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
              />
              <div>
                <p className="font-semibold text-surface-900 dark:text-surface-50 text-base">
                  {loading ? 'Searching...' : `${jobs.length}${hasMore ? '+' : ''} jobs found`}
                </p>
                {activeFilterCount > 0 && (
                  <p className="text-xs text-surface-500 mt-0.5">
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500 font-medium">Sort by:</span>
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="input text-sm max-w-[180px] py-1.5 px-3 cursor-pointer bg-white dark:bg-surface-800"
              >
                <option value="newest">Newest First</option>
                <option value="featured">Featured First</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Job grid */}
          {loading && jobs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonJobCard key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <p className="text-4xl mb-3">⚠️</p>
              <h3 className="font-heading font-semibold text-xl text-red-600 dark:text-red-400 mb-2">
                Database Query Error
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-5 text-sm max-w-lg mx-auto break-words">
                {error}
              </p>
              {error.toLowerCase().includes('index') && (
                <div className="mb-5">
                  {error.match(/https:\/\/console\.firebase\.google\.com[^\s]+/i) ? (
                    <div className="space-y-3">
                      <a
                        href={error.match(/https:\/\/console\.firebase\.google\.com[^\s]+/i)[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent py-2.5 px-5 text-sm inline-flex items-center gap-2 shadow-glow-accent"
                      >
                        ⚡ Create Index in Firebase
                      </a>
                      <p className="text-xs text-surface-400 dark:text-surface-500 max-w-md mx-auto leading-relaxed">
                        Click the button above to automatically set up the required composite index in your Firebase console. Once created, wait 2-3 minutes for the build to finish, then try again.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-surface-400 dark:text-surface-500 leading-relaxed max-w-md mx-auto">
                      💡 <strong>Action Required:</strong> In Firestore, queries filtering on one field and sorting on another require a composite index. Please check your browser's Developer Console (F12) to find the index link.
                    </p>
                  )}
                </div>
              )}
              <button onClick={clearFilters} className="btn-primary">
                Reset & Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16 px-4">
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-950/30 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400 shadow-glass border border-primary-100 dark:border-primary-900/50">
                <SearchX size={36} />
              </div>
              
              <h3 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 mb-3">
                No jobs available right now
              </h3>
              
              <p className="text-surface-500 dark:text-surface-400 text-base max-w-md mx-auto mb-10 leading-relaxed">
                We're currently updating this category with new opportunities.
              </p>
              
              <div className="card-glass p-6 md:p-8 text-left rounded-3xl border border-surface-200/50 dark:border-surface-700/50 shadow-glass max-w-md mx-auto mb-8">
                <h4 className="font-heading font-bold text-xs text-surface-400 uppercase tracking-wider mb-4">
                  Meanwhile, you can:
                </h4>
                
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => clearFilters()}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left text-sm font-semibold text-surface-700 dark:text-surface-300 transition-colors group cursor-pointer"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">🔥</span>
                      <span>Browse the latest jobs</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleQuickLink('internship')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left text-sm font-semibold text-surface-700 dark:text-surface-300 transition-colors group cursor-pointer"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">🎓</span>
                      <span>View internships</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleQuickLink('software')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left text-sm font-semibold text-surface-700 dark:text-surface-300 transition-colors group cursor-pointer"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">💻</span>
                      <span>Explore Software Development jobs</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleQuickLink('ai-ml')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left text-sm font-semibold text-surface-700 dark:text-surface-300 transition-colors group cursor-pointer"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">🤖</span>
                      <span>Check AI/ML openings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleQuickLink('data-analyst')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left text-sm font-semibold text-surface-700 dark:text-surface-300 transition-colors group cursor-pointer"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">📊</span>
                      <span>View Data Analyst jobs</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => clearFilters()}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                Or return to All Jobs.
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map((job, i) => <JobCard key={job.id} job={job} index={i % 9} />)}
              </div>

              {/* Loading more */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonJobCard key={i} />)}
                </div>
              )}

              {/* End message */}
              {!hasMore && jobs.length > 0 && (
                <div className="text-center py-10">
                  <BriefcaseBusiness size={32} className="mx-auto text-surface-300 mb-2" />
                  <p className="text-surface-500 text-sm">You've seen all jobs!</p>
                </div>
              )}
            </>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />
        </div>
      </div>
    </>
  )
}

export default SearchResults
