// Footer component
import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Mail, ExternalLink } from 'lucide-react'
import { JOB_CATEGORIES } from '../../utils/formatters'

// Social icon SVGs (lucide renamed Github/Twitter/Linkedin in newer versions)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const Footer = () => (
  <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300 mt-16">
    <div className="page-container py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
              <BriefcaseBusiness size={18} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">MyJobUniverse</span>
          </Link>
          <p className="text-sm leading-relaxed text-surface-400">
            India's fastest growing job universe. Find your dream job or hire the best talent.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              { Icon: Mail,         href: 'mailto:hellomyjobuniverse@gmail.com', label: 'Email', isLucide: true },
            ].map(({ Icon, href, label, isLucide }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200"
              >
                {isLucide ? <Mail size={16} /> : <Icon />}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-heading font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Browse Jobs',   to: '/jobs'       },
              { label: 'Categories',    to: '/categories' },
              { label: 'Companies',     to: '/companies'  },
              { label: 'Dashboard',     to: '/dashboard'  },
              { label: 'Saved Jobs',    to: '/dashboard/bookmarks' },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-heading font-semibold mb-4">Popular Categories</h3>
          <ul className="space-y-2.5 text-sm">
            {JOB_CATEGORIES.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <Link
                  to={`/jobs?category=${cat.id}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {cat.icon} {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-heading font-semibold mb-4">Company</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'About Us',       to: '/about'   },
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Use',   to: '/terms'   },
              { label: 'Contact Us',     to: '/contact' },
              { label: 'Advertise',      to: '/advertise' },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="divider mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface-500">
        <p>© {new Date().getFullYear()} MyJobUniverse. All rights reserved.</p>
        <p>Made with ❤️ in India</p>
      </div>
    </div>
  </footer>
)

export default Footer
