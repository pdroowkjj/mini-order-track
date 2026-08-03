import * as React from 'react'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-blue-100 text-blue-800 border-blue-200',
      secondary: 'bg-gray-100 text-gray-800 border-gray-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      destructive: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-purple-100 text-purple-800 border-purple-200',
    }

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${variants[variant]} ${className || ''}`}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
