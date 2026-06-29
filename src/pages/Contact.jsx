// Contact Us Page
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Message received! We will get back to you shortly. 📩')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | MyJobUniverse</title>
        <meta name="description" content="Get in touch with MyJobUniverse support, advertisement queries, sales, or business development teams." />
        <meta property="og:title" content="Contact Us | MyJobUniverse" />
        <meta property="og:description" content="Get in touch with MyJobUniverse support, advertisement queries, sales, or business development teams." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/favicon.svg`} />
        <meta property="og:site_name" content="MyJobUniverse" />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="page-container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading font-black text-4xl md:text-5xl gradient-text mb-4"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-surface-500 dark:text-surface-400 max-w-xl mx-auto"
            >
              Have questions, feedback, or business inquiries? Drop us a message and we'll reply as soon as possible.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Info panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 md:col-span-1"
            >
              <div className="card p-6 space-y-4">
                <h2 className="font-heading font-bold text-lg text-surface-900 dark:text-surface-50">
                  Contact Details
                </h2>
                <div className="space-y-3.5">
                  {[
                    { icon: Mail, label: 'Email Us', value: 'hellomyjobuniverse@gmail.com' },
                    { icon: Phone, label: 'Call Us', value: '+91 91467 05846' },
                    { icon: MapPin, label: 'Visit Office', value: 'Satara, Maharashtra, India' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-3">
                      <Icon size={16} className="text-primary-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-surface-400 font-medium">{label}</p>
                        <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-gradient-card">
                <h3 className="font-heading font-bold text-sm text-surface-900 dark:text-surface-50 mb-2">
                  ⏰ Support Hours
                </h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                  Monday to Friday: 9:00 AM – 6:00 PM (IST) <br />
                  Emails sent during weekends will be addressed on Monday.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 md:p-8 md:col-span-2"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 block">Your Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 block">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@gmail.com"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 block">Subject</label>
                  <input
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Job Posting Inquiry"
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 block">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write details of your message..."
                    className="input py-3 resize-none"
                  />
                </div>

                <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
                  <Send size={15} /> Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
