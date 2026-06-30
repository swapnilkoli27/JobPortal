// Admin Job Form – create/edit with TipTap rich editor, logo upload, scheduling
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { useDropzone } from 'react-dropzone'
import {
  Save, Send, ChevronLeft, Upload, X, Star, Mic, MicOff,
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, Heading2
} from 'lucide-react'
import { createJob, updateJob, getJob } from '../../firebase/firestore'
import { uploadCompanyLogo } from '../../firebase/storage'
import { JOB_CATEGORIES, EXPERIENCE_LABELS, WORK_MODE_LABELS } from '../../utils/formatters'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'

const INITIAL_FORM = {
  title:       '',
  company:     '',
  location:    '',
  category:    '',
  experience:  'fresher',
  workMode:    'onsite',
  salaryMin:   '',
  salaryMax:   '',
  skills:      '',
  applyLink:   '',
  lastDate:    '',
  scheduledFor:'',
  status:      'published',
  featured:    false,
}

// Toolbar button
const TB = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-lg transition-colors ${
      active
        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
    }`}
  >
    {children}
  </button>
)

const AdminJobForm = () => {
  const { id }   = useParams()   // Present when editing
  const navigate = useNavigate()
  const isEdit   = !!id

  const [form,         setForm]         = useState(INITIAL_FORM)
  const [logoFile,     setLogoFile]     = useState(null)
  const [logoPreview,  setLogoPreview]  = useState('')
  const [existingLogo, setExistingLogo] = useState('')
  const [uploadPct,    setUploadPct]    = useState(0)
  const [loading,      setLoading]      = useState(false)
  const [isListening,  setIsListening]  = useState(false)

  // Auto-save to localStorage every 30s
  const autoSaveRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write a detailed job description...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
      },
    },
  })

  // Load job for editing
  useEffect(() => {
    if (!isEdit) {
      // Restore auto-saved draft
      const draft = localStorage.getItem('jp-admin-draft')
      if (draft) {
        try {
          const { form: savedForm, content } = JSON.parse(draft)
          setForm(prev => ({ ...prev, ...savedForm }))
          if (content && editor) editor.commands.setContent(content)
        } catch {}
      }
      return
    }

    getJob(id).then(job => {
      if (!job) { navigate('/admin/jobs'); return }
      const { description, logoUrl, ...rest } = job
      setForm(prev => ({
        ...prev,
        ...rest,
        skills:      Array.isArray(rest.skills) ? rest.skills.join(', ') : rest.skills || '',
        salaryMin:   rest.salaryMin || '',
        salaryMax:   rest.salaryMax || '',
        lastDate:    rest.lastDate?.toDate 
          ? rest.lastDate.toDate().toISOString().split('T')[0] 
          : typeof rest.lastDate === 'string'
          ? rest.lastDate.split('T')[0]
          : '',
        scheduledFor:rest.scheduledFor ? new Date(rest.scheduledFor.seconds * 1000).toISOString().split('T')[0] : '',
      }))
      if (logoUrl) setExistingLogo(logoUrl)
      if (description && editor) editor.commands.setContent(description)
    }).catch(console.error)
  }, [id, editor, isEdit, navigate])

  // Auto-save draft
  useEffect(() => {
    if (isEdit) return
    autoSaveRef.current = setInterval(() => {
      if (!editor) return
      const draft = { form, content: editor.getHTML() }
      localStorage.setItem('jp-admin-draft', JSON.stringify(draft))
    }, 30000)
    return () => clearInterval(autoSaveRef.current)
  }, [form, editor, isEdit])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // Logo drag & drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    maxSize: 2 * 1024 * 1024,
    onDrop: (accepted) => {
      const file = accepted[0]
      if (!file) return
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    },
    onDropRejected: () => toast.error('Image must be < 2MB'),
  })

  // Voice input for description
  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser')
      return
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous    = true
    recognition.interimResults = false
    recognition.lang          = 'en-IN'

    recognition.onstart  = () => setIsListening(true)
    recognition.onend    = () => setIsListening(false)
    recognition.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript
      editor?.chain().focus().insertContent(text + ' ').run()
    }
    recognition.start()
  }, [editor])

  const handleSubmit = async (status = null) => {
    if (!form.title.trim() || !form.company.trim() || !form.category) {
      toast.error('Title, Company, and Category are required')
      return
    }

    setLoading(true)
    try {
      const description = editor?.getHTML() || ''
      const finalStatus = status || form.status

      // Upload logo if new file selected
      let logoUrl = existingLogo
      if (logoFile) {
        const tempId = isEdit ? id : Date.now().toString()
        logoUrl = await uploadCompanyLogo(logoFile, tempId, setUploadPct)
      }

      const jobData = {
        ...form,
        description,
        logoUrl,
        status:   finalStatus,
        featured: form.featured,
        skills:   form.skills.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
      }

      if (isEdit) {
        await updateJob(id, jobData)
        toast.success('Job updated!')
      } else {
        await createJob(jobData)
        localStorage.removeItem('jp-admin-draft')
        toast.success('Job created! 🎉')
      }

      navigate('/admin/jobs')
    } catch (err) {
      toast.error(err.message || 'Failed to save job')
    } finally {
      setLoading(false)
      setUploadPct(0)
    }
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Job' : 'Add New Job'} – Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/jobs')} className="btn-ghost p-2">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-black text-2xl text-surface-900 dark:text-surface-50">
              {isEdit ? 'Edit Job' : 'Add New Job'}
            </h1>
            <p className="text-sm text-surface-500">
              {isEdit ? 'Update job details and republish' : 'Fill in the details below to post a job'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleSubmit('draft')} loading={loading} size="sm">
              <Save size={16} /> Save Draft
            </Button>
            <Button variant="primary" onClick={() => handleSubmit('published')} loading={loading} size="sm">
              <Send size={16} /> Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic info */}
            <div className="card p-6">
              <h2 className="font-heading font-bold text-surface-900 dark:text-surface-50 mb-5">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">
                    Job Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior React Developer"
                    className="input"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Company *</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Company name" className="input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore / Remote" className="input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input">
                    <option value="">Select category</option>
                    {JOB_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Work Mode</label>
                  <select name="workMode" value={form.workMode} onChange={handleChange} className="input">
                    {Object.entries(WORK_MODE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Experience Level</label>
                  <select name="experience" value={form.experience} onChange={handleChange} className="input">
                    {Object.entries(EXPERIENCE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Min Salary (₹/yr)</label>
                  <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="e.g. 600000" className="input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Max Salary (₹/yr)</label>
                  <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} placeholder="e.g. 1200000" className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Skills (comma separated)</label>
                  <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js, AWS" className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Apply Link (URL)</label>
                  <input name="applyLink" type="url" value={form.applyLink} onChange={handleChange} placeholder="https://company.com/careers/apply" className="input" />
                </div>
              </div>
            </div>

            {/* Rich text editor */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-surface-900 dark:text-surface-50">
                  Job Description
                </h2>
                <button
                  type="button"
                  onClick={startVoiceInput}
                  title="Voice input"
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl transition-colors ${
                    isListening
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
                      : 'btn-ghost'
                  }`}
                >
                  {isListening ? <><MicOff size={14} /> Listening...</> : <><Mic size={14} /> Voice Input</>}
                </button>
              </div>

              {/* Toolbar */}
              {editor && (
                <div className="flex flex-wrap gap-1 p-2 mb-2 border border-surface-200 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold size={15} />
                  </TB>
                  <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic size={15} />
                  </TB>
                  <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon size={15} />
                  </TB>
                  <div className="w-px h-6 bg-surface-200 dark:bg-surface-600 mx-1 self-center" />
                  <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading">
                    <Heading2 size={15} />
                  </TB>
                  <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                    <List size={15} />
                  </TB>
                  <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
                    <ListOrdered size={15} />
                  </TB>
                  <div className="w-px h-6 bg-surface-200 dark:bg-surface-600 mx-1 self-center" />
                  <TB onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
                    <AlignLeft size={15} />
                  </TB>
                  <TB onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
                    <AlignCenter size={15} />
                  </TB>
                </div>
              )}

              <div className="border border-surface-200 dark:border-surface-600 rounded-xl overflow-hidden bg-white dark:bg-surface-800 min-h-[200px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish options */}
            <div className="card p-5">
              <h3 className="font-heading font-semibold text-surface-900 dark:text-surface-50 mb-4">Publish Options</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="input text-sm">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">
                    Schedule Post (optional)
                  </label>
                  <input
                    name="scheduledFor"
                    type="datetime-local"
                    value={form.scheduledFor}
                    onChange={handleChange}
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">
                    Last Date to Apply
                  </label>
                  <input
                    name="lastDate"
                    type="date"
                    value={form.lastDate}
                    onChange={handleChange}
                    className="input text-sm"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Star size={13} className="fill-current" /> Mark as Featured
                    </span>
                    <p className="text-xs text-amber-600/70 dark:text-amber-500/70">Appears at top of listings</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-2 mt-5">
                <Button variant="secondary" size="sm" onClick={() => handleSubmit('draft')} loading={loading} className="flex-1 justify-center">
                  <Save size={14} /> Draft
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleSubmit('published')} loading={loading} className="flex-1 justify-center">
                  <Send size={14} /> Publish
                </Button>
              </div>
              {uploadPct > 0 && uploadPct < 100 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-surface-500 mb-1">
                    <span>Uploading logo</span><span>{uploadPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full">
                    <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${uploadPct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Logo upload */}
            <div className="card p-5">
              <h3 className="font-heading font-semibold text-surface-900 dark:text-surface-50 mb-4">
                Company Logo
              </h3>

              {(logoPreview || existingLogo) && (
                <div className="relative w-20 h-20 mb-4 mx-auto">
                  <img
                    src={logoPreview || existingLogo}
                    alt="Logo preview"
                    className="w-full h-full object-contain rounded-xl border-2 border-surface-200 dark:border-surface-600"
                  />
                  <button
                    onClick={() => { setLogoFile(null); setLogoPreview(''); setExistingLogo('') }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}

              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                  ${isDragActive
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-surface-300 dark:border-surface-600 hover:border-primary-300 dark:hover:border-primary-700'
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload size={24} className="mx-auto text-surface-400 mb-2" />
                <p className="text-sm text-surface-500">
                  {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-surface-400 mt-1">PNG, JPG, SVG · Max 2MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminJobForm
