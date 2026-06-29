// 404 Not Found Page
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Home, Search } from 'lucide-react'

const NotFound = () => (
  <>
    <Helmet>
      <title>404 – Page Not Found | MyJobUniverse</title>
      <meta name="description" content="The page you are looking for does not exist on MyJobUniverse. Return to our homepage to find latest job opportunities." />
      <meta property="og:title" content="404 – Page Not Found | MyJobUniverse" />
      <meta property="og:description" content="The page you are looking for does not exist on MyJobUniverse. Return to our homepage to find latest job opportunities." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content={`${window.location.origin}/favicon.svg`} />
      <meta property="og:site_name" content="MyJobUniverse" />
    </Helmet>
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-8xl mb-6"
        >
          🔍
        </motion.div>
        <h1 className="font-heading font-black text-6xl gradient-text mb-4">404</h1>
        <h2 className="font-heading font-bold text-2xl text-surface-800 dark:text-surface-200 mb-3">
          Oops! Page not found
        </h2>
        <p className="text-surface-500 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={18} /> Go Home
          </Link>
          <Link to="/jobs" className="btn-secondary">
            <Search size={18} /> Browse Jobs
          </Link>
        </div>
      </motion.div>
    </div>
  </>
)

export default NotFound
