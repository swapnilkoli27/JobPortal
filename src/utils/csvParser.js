// CSV / Excel Bulk Upload Parser
import * as XLSX from 'xlsx'

/**
 * Required and optional column names for bulk upload.
 * Column names in the CSV/Excel must match these (case-insensitive).
 */
const REQUIRED_COLS  = ['title', 'company', 'location', 'category', 'applyLink', 'description']
const OPTIONAL_COLS  = ['salaryMin', 'salaryMax', 'experience', 'workMode', 'skills', 'lastDate', 'status', 'featured']

/**
 * Parse an Excel (.xlsx) or CSV (.csv) file and return an array of job objects.
 * @param {File} file
 * @returns {Promise<{jobs: Object[], errors: string[]}>}
 */
export const parseJobsFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data     = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet    = workbook.Sheets[workbook.SheetNames[0]]
        const rows     = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' })

        if (!rows.length) {
          resolve({ jobs: [], errors: ['File is empty'] })
          return
        }

        // Normalize column headers (lowercase, trim)
        const normalizedRows = rows.map(row => {
          const normalized = {}
          Object.entries(row).forEach(([k, v]) => {
            normalized[k.toLowerCase().trim().replace(/\s+/g, '')] = v
          })
          return normalized
        })

        // Validate required columns from first row
        const firstRow  = normalizedRows[0]
        const missingCols = REQUIRED_COLS.filter(col => !(col.toLowerCase() in firstRow))

        if (missingCols.length > 0) {
          resolve({
            jobs: [],
            errors: [`Missing required columns: ${missingCols.join(', ')}`],
          })
          return
        }

        const jobs   = []
        const errors = []

        normalizedRows.forEach((row, idx) => {
          const rowNum = idx + 2 // Account for header row

          // Validate required fields
          const rowErrors = REQUIRED_COLS.filter(col => !row[col.toLowerCase()])
          if (rowErrors.length) {
            errors.push(`Row ${rowNum}: Missing required fields: ${rowErrors.join(', ')}`)
            return
          }

          // Parse skills array
          const skillsRaw = row['skills'] || ''
          const skills = skillsRaw
            ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean)
            : []

          // Parse booleans
          const featured = ['true', '1', 'yes'].includes(
            String(row['featured'] || '').toLowerCase()
          )

          jobs.push({
            title:       row['title'],
            company:     row['company'],
            location:    row['location'],
            category:    row['category'],
            applyLink:   row['applylink'] || row['applyLink'],
            description: row['description'],
            salaryMin:   Number(row['salarymin'] || row['salaryMin'])  || 0,
            salaryMax:   Number(row['salarymax'] || row['salaryMax'])  || 0,
            experience:  row['experience'] || 'fresher',
            workMode:    row['workmode']   || row['workMode'] || 'onsite',
            skills,
            featured,
            status:      row['status'] || 'published',
          })
        })

        resolve({ jobs, errors })
      } catch (err) {
        resolve({ jobs: [], errors: [`Parse error: ${err.message}`] })
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Generate a sample CSV template as a Blob for download.
 */
export const generateTemplateCsv = () => {
  const headers = [...REQUIRED_COLS, ...OPTIONAL_COLS]
  const sample  = [
    'Frontend Developer,TechCorp,Bangalore,software,https://apply.link,<p>Job description here</p>,600000,1200000,2-5,hybrid,"React,TypeScript,CSS",,published,false',
  ]
  const csvContent = [headers.join(','), ...sample].join('\n')
  return new Blob([csvContent], { type: 'text/csv' })
}
