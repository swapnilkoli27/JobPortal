// Admin Jobs Management – table with CRUD, bulk actions, bulk upload
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  Plus, Search, Filter, Upload, Download, Trash2, Edit,
  Copy, Eye, Star, CheckSquare, Square, RefreshCw
} from 'lucide-react'
import { getAllJobsAdmin, deleteJob, updateJob, bulkCreateJobs } from '../../firebase/firestore'
import { parseJobsFile, generateTemplateCsv } from '../../utils/csvParser'
import { timeAgo, JOB_CATEGORIES } from '../../utils/formatters'
import { Button } from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const AdminJobs = () => {
  const [jobs,          setJobs]          = useState([])
  const [loading,       setLoading]       = useState(true)
  const [searchTerm,    setSearchTerm]    = useState('')
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [selected,      setSelected]      = useState(new Set())
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [bulkModal,     setBulkModal]     = useState(false)
  const [bulkLoading,   setBulkLoading]   = useState(false)
  const [bulkErrors,    setBulkErrors]    = useState([])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await getAllJobsAdmin()
      setJobs(data)
    } catch { toast.error('Failed to load jobs') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadJobs() }, [])

  const getTimestamp = (val) => {
    if (!val) return 0
    if (val.seconds) return val.seconds * 1000
    if (val.toDate) return val.toDate().getTime()
    return new Date(val).getTime() || 0
  }

  const isExpired = (lastDate) => {
    if (!lastDate) return false
    const time = getTimestamp(lastDate)
    return time < new Date().setHours(0, 0, 0, 0)
  }

  const isExpiredMoreThan30Days = (lastDate) => {
    if (!lastDate) return false
    const time = getTimestamp(lastDate)
    const diff = new Date().setHours(0, 0, 0, 0) - time
    return diff > 30 * 24 * 60 * 60 * 1000
  }

  // Filtered view
  const filtered = jobs.filter(j => {
    const matchSearch = !searchTerm ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchStatus = false
    if (statusFilter === 'all') {
      matchStatus = true
    } else if (statusFilter === 'expired-30') {
      matchStatus = isExpiredMoreThan30Days(j.lastDate)
    } else if (statusFilter === 'expired') {
      matchStatus = isExpired(j.lastDate)
    } else {
      matchStatus = j.status === statusFilter
    }

    return matchSearch && matchStatus
  })

  // Selection helpers
  const toggleSelect  = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const selectAll     = () => setSelected(new Set(filtered.map(j => j.id)))
  const clearSelect   = () => setSelected(new Set())
  const allSelected   = filtered.length > 0 && filtered.every(j => selected.has(j.id))

  // Delete single
  const handleDelete = async (id) => {
    try {
      await deleteJob(id)
      setJobs(prev => prev.filter(j => j.id !== id))
      toast.success('Job deleted')
    } catch { toast.error('Delete failed') }
    setConfirmDelete(null)
  }

  // Bulk operations
  const bulkAction = async (action) => {
    if (!selected.size) return
    const ids = [...selected]
    setLoading(true)
    try {
      await Promise.all(ids.map(id => {
        if (action === 'delete')    return deleteJob(id)
        if (action === 'publish')   return updateJob(id, { status: 'published' })
        if (action === 'draft')     return updateJob(id, { status: 'draft'     })
      }))
      toast.success(`${ids.length} jobs updated`)
      clearSelect()
      await loadJobs()
    } catch { toast.error('Bulk action failed') }
    finally { setLoading(false) }
  }

  // Duplicate job
  const duplicateJob = async (job) => {
    const { id: _id, createdAt, updatedAt, views, postedAt, ...rest } = job
    try {
      await bulkCreateJobs([{ ...rest, title: `${rest.title} (Copy)`, status: 'draft' }])
      toast.success('Job duplicated as draft')
      await loadJobs()
    } catch { toast.error('Duplicate failed') }
  }

  // Quick status toggle
  const toggleStatus = async (job) => {
    const newStatus = job.status === 'published' ? 'draft' : 'published'
    try {
      await updateJob(job.id, { status: newStatus })
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: newStatus } : j))
    } catch { toast.error('Update failed') }
  }

  // Bulk upload
  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBulkLoading(true)
    setBulkErrors([])
    const { jobs: parsedJobs, errors } = await parseJobsFile(file)
    setBulkErrors(errors)

    if (parsedJobs.length > 0) {
      try {
        await bulkCreateJobs(parsedJobs)
        toast.success(`${parsedJobs.length} jobs imported successfully!`)
        setBulkModal(false)
        await loadJobs()
      } catch (err) {
        toast.error('Import failed: ' + err.message)
      }
    }
    setBulkLoading(false)
    e.target.value = ''
  }

  const downloadTemplate = () => {
    const blob = generateTemplateCsv()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'job-upload-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderStatusBadge = (job) => {
    if (job.status === 'published' && isExpired(job.lastDate)) {
      return (
        <span className="badge text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30 cursor-pointer hover:opacity-80">
          Expired
        </span>
      )
    }
    const badges = {
      published: 'badge-success',
      draft:     'badge-warning',
      archived:  'badge-error',
    }
    const badgeClass = badges[job.status] || 'badge-gray'
    return (
      <span className={`badge text-xs ${badgeClass} cursor-pointer hover:opacity-80`}>
        {job.status}
      </span>
    )
  }

  return (
    <>
      <Helmet><title>Manage Jobs – Admin</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading font-black text-2xl text-surface-900 dark:text-surface-50">Manage Jobs</h1>
            <p className="text-sm text-surface-500">{jobs.length} total · {jobs.filter(j => j.status === 'published').length} published</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setBulkModal(true)}>
              <Upload size={15} /> Bulk Upload
            </Button>
            <Link to="/admin/jobs/new" className="btn-primary text-sm">
              <Plus size={15} /> Add Job
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card p-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search jobs..."
              className="input pl-9 text-sm py-2"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input text-sm py-2 w-auto cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="expired">Expired (All)</option>
            <option value="expired-30">Expired (&gt; 30 Days)</option>
          </select>

          <button onClick={loadJobs} className="btn-ghost p-2 rounded-xl" title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-3 flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800"
          >
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {selected.size} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="secondary" onClick={() => bulkAction('publish')}>Publish All</Button>
              <Button size="sm" variant="secondary" onClick={() => bulkAction('draft')}>Draft All</Button>
              <Button size="sm" variant="danger" onClick={() => bulkAction('delete')}>Delete All</Button>
              <button onClick={clearSelect} className="btn-ghost text-sm">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-700/50 text-left text-surface-500 text-xs uppercase tracking-wide">
                  <th className="p-4 w-10">
                    <button onClick={allSelected ? clearSelect : selectAll}>
                      {allSelected
                        ? <CheckSquare size={16} className="text-primary-600" />
                        : <Square size={16} />
                      }
                    </button>
                  </th>
                  <th className="p-4 font-medium">Job</th>
                  <th className="p-4 font-medium hidden md:table-cell">Category</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Posted</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Views</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-surface-100 dark:border-surface-700">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="p-4">
                          <div className="skeleton h-4 rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-surface-400">
                      {searchTerm ? 'No jobs match your search' : 'No jobs yet'}
                    </td>
                  </tr>
                ) : filtered.map(job => {
                  const cat = JOB_CATEGORIES.find(c => c.id === job.category)
                  return (
                    <tr
                      key={job.id}
                      className={`border-t border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors ${
                        selected.has(job.id) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <button onClick={() => toggleSelect(job.id)}>
                          {selected.has(job.id)
                            ? <CheckSquare size={16} className="text-primary-600" />
                            : <Square size={16} className="text-surface-400" />
                          }
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                            {job.logoUrl
                              ? <img src={job.logoUrl} alt="" className="w-full h-full object-contain p-0.5" />
                              : cat?.icon || '💼'
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900 dark:text-surface-50 truncate max-w-[180px]">
                              {job.title}
                              {job.featured && <Star size={10} className="inline ml-1 text-amber-500 fill-current" />}
                            </p>
                            <p className="text-xs text-surface-400">{job.company}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 hidden md:table-cell">
                        {cat && <span className={`badge text-xs ${cat.color}`}>{cat.icon} {cat.label}</span>}
                      </td>

                      <td className="p-4 text-surface-400 hidden lg:table-cell text-xs">
                        {timeAgo(job.postedAt)}
                      </td>

                      <td className="p-4">
                        <button onClick={() => toggleStatus(job)}>
                          {renderStatusBadge(job)}
                        </button>
                      </td>

                      <td className="p-4 text-surface-500 hidden sm:table-cell">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {job.views || 0}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/jobs/${job.id}`} target="_blank" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 transition-colors" title="View">
                            <Eye size={15} />
                          </Link>
                          <Link to={`/admin/jobs/edit/${job.id}`} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 transition-colors" title="Edit">
                            <Edit size={15} />
                          </Link>
                          <button onClick={() => duplicateJob(job)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 transition-colors" title="Duplicate">
                            <Copy size={15} />
                          </button>
                          <button onClick={() => setConfirmDelete(job)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Job"
        size="sm"
      >
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Are you sure you want to delete <strong className="text-surface-900 dark:text-surface-50">
            "{confirmDelete?.title}"
          </strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(confirmDelete?.id)}>Delete</Button>
        </div>
      </Modal>

      {/* Bulk upload modal */}
      <Modal open={bulkModal} onClose={() => setBulkModal(false)} title="Bulk Upload Jobs" size="md">
        <div className="space-y-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Upload an Excel (.xlsx) or CSV (.csv) file to import multiple jobs at once.
          </p>

          <button onClick={downloadTemplate} className="btn-secondary text-sm w-full justify-center">
            <Download size={15} /> Download Template File
          </button>

          <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-2xl p-8 text-center">
            <Upload size={32} className="mx-auto text-surface-400 mb-3" />
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
              Select your CSV or Excel file
            </p>
            <label className="btn-primary cursor-pointer">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleBulkUpload}
                className="hidden"
              />
              Choose File
            </label>
          </div>

          {bulkLoading && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-surface-500">Importing jobs...</p>
            </div>
          )}

          {bulkErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-600 mb-2">Errors found:</p>
              {bulkErrors.map((e, i) => (
                <p key={i} className="text-xs text-red-500 mt-1">{e}</p>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default AdminJobs
