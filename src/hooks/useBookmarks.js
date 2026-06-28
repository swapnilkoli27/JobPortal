// useBookmarks – manage bookmarked jobs for a user
import { useState, useEffect, useCallback } from 'react'
import { bookmarkJob, unbookmarkJob, getUserBookmarks } from '../firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export const useBookmarks = () => {
  const { user, userDoc } = useAuth()
  const [bookmarkedIds, setBookmarkedIds] = useState([])
  const [bookmarkedJobs, setBookmarkedJobs] = useState([])
  const [loading, setLoading] = useState(false)

  // Sync bookmarked IDs from userDoc
  useEffect(() => {
    setBookmarkedIds(userDoc?.bookmarks || [])
  }, [userDoc])

  const isBookmarked = useCallback((jobId) => bookmarkedIds.includes(jobId), [bookmarkedIds])

  const toggleBookmark = useCallback(async (job) => {
    if (!user) {
      toast.error('Please login to save jobs')
      return
    }
    const alreadySaved = bookmarkedIds.includes(job.id)
    try {
      if (alreadySaved) {
        await unbookmarkJob(user.uid, job.id)
        setBookmarkedIds(prev => prev.filter(id => id !== job.id))
        setBookmarkedJobs(prev => prev.filter(j => j.id !== job.id))
        toast.success('Removed from saved jobs')
      } else {
        await bookmarkJob(user.uid, job.id)
        setBookmarkedIds(prev => [...prev, job.id])
        setBookmarkedJobs(prev => [job, ...prev])
        toast.success('Job saved! ✨')
      }
    } catch {
      toast.error('Failed to update bookmark')
    }
  }, [user, bookmarkedIds])

  const fetchBookmarkedJobs = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const jobs = await getUserBookmarks(user.uid)
      setBookmarkedJobs(jobs)
    } catch {
      toast.error('Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }, [user])

  return { bookmarkedIds, bookmarkedJobs, loading, isBookmarked, toggleBookmark, fetchBookmarkedJobs }
}
