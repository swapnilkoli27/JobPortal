// useInfiniteScroll – Intersection Observer based infinite scroll
import { useEffect, useRef, useCallback } from 'react'

/**
 * @param {Function} onIntersect – called when sentinel element enters viewport
 * @param {boolean} enabled – whether to observe (set to false when no more data)
 * @returns {React.RefObject} – attach to the sentinel div at the bottom of your list
 */
export const useInfiniteScroll = (onIntersect, enabled = true) => {
  const sentinelRef = useRef(null)

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && enabled) {
      onIntersect()
    }
  }, [onIntersect, enabled])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(handleIntersection, {
      root:       null,
      rootMargin: '200px',   // Start loading a bit before the element is visible
      threshold:  0,
    })

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [handleIntersection])

  return sentinelRef
}
