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
