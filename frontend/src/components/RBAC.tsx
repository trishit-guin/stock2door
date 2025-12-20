/**
 * React components for Role-Based Access Control
 * Conditionally render UI elements based on user permissions
 */

'use client'

import { ReactNode } from 'react'
import { useAppStore } from '@/lib/store'
import { hasPermission, hasAnyPermission, hasAllPermissions, Feature } from '@/lib/rbac'

interface RBACProps {
  children: ReactNode
  feature?: Feature
  features?: Feature[]
  requireAll?: boolean
  fallback?: ReactNode
}

/**
 * Component that shows children only if user has required permission(s)
 * 
 * @example
 * // Single feature
 * <Can feature={FEATURES.ADD_GOODS}>
 *   <Button>Add Product</Button>
 * </Can>
 * 
 * @example
 * // Any of multiple features
 * <Can features={[FEATURES.ADD_GOODS, FEATURES.VIEW_GOODS]}>
 *   <ProductSection />
 * </Can>
 * 
 * @example
 * // All features required
 * <Can features={[FEATURES.ADD_GOODS, FEATURES.MANAGE_WAREHOUSE]} requireAll>
 *   <AdminPanel />
 * </Can>
 */
export function Can({ children, feature, features, requireAll = false, fallback = null }: RBACProps) {
  const { user } = useAppStore()
  
  if (!user) {
    return <>{fallback}</>
  }

  let hasAccess = false

  if (feature) {
    hasAccess = hasPermission(user.role, feature)
  } else if (features && features.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(user.role, features)
      : hasAnyPermission(user.role, features)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

/**
 * Component that hides children if user has the permission
 * Opposite of Can component
 * 
 * @example
 * <Cannot feature={FEATURES.USER_MANAGEMENT}>
 *   <p>You don't have admin access</p>
 * </Cannot>
 */
export function Cannot({ children, feature, features, requireAll = false }: Omit<RBACProps, 'fallback'>) {
  const { user } = useAppStore()
  
  if (!user) {
    return <>{children}</>
  }

  let hasAccess = false

  if (feature) {
    hasAccess = hasPermission(user.role, feature)
  } else if (features && features.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(user.role, features)
      : hasAnyPermission(user.role, features)
  }

  return !hasAccess ? <>{children}</> : null
}

/**
 * Hook to check permissions in components
 * 
 * @example
 * const { can, cannot } = usePermissions()
 * 
 * if (can(FEATURES.ADD_GOODS)) {
 *   // Show add button
 * }
 */
export function usePermissions() {
  const { user } = useAppStore()

  return {
    can: (feature: Feature) => hasPermission(user?.role, feature),
    canAny: (features: Feature[]) => hasAnyPermission(user?.role, features),
    canAll: (features: Feature[]) => hasAllPermissions(user?.role, features),
    cannot: (feature: Feature) => !hasPermission(user?.role, feature),
    role: user?.role,
  }
}

/**
 * Higher-order component for page-level protection
 * Redirects to unauthorized page if user doesn't have permission
 * 
 * @example
 * export default withPermission(AdminPage, FEATURES.USER_MANAGEMENT)
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  feature: Feature,
  fallback?: ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <Can feature={feature} fallback={fallback || <UnauthorizedMessage />}>
        <Component {...props} />
      </Can>
    )
  }
}

/**
 * Default unauthorized message
 */
function UnauthorizedMessage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this feature.
        </p>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
