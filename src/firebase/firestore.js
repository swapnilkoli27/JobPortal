// Firestore Database Helpers – Job Portal
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter,
  serverTimestamp, increment, arrayUnion, arrayRemove,
  onSnapshot, writeBatch, Timestamp
} from 'firebase/firestore'
import { db } from './config'

// ─── Collections ──────────────────────────────────────────────────────────────
const JOBS_COL   = 'jobs'
const USERS_COL  = 'users'
const VIEWS_COL  = 'views'

// ─── Job CRUD ─────────────────────────────────────────────────────────────────

/**
 * Fetch paginated, filtered jobs.
 * @param {Object} filters – { category, location, experience, workMode, salaryMin, salaryMax, search }
 * @param {DocumentSnapshot|null} lastDoc – for pagination cursor
 * @param {number} pageSize
 */
export const getJobs = async (filters = {}, lastDoc = null, pageSize = 12) => {
  // Query only published jobs to align with Firestore security rules (rules are not filters!)
  const q = query(
    collection(db, JOBS_COL),
    where('status', '==', 'published'),
    orderBy('postedAt', 'desc'),
    limit(2000)
  )

  const snap = await getDocs(q)
  let allJobs = snap.docs.map(d => ({ id: d.id, ...d.data(), _snap: d }))

  const isExpired = (lastDate) => {
    if (!lastDate) return false
    let dateVal
    if (lastDate.toDate) {
      dateVal = lastDate.toDate()
    } else {
      dateVal = new Date(lastDate)
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dateVal.setHours(0, 0, 0, 0)
    return dateVal.getTime() < today.getTime()
  }

  // 1. Filter status (only published and non-expired jobs shown to public)
  allJobs = allJobs.filter(j => j.status === 'published' && !isExpired(j.lastDate))

  // 2. Filter category
  if (filters.category) {
    if (filters.category === 'internship') {
      allJobs = allJobs.filter(j => j.category === 'internship' || j.experience === 'internship')
    } else {
      allJobs = allJobs.filter(j => j.category === filters.category)
    }
  }

  // 3. Filter workMode
  if (filters.workMode) {
    allJobs = allJobs.filter(j => j.workMode === filters.workMode)
  }

  // 4. Filter experience
  if (filters.experience) {
    allJobs = allJobs.filter(j => j.experience === filters.experience)
  }

  // 5. Filter featured
  if (filters.featured) {
    allJobs = allJobs.filter(j => j.featured === true)
  }

  // 6. Client-side search (title, company, and skills)
  if (filters.search) {
    const term = filters.search.toLowerCase()
    allJobs = allJobs.filter(j => {
      const matchTitle = j.title?.toLowerCase().includes(term)
      const matchCompany = j.company?.toLowerCase().includes(term)
      
      const skillsStr = Array.isArray(j.skills) 
        ? j.skills.join(' ') 
        : typeof j.skills === 'string' 
        ? j.skills 
        : ''
      const matchSkills = skillsStr.toLowerCase().includes(term)
      
      return matchTitle || matchCompany || matchSkills
    })
  }

  // 6.5 Sort results
  const getTimestamp = (val) => {
    if (!val) return 0
    if (val.seconds) return val.seconds * 1000
    if (val.toDate) return val.toDate().getTime()
    return new Date(val).getTime() || 0
  }

  if (filters.sort) {
    if (filters.sort === 'newest') {
      allJobs.sort((a, b) => getTimestamp(b.postedAt) - getTimestamp(a.postedAt))
    } else if (filters.sort === 'featured') {
      allJobs.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return getTimestamp(b.postedAt) - getTimestamp(a.postedAt)
      })
    } else if (filters.sort === 'salary') {
      allJobs.sort((a, b) => {
        const salA = Number(a.salaryMax) || Number(a.salaryMin) || 0
        const salB = Number(b.salaryMax) || Number(b.salaryMin) || 0
        if (salB !== salA) return salB - salA
        return getTimestamp(b.postedAt) - getTimestamp(a.postedAt)
      })
    }
  }

  // 7. Client-side pagination simulation
  let startIndex = 0
  if (lastDoc) {
    const lastDocId = lastDoc.id
    const index = allJobs.findIndex(j => j.id === lastDocId)
    if (index !== -1) {
      startIndex = index + 1
    }
  }

  const paginated = allJobs.slice(startIndex, startIndex + pageSize)
  const lastJob = paginated[paginated.length - 1]
  const lastVisible = lastJob ? lastJob._snap : null

  return { 
    jobs: paginated, 
    lastDoc: lastVisible, 
    hasMore: startIndex + pageSize < allJobs.length 
  }
}

/**
 * Get a single job by ID and increment its view count.
 */
export const getJob = async (id) => {
  const ref  = doc(db, JOBS_COL, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null

  // Increment view counter without blocking
  updateDoc(ref, { views: increment(1) }).catch(() => {})

  return { id: snap.id, ...snap.data() }
}

/**
 * Real-time listener for latest published jobs (for homepage).
 * Returns unsubscribe function.
 */
export const listenToLatestJobs = (callback, pageSize = 12) => {
  const q = query(
    collection(db, JOBS_COL),
    where('status', '==', 'published'),
    orderBy('postedAt', 'desc'),
    limit(pageSize)
  )
  return onSnapshot(q, snap => {
    const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(jobs)
  })
}

/**
 * Create a new job (admin only).
 */
export const createJob = async (data) => {
  const ref = await addDoc(collection(db, JOBS_COL), {
    ...data,
    views:    0,
    postedAt: data.scheduledFor
      ? Timestamp.fromDate(new Date(data.scheduledFor))
      : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/**
 * Update an existing job (admin only).
 */
export const updateJob = async (id, data) => {
  await updateDoc(doc(db, JOBS_COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a job (admin only).
 */
export const deleteJob = async (id) => {
  await deleteDoc(doc(db, JOBS_COL, id))
}

/**
 * Bulk create jobs from CSV/Excel data (admin only).
 */
export const bulkCreateJobs = async (jobsArray) => {
  const batch = writeBatch(db)
  jobsArray.forEach(job => {
    const ref = doc(collection(db, JOBS_COL))
    batch.set(ref, {
      ...job,
      status:    job.status    || 'published',
      views:     0,
      featured:  false,
      postedAt:  serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
  await batch.commit()
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export const bookmarkJob = async (userId, jobId) => {
  await updateDoc(doc(db, USERS_COL, userId), {
    bookmarks:  arrayUnion(jobId),
    updatedAt:  serverTimestamp(),
  })
}

export const unbookmarkJob = async (userId, jobId) => {
  await updateDoc(doc(db, USERS_COL, userId), {
    bookmarks:  arrayRemove(jobId),
    updatedAt:  serverTimestamp(),
  })
}

export const getUserBookmarks = async (userId) => {
  const userSnap = await getDoc(doc(db, USERS_COL, userId))
  const bookmarkIds = userSnap.data()?.bookmarks || []
  if (!bookmarkIds.length) return []

  // Fetch jobs in batches (Firestore 'in' limit = 30)
  const chunks = []
  for (let i = 0; i < bookmarkIds.length; i += 30) {
    chunks.push(bookmarkIds.slice(i, i + 30))
  }
  const jobs = []
  for (const chunk of chunks) {
    const q    = query(collection(db, JOBS_COL), where('__name__', 'in', chunk))
    const snap = await getDocs(q)
    snap.docs.forEach(d => jobs.push({ id: d.id, ...d.data() }))
  }
  return jobs
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

export const saveRecentlyViewed = async (userId, jobId) => {
  const ref  = doc(db, USERS_COL, userId)
  const snap = await getDoc(ref)
  const existing = snap.data()?.recentlyViewed || []

  // Remove if already present, then prepend
  const updated = [jobId, ...existing.filter(id => id !== jobId)].slice(0, 20)
  await updateDoc(ref, { recentlyViewed: updated })
}

export const getRecentlyViewed = async (userId) => {
  const snap = await getDoc(doc(db, USERS_COL, userId))
  const ids  = snap.data()?.recentlyViewed || []
  if (!ids.length) return []

  const jobs = []
  const chunks = []
  for (let i = 0; i < ids.length; i += 30) chunks.push(ids.slice(i, i + 30))

  for (const chunk of chunks) {
    const q    = query(collection(db, JOBS_COL), where('__name__', 'in', chunk))
    const s    = await getDocs(q)
    s.docs.forEach(d => jobs.push({ id: d.id, ...d.data() }))
  }
  // Restore order
  return ids.map(id => jobs.find(j => j.id === id)).filter(Boolean)
}

// ─── Admin Analytics ──────────────────────────────────────────────────────────

export const getAnalytics = async () => {
  const snap = await getDocs(query(collection(db, JOBS_COL)))
  const all  = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  const total     = all.length
  const published = all.filter(j => j.status === 'published').length
  const drafts    = all.filter(j => j.status === 'draft').length
  const totalViews = all.reduce((sum, j) => sum + (j.views || 0), 0)
  const featured  = all.filter(j => j.featured).length

  // Category breakdown
  const byCategory = all.reduce((acc, j) => {
    acc[j.category] = (acc[j.category] || 0) + 1
    return acc
  }, {})

  // Top companies
  const byCompany = all.reduce((acc, j) => {
    if (!acc[j.company]) acc[j.company] = { count: 0, views: 0 }
    acc[j.company].count += 1
    acc[j.company].views += j.views || 0
    return acc
  }, {})

  const topCompanies = Object.entries(byCompany)
    .sort((a, b) => b[1].views - a[1].views)
    .slice(0, 10)
    .map(([name, data]) => ({ name, ...data }))

  return { total, published, drafts, totalViews, featured, byCategory, topCompanies }
}

// ─── Notification Categories ───────────────────────────────────────────────────

export const updateUserCategories = async (userId, categories) => {
  await updateDoc(doc(db, USERS_COL, userId), {
    categories,
    updatedAt: serverTimestamp(),
  })
}

// ─── FCM Token ────────────────────────────────────────────────────────────────

export const saveFcmToken = async (userId, token) => {
  await updateDoc(doc(db, USERS_COL, userId), {
    fcmTokens: arrayUnion(token),
  })
}

// ─── Similar Jobs ─────────────────────────────────────────────────────────────

export const getSimilarJobs = async (category, excludeId, count = 4) => {
  const q    = query(
    collection(db, JOBS_COL),
    where('status', '==', 'published'),
    where('category', '==', category),
    limit(count + 10)
  )
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(j => j.id !== excludeId)
    .sort((a, b) => {
      const aTime = a.postedAt?.toDate ? a.postedAt.toDate().getTime() : 0
      const bTime = b.postedAt?.toDate ? b.postedAt.toDate().getTime() : 0
      return bTime - aTime
    })
    .slice(0, count)
}

// ─── All Admin Jobs (no filter) ───────────────────────────────────────────────

export const getAllJobsAdmin = async () => {
  const snap = await getDocs(query(
    collection(db, JOBS_COL),
    orderBy('createdAt', 'desc')
  ))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
