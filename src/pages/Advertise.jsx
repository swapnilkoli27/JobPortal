// Advertise Page
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Landmark, Target, Award, ArrowUpRight } from 'lucide-react'

const Advertise = () => {
  return (
    <>
      <Helmet>
        <title>Advertise With Us | MyJobUniverse</title>
        <meta name="description" content="Reach premium software developers, analysts, interns, and freshers across India. Promote your brand or job listings to active seekers." />
        <meta property="og:title" content="Advertise With Us | MyJobUniverse" />
        <meta property="og:description" content="Reach premium software developers, analysts, interns, and freshers across India. Promote your brand or job listings to active seekers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/favicon.svg`} />
        <meta property="og:site_name" content="MyJobUniverse" />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="page-container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-black text-4xl md:text-5xl gradient-text mb-4"
            >
              Advertise With Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-surface-500 dark:text-surface-400 max-w-xl mx-auto"
            >
              Reach premium software developers, analysts, interns, and freshers across India. Promote your brand or job listings to active seekers.
            </motion.p>
          </div>

          {/* Ad slots / Packages */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: 'Featured Job Listing',
                  price: '₹999 / post',
                  desc: 'Keep your job post pinned at the very top of results grid. Boost response rate by 5x.',
                },
                {
                  icon: Target,
                  title: 'Targeted Banner Ad',
                  price: '₹4,999 / month',
                  desc: 'Display custom image banners directly inside our results list pages (AdSense-ready placements).',
                },
                {
                  icon: Landmark,
                  title: 'Brand Partnership',
                  price: 'Custom Price',
                  desc: 'Feature your logo in the "Trending Companies" list on our homepage with links to all your open roles.',
                },
              ].map(({ icon: Icon, title, price, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-surface-900 dark:text-surface-50 mb-1">
                      {title}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3">
                      {price}
                    </p>
                    <p className="text-surface-500 dark:text-surface-400 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-8 bg-gradient-card text-center"
            >
              <h2 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 mb-3">
                Ready to Advertise?
              </h2>
              <p className="text-surface-600 dark:text-surface-300 text-sm mb-6 max-w-md mx-auto">
                Get in touch with our marketing and partnerships team to design your custom campaign today.
              </p>
              <a
                href="mailto:hellomyjobuniverse@gmail.com"
                className="btn-primary inline-flex items-center gap-1.5"
              >
                hellomyjobuniverse@gmail.com <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Advertise
