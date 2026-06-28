// Privacy Policy Page
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Eye, Shield, Key, Database } from 'lucide-react'

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – MyJobUniverse</title>
        <meta name="description" content="Learn how MyJobUniverse collects, uses, and safeguards your personal data." />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="page-container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-black text-4xl md:text-5xl gradient-text mb-4"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-surface-500 dark:text-surface-400"
            >
              Last updated: June 28, 2026
            </motion.p>
          </div>

          {/* Privacy Blocks */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {[
              {
                icon: Database,
                title: '1. Information We Collect',
                content: 'We collect information you provide directly to us when creating an account, editing your profile, or subscribing to job alerts. This includes your name, email address, profile picture (if logging in via Google), and job search category preferences.',
              },
              {
                icon: Eye,
                title: '2. How We Use Your Data',
                content: 'We use the collected information to personalize your dashboard, manage bookmarks, track recently viewed jobs, and route real-time category alerts to you via Firebase Cloud Messaging. We do not sell your personal data to advertisers.',
              },
              {
                icon: Shield,
                title: '3. Data Security & Storage',
                content: 'Your data is securely stored inside Firebase Authentication and Firestore Database. We utilize secure security rules configuration to block unauthorized reads/writes to your personal profile.',
              },
              {
                icon: Key,
                title: '4. Your Choices & Access',
                content: 'You can update your account profile details, modify category alert preferences, or unsubscribe from push notifications directly inside your user dashboard settings at any time.',
              },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <h2 className="font-heading font-bold text-xl text-surface-900 dark:text-surface-50">
                    {title}
                  </h2>
                </div>
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed pl-13">
                  {content}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Privacy
