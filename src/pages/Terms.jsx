// Terms of Use Page
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Scale, FileText, CheckCircle2, AlertOctagon } from 'lucide-react'

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | MyJobUniverse</title>
        <meta name="description" content="Read the terms of use and service agreements governing the use of the MyJobUniverse website and features." />
        <meta property="og:title" content="Terms & Conditions | MyJobUniverse" />
        <meta property="og:description" content="Read the terms of use and service agreements governing the use of the MyJobUniverse website and features." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/favicon.svg`} />
        <meta property="og:site_name" content="MyJobUniverse" />
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
              Terms of Use
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

          {/* Terms Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {[
              {
                icon: FileText,
                title: '1. Agreement to Terms',
                content: 'By accessing or using MyJobUniverse, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.',
              },
              {
                icon: CheckCircle2,
                title: '2. User Registration & Conduct',
                content: 'When registering an account, you must provide accurate, current info. You are responsible for safeguarding your login credentials. Any activity under your account remains your responsibility. Spamming job listings, submitting misleading resumes, or extracting database content via scrapers is strictly prohibited.',
              },
              {
                icon: Scale,
                title: '3. Job Listings & Third-Party Applications',
                content: 'MyJobUniverse publishes job listings which may redirect you to external application links. We do not guarantee the validity or accuracy of external job applications or employer details. You are advised to perform standard verification before sharing sensitive personal details with recruiters.',
              },
              {
                icon: AlertOctagon,
                title: '4. Limitation of Liability',
                content: 'MyJobUniverse is provided "as is" without warranty of any kind. We are not liable for any direct or indirect damages, employment losses, or recruitment expenses resulting from your use of the platform.',
              },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
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

export default Terms
