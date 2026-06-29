// Ad Banner placeholder – Google AdSense ready
import { useEffect, useRef } from 'react'

/**
 * AdBanner component.
 * In development shows a placeholder.
 * In production with a real VITE_ADSENSE_PUBLISHER_ID it injects the AdSense ad.
 *
 * @param {string} slot – unique slot identifier (for CSS spacing)
 * @param {string} adSlot – AdSense data-ad-slot ID (override)
 * @param {string} format – 'auto' | 'rectangle' | 'leaderboard'
 * @param {string} className – extra Tailwind classes
 */
const AdBanner = ({
  slot       = 'default',
  adSlot     = '',
  format     = 'auto',
  className  = '',
}) => {
  const adRef      = useRef(null)
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || ''
  const isDev       = import.meta.env.DEV || !publisherId.startsWith('ca-pub-')

  useEffect(() => {
    if (!isDev && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [isDev])

  if (isDev) {
    if (slot === 'after-categories') {
      return (
        <div className={`page-container my-6 ${className}`}>
          <div className="rounded-2xl border-2 border-dashed border-primary-500/30 dark:border-primary-500/20 bg-primary-50/50 dark:bg-primary-950/10 p-6 text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/5 rounded-full blur-xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="font-heading font-bold text-surface-900 dark:text-surface-50 text-base flex items-center gap-2">
                  <span>📢</span> Promote Your Brand Here
                </h4>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 max-w-xl">
                  Reach thousands of job seekers and developers daily. Contact us for custom banner promotions and advertisements.
                </p>
              </div>
              <a
                href="mailto:hellomyjobuniverse@gmail.com"
                className="btn-primary py-2 px-4 text-xs font-semibold shadow-glow shrink-0"
              >
                hellomyjobuniverse@gmail.com
              </a>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`
          flex items-center justify-center rounded-2xl
          border-2 border-dashed border-surface-200 dark:border-surface-700
          bg-surface-50 dark:bg-surface-800/50 text-surface-400 text-xs font-medium
          py-4 my-4 ${className}
        `}
        data-ad-slot={slot}
      >
        📢 Ad Placement ({slot})
      </div>
    )
  }

  return (
    <div className={`my-4 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdBanner
