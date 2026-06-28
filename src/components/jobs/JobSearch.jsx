// JobSearch – search bar with live suggestions
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDocs, query, collection, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useDebounce } from 'use-debounce'

const TRENDING = ['React Developer', 'Data Analyst', 'AI Engineer', 'Product Manager', 'DevOps', 'UI/UX Designer']

const JobSearch = ({ initialValue = '', placeholder = 'Job title, company or skills...', className = '', onSearch }) => {
  const [query_,       setQuery]       = useState(initialValue)
  const [suggestions,  setSuggestions] = useState([])
  const [history,      setHistory]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('jp-search-history') || '[]') } catch { return [] }
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading,      setLoading]      = useState(false)

  const [debouncedQuery] = useDebounce(query_, 300)
  const navigate          = useNavigate()
  const inputRef          = useRef(null)
  const containerRef      = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Live Firestore suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        // Simple prefix-search on lowercase title
        const snap = await getDocs(query(
          collection(db, 'jobs'),
          where('status', '==', 'published'),
          where('titleLower', '>=', debouncedQuery.toLowerCase()),
          where('titleLower', '<=', debouncedQuery.toLowerCase() + '\uf8ff'),
          limit(5)
        ))
        setSuggestions(snap.docs.map(d => ({ id: d.id, title: d.data().title, company: d.data().company })))
      } catch {
        // Fallback – ignore errors (index may not exist yet)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  const handleSearch = useCallback((term = query_) => {
    if (!term.trim()) return
    // Save to history
    const updated = [term, ...history.filter(h => h !== term)].slice(0, 5)
    setHistory(updated)
    localStorage.setItem('jp-search-history', JSON.stringify(updated))

    setShowDropdown(false)
    if (onSearch) {
      onSearch(term)
    } else {
      navigate(`/jobs?search=${encodeURIComponent(term)}`)
    }
  }, [query_, history, onSearch, navigate])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('jp-search-history')
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search size={20} className="absolute left-4 text-surface-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query_}
          onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
          placeholder={placeholder}
          className="input-search !pl-12 !pr-24"
          aria-label="Search jobs"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
        />
        {query_ && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }}
            className="absolute right-28 text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 btn-primary py-2 px-4 text-sm"
        >
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 rounded-2xl shadow-glass-dark border border-surface-200 dark:border-surface-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1     }}
            exit={{    opacity: 0, y: -8, scaleY: 0.95   }}
            style={{ transformOrigin: 'top' }}
          >
            {/* Suggestions from Firestore */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-semibold text-surface-400 px-3 py-1">Suggestions</p>
                {suggestions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSearch(s.title)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left transition-colors"
                  >
                    <Search size={14} className="text-surface-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-surface-900 dark:text-surface-50">{s.title}</p>
                      <p className="text-xs text-surface-400">{s.company}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search history */}
            {history.length > 0 && !query_ && (
              <div className="p-2 border-t border-surface-100 dark:border-surface-700">
                <div className="flex items-center justify-between px-3 py-1">
                  <p className="text-xs font-semibold text-surface-400">Recent Searches</p>
                  <button onClick={clearHistory} className="text-xs text-primary-500 hover:underline">
                    Clear
                  </button>
                </div>
                {history.map(h => (
                  <button
                    key={h}
                    onClick={() => handleSearch(h)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 text-left transition-colors"
                  >
                    <Clock size={14} className="text-surface-400" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">{h}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending */}
            {!query_ && (
              <div className="p-2 border-t border-surface-100 dark:border-surface-700">
                <p className="text-xs font-semibold text-surface-400 px-3 py-1 flex items-center gap-1">
                  <TrendingUp size={12} /> Trending
                </p>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {TRENDING.map(t => (
                    <button
                      key={t}
                      onClick={() => handleSearch(t)}
                      className="badge-primary text-xs px-2.5 py-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobSearch
