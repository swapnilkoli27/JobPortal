// Categories Page – browse jobs by industry/domain
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { JOB_CATEGORIES } from '../utils/formatters'

const Categories = () => {
  return (
    <>
      <Helmet>
        <title>Browse Categories – MyJobUniverse</title>
        <meta name="description" content="Explore job openings across various domains, industries, and technological fields." />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="page-container">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-black text-4xl md:text-5xl gradient-text mb-4"
            >
              Browse by Category
            </motion.h1>
            <p className="text-surface-500 max-w-md mx-auto text-sm">
              Select an industry or technical domain to find your next career opportunity.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {JOB_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  to={`/jobs?category=${cat.id}`}
                  className="card-glass p-6 flex flex-col items-center gap-3 text-center rounded-2xl group cursor-pointer block h-full justify-center"
                  aria-label={`Browse ${cat.label} jobs`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Categories
