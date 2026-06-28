// JSON-LD Schema.org JobPosting generator for SEO
/**
 * Generate a JobPosting schema.org object for a job.
 * @param {Object} job – Firestore job document
 * @returns {Object} JSON-LD compatible object
 */
export const generateJobPostingSchema = (job) => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://yourjobportal.com'

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title:              job.title,
    description:        job.description?.replace(/<[^>]*>/g, '') || '', // Strip HTML
    datePosted:         job.postedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    validThrough:       job.lastDate?.toDate?.()?.toISOString?.() || '',
    employmentType:     mapWorkMode(job.workMode),
    hiringOrganization: {
      '@type': 'Organization',
      name:    job.company,
      logo:    job.logoUrl || '',
      sameAs:  job.companyWebsite || '',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type':           'PostalAddress',
        addressLocality:   job.location || '',
        addressCountry:    'IN',
      },
    },
    url: `${baseUrl}/jobs/${job.id}`,
    directApply: !!job.applyLink,
    identifier: {
      '@type':  'PropertyValue',
      name:     job.company,
      value:    job.id,
    },
  }

  // Optional salary
  if (job.salaryMin || job.salaryMax) {
    schema.baseSalary = {
      '@type':    'MonetaryAmount',
      currency:   'INR',
      value: {
        '@type':    'QuantitativeValue',
        minValue:   job.salaryMin || 0,
        maxValue:   job.salaryMax || 0,
        unitText:   'YEAR',
      },
    }
  }

  // Skills
  if (job.skills?.length) {
    schema.skills = Array.isArray(job.skills) ? job.skills.join(', ') : job.skills
  }

  return schema
}

const mapWorkMode = (mode) => {
  const map = {
    remote: 'TELECOMMUTE',
    hybrid: 'PART_TELECOMMUTE',
    onsite: 'FULL_TIME',
  }
  return map[mode] || 'FULL_TIME'
}

/**
 * Inject a JSON-LD script tag into the document <head>.
 * Call this in job detail pages.
 */
export const injectSchema = (schemaObj) => {
  // Remove any existing job schema
  const existing = document.getElementById('job-schema')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.id    = 'job-schema'
  script.type  = 'application/ld+json'
  script.text  = JSON.stringify(schemaObj)
  document.head.appendChild(script)
  return () => { script.remove() }
}
