// JobFilters – sidebar filter panel with slide-in mobile drawer
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { JOB_CATEGORIES, EXPERIENCE_LABELS, WORK_MODE_LABELS } from '../../utils/formatters'

const FilterSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-heading font-semibold text-sm text-surface-700 dark:text-surface-300 mb-3 uppercase tracking-wide">
      {title}
    </h3>
    {children}
  </div>
)

const FilterChip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border
      ${active
        ? 'bg-primary-600 text-white border-primary-600 shadow-glow'
        : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700'
      }
    `}
  >
    {children}
  </button>
)

const JobFilters = ({ filters, onChange, onClear }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const set = (key, value) => {
    onChange({ [key]: filters[key] === value ? undefined : value })
  }

  const FilterContent = () => (
    <div>
      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-wrap gap-2">
          {JOB_CATEGORIES.map(cat => (
            <FilterChip
              key={cat.id}
              active={filters.category === cat.id}
              onClick={() => set('category', cat.id)}
            >
              {cat.icon} {cat.label}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        <div className="flex flex-wrap gap-2">
          {Object.entries(WORK_MODE_LABELS).map(([key, label]) => (
            <FilterChip
              key={key}
              active={filters.workMode === key}
              onClick={() => set('workMode', key)}
            >
              {key === 'remote' ? '🌍' : key === 'hybrid' ? '🏠' : '🏢'} {label}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      {/* Experience */}
      <FilterSection title="Experience">
        <div className="flex flex-col gap-2">
          {Object.entries(EXPERIENCE_LABELS).map(([key, label]) => (
            <FilterChip
              key={key}
              active={filters.experience === key}
              onClick={() => set('experience', key)}
            >
              {label}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      {/* Salary Range */}
      <FilterSection title="Salary (₹ LPA)">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-surface-500 mb-1 block">Min Salary</label>
            <input
              type="range"
              min={0} max={3000000} step={50000}
              value={filters.salaryMin || 0}
              onChange={e => onChange({ salaryMin: Number(e.target.value) })}
              className="w-full accent-primary-600"
            />
            <span className="text-xs text-primary-600 font-semibold">
              ₹{((filters.salaryMin || 0) / 100000).toFixed(1)}L
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Featured only */}
      <FilterSection title="Other">
        <FilterChip
          active={filters.featured === true}
          onClick={() => onChange({ featured: filters.featured ? undefined : true })}
        >
          ⭐ Featured Jobs Only
        </FilterChip>
      </FilterSection>

      {/* Clear */}
      <button
        onClick={onClear}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 text-sm text-surface-500 hover:border-primary-400 hover:text-primary-600 transition-all duration-200"
      >
        <RotateCcw size={14} /> Clear All Filters
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 btn-secondary text-sm mb-4"
      >
        <SlidersHorizontal size={16} />
        Filters
        {Object.values(filters).filter(Boolean).length > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
            {Object.values(filters).filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="overlay-frosted lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white dark:bg-surface-900 z-50 shadow-glass-dark overflow-y-auto p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg text-surface-900 dark:text-surface-50">Filters</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterContent />
              <div className="mt-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-surface-900 dark:text-surface-50 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary-600" />
              Filters
            </h2>
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  )
}

export default JobFilters
