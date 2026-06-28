// Date, salary, and text formatting utilities
import { formatDistanceToNow, format, isAfter } from 'date-fns'

/**
 * Convert Firestore Timestamp or JS Date to a "time ago" string.
 */
export const timeAgo = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return formatDistanceToNow(date, { addSuffix: true })
}

/**
 * Format a Firestore Timestamp to readable date string.
 */
export const formatDate = (timestamp, pattern = 'dd MMM yyyy') => {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return format(date, pattern)
}

/**
 * Check if a last date has expired.
 */
export const isExpired = (timestamp) => {
  if (!timestamp) return false
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return !isAfter(date, new Date())
}

/**
 * Format salary range for display.
 * @param {number|string} min
 * @param {number|string} max
 */
export const formatSalary = (min, max, currency = '₹') => {
  const fmt = (n) => {
    const num = Number(n)
    if (!num || isNaN(num)) return null
    if (num >= 100000) return `${currency}${(num / 100000).toFixed(1)}L`
    if (num >= 1000)   return `${currency}${(num / 1000).toFixed(0)}K`
    return `${currency}${num}`
  }
  const fMin = fmt(min)
  const fMax = fmt(max)
  if (fMin && fMax) return `${fMin} – ${fMax}`
  if (fMin)         return `${fMin}+`
  if (fMax)         return `Up to ${fMax}`
  return 'Not disclosed'
}

/**
 * Truncate text with ellipsis.
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength).trim() + '...'
}

/**
 * Convert an array of skill strings to a comma-separated string.
 */
export const formatSkills = (skills) => {
  if (!skills) return ''
  if (Array.isArray(skills)) return skills.join(', ')
  return skills
}

/**
 * Parse skills from a comma-separated string to an array.
 */
export const parseSkills = (str) => {
  if (!str) return []
  if (Array.isArray(str)) return str
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

/**
 * Get initials from a display name.
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

/**
 * Format view count.
 */
export const formatViews = (n) => {
  if (!n) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

/** Experience level labels */
export const EXPERIENCE_LABELS = {
  'fresher': 'Fresher / 0 yrs',
  '1-2':     '1 – 2 years',
  '2-5':     '2 – 5 years',
  '5-10':    '5 – 10 years',
  '10+':     '10+ years',
}

/** Work mode labels */
export const WORK_MODE_LABELS = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}

/** Job categories */
export const JOB_CATEGORIES = [
  { id: 'web-dev',      label: 'Web Development',      icon: '🌐', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'software',     label: 'Software Developer',  icon: '💻', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  { id: 'data-science', label: 'Data Science',         icon: '🧬', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'data-analyst', label: 'Data Analyst',         icon: '📊', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  { id: 'ai-ml',        label: 'AI / ML',              icon: '🤖', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  { id: 'mobile-dev',   label: 'Mobile App Dev',       icon: '📱', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'cyber-security',label: 'Cyber Security',      icon: '🛡️', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { id: 'cloud-devops', label: 'Cloud & DevOps',       icon: '☁️', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { id: 'design',       label: 'Design / UI-UX',       icon: '🎨', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'product-mgmt', label: 'Product Management',   icon: '📋', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 'internship',   label: 'Internship',           icon: '🎓', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'remote',       label: 'Remote',               icon: '🌍', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { id: 'government',   label: 'Government',           icon: '🏛️', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { id: 'sales',        label: 'Sales & Business',     icon: '🤝', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { id: 'pharma',       label: 'Pharma & Biotech',     icon: '💊', color: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300' },
  { id: 'healthcare',   label: 'Healthcare & Medical', icon: '🏥', color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300' },
  { id: 'hr',           label: 'Human Resources (HR)', icon: '👥', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { id: 'operations',   label: 'Operations & Logistics',icon: '📦', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-300' },
  { id: 'education',    label: 'Education & Teaching', icon: '🏫', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'content',      label: 'Content & Writing',    icon: '✍️', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'legal',        label: 'Legal Services',       icon: '⚖️', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300' },
  { id: 'finance',      label: 'Finance',              icon: '💰', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' }
]
