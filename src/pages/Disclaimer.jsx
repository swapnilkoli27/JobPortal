// Disclaimer Page
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, ShieldCheck, Scale } from 'lucide-react'

const Disclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer – MyJobUniverse</title>
        <meta name="description" content="Read the disclaimer regarding job listings, recruiter information, and content on MyJobUniverse." />
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
              Disclaimer
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-surface-500 dark:text-surface-400"
            >
              Last updated: June 29, 2026
            </motion.p>
          </div>

          {/* Disclaimer Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {[
              {
                icon: Info,
                title: '1. General Information Only',
                content: 'All content and job postings available on MyJobUniverse are provided for general informational and educational purposes only. While we endeavor to keep the listings accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the jobs or related graphics.',
              },
              {
                icon: AlertTriangle,
                title: '2. No Verification of Recruiters',
                content: 'We do not verify the authenticity, creditworthiness, or legal status of the employers or recruitment agencies posting on our portal. Users are strongly advised to perform their own background research, verification, and standard diligence before applying for any job, attending interviews, or sharing sensitive personal or financial information with recruiters.',
              },
              {
                icon: ShieldCheck,
                title: '3. No Financial Transactions',
                content: 'MyJobUniverse is 100% free for job seekers. We never charge money, fees, or security deposits for job placements, applications, or interviews. If any recruiter, employer, or agent posing as a representative of a company asks for payment in exchange for a job offer, treat it as a scam and report it immediately. We are not responsible for any financial loss incurred by users.',
              },
              {
                icon: Scale,
                title: '4. Limitation of Liability',
                content: 'In no event will MyJobUniverse, its creators, or partners be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data, jobs, career opportunities, or profits arising out of, or in connection with, the use of this website.',
              },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
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

export default Disclaimer
