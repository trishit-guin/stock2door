import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-accent bg-gradient-to-r from-green-50 to-green-100'
      case 'warning':
        return 'border-l-warning bg-gradient-to-r from-yellow-50 to-yellow-100'
      case 'error':
        return 'border-l-error bg-gradient-to-r from-red-50 to-red-100'
      default:
        return 'border-l-primary bg-gradient-to-r from-blue-50 to-blue-100'
    }
  }

  return (
    <div className={cn(
      'card border-l-4 p-6 transition-all duration-200 hover:shadow-card-hover',
      getVariantStyles(),
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-text-primary">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                'text-sm font-medium',
                trend.isPositive ? 'text-accent' : 'text-error'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-text-secondary ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
} 