// About Us Page
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Users, Award, ShieldCheck, Heart } from 'lucide-react'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us – MyJobUniverse</title>
        <meta name="description" content="Learn more about MyJobUniverse, our mission, vision, and core values." />
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
              Our Mission
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-surface-500 dark:text-surface-400 max-w-xl mx-auto"
            >
              Connecting the brightest talent with India's leading organizations, making the hiring process seamless, transparent, and rewarding.
            </motion.p>
          </div>

          {/* Core Content */}
          <div className="space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 bg-gradient-card"
            >
              <h2 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 mb-4">
                Who We Are
              </h2>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed text-sm">
                Founded in 2026, MyJobUniverse has rapidly grown to become a trusted destination for job seekers and recruiters across India. We believe that finding a job should not be a chore, and finding the perfect candidate should not require digging through thousands of irrelevant profiles. By leveraging modern technology, smart search filters, and real-time alerts, we simplify recruitment for everyone.
              </p>
            </motion.section>

            {/* Core Values */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-surface-900 dark:text-surface-50 mb-8 text-center">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Users,
                    title: 'People First',
                    desc: 'We build products that empower individuals and build communities.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Trust & Security',
                    desc: 'Every single job posting is verified manually to protect our users.',
                  },
                  {
                    icon: Award,
                    title: 'Innovation',
                    desc: 'We continually refine our filtering and notification logic to keep you ahead.',
                  },
                  {
                    icon: Heart,
                    title: 'Passionate Support',
                    desc: 'We are committed to helping you land your dream job with active guidance.',
                  },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="card p-6 flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-surface-900 dark:text-surface-50 mb-1">
                        {title}
                      </h3>
                      <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
