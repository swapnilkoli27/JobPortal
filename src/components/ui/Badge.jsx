// Reusable Badge component
export const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'badge-primary',
    accent:  'badge-accent',
    success: 'badge-success',
    warning: 'badge-warning',
    error:   'badge-error',
    gray:    'badge bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300',
  }
  return (
    <span className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Badge
