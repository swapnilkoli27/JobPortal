// useJobs – hook for paginated, filtered job fetching with infinite scroll
import { useState, useEffect, useCallback, useRef } from 'react'
import { getJobs } from '../firebase/firestore'
import { auth } from '../firebase/config'

export const useJobs = (initialFilters = {}) => {
  const [jobs,     setJobs]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [hasMore,  setHasMore]  = useState(true)
  const [filters,  setFilters]  = useState(initialFilters)

  const lastDocRef = useRef(null)
  const isFirst    = useRef(true)

  const fetchJobs = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const cursor = reset ? null : lastDocRef.current
      const { jobs: newJobs, lastDoc, hasMore: more } = await getJobs(filters, cursor)

      setJobs(prev => reset ? newJobs : [...prev, ...newJobs])
      lastDocRef.current = lastDoc
      setHasMore(more)
    } catch (err) {
      setError(err.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Initial load & filter changes
  useEffect(() => {
    lastDocRef.current = null
    setJobs([])
    setHasMore(true)
    fetchJobs(true)
  }, [filters])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchJobs(false)
  }, [loading, hasMore, fetchJobs])

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return { jobs, loading, error, hasMore, filters, loadMore, updateFilters, clearFilters }
}
