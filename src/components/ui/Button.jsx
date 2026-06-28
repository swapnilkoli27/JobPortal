// Reusable Button component
import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const variants = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  accent:    'btn-accent',
  outline:   'btn-outline',
  danger:    'inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200',
}

const sizes = {
  sm:  'px-4 py-2 text-sm',
  md:  '',             // default from class
  lg:  'px-8 py-4 text-lg',
  xl:  'px-10 py-5 text-xl',
  icon:'p-2',
}

export const Button = forwardRef(({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  className= '',
  children,
  ...props
}, ref) => {
  const base     = variants[variant] || variants.primary
  const sizeClass= sizes[size] || ''

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizeClass} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'
export default Button
