// Reusable ShareModal component for job postings
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Share2 } from 'lucide-react'
import Modal from '../ui/Modal'
import toast from 'react-hot-toast'

const ShareModal = ({ open, onClose, job }) => {
  const [copied, setCopied] = useState(false)
  if (!job) return null

  const jobUrl = `${window.location.origin}/jobs/${job.id}`
  const shareText = `Check out this job opportunity: ${job.title} on MyJobUniverse`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: shareText,
          url: jobUrl,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Sharing failed')
        }
      }
    }
  }

  const platforms = [
    {
      name: 'WhatsApp',
      color: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + jobUrl)}`,
    },
    {
      name: 'LinkedIn',
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
    },
    {
      name: 'Telegram',
      color: 'hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'X / Twitter',
      color: 'hover:bg-surface-50 dark:hover:bg-surface-700/50 hover:border-surface-900 dark:hover:border-surface-100 hover:text-surface-900 dark:hover:text-surface-100',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Share Job Opportunity" size="md">
      <div className="space-y-6">
        {/* Job Info Preview */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-50 dark:bg-surface-700/30 border border-surface-100 dark:border-surface-700/50">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {job.logoUrl ? (
              <img src={job.logoUrl} alt="" className="w-full h-full object-contain p-1 rounded-xl" />
            ) : (
              '💼'
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-bold text-surface-900 dark:text-surface-50 text-sm truncate">
              {job.title}
            </h4>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 truncate">
              {job.company} · {job.location}
            </p>
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 gap-3">
          {platforms.map(platform => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-3 p-3 rounded-2xl border border-surface-200 dark:border-surface-700
                text-surface-700 dark:text-surface-200 font-semibold text-sm transition-all duration-200
                ${platform.color}
              `}
            >
              {platform.icon}
              <span>{platform.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400">
            Or Copy Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={jobUrl}
              className="input text-xs flex-1 bg-surface-50 dark:bg-surface-700/30 text-surface-500 border border-surface-200 dark:border-surface-700 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`
                px-4 py-2 text-xs flex items-center gap-1.5 transition-all font-semibold rounded-xl cursor-pointer
                ${copied 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-glow'
                }
              `}
            >
              {copied ? (
                <><Check size={14} /> Copied</>
              ) : (
                <><Copy size={14} /> Copy</>
              )}
            </button>
          </div>
        </div>

        {/* System share button */}
        {navigator.share && (
          <button
            onClick={handleSystemShare}
            className="w-full btn-secondary py-3 text-sm flex items-center justify-center gap-2 rounded-xl"
          >
            <Share2 size={16} /> Share via System Menu
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full btn-secondary py-3 text-sm font-semibold rounded-xl cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}

export default ShareModal
