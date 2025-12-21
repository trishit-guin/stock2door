/**
 * Role-Based Access Control (RBAC) Utilities for Frontend
 * Manages feature visibility based on user roles
 */

import { UserRole } from '@/types'

export const FEATURES = {
  // Environment Manager Features
  AUDIT_REPORTS: 'audit_reports',
  COMPANY_AUDIT: 'company_audit',
  
  // Inventory Manager Features
  VIEW_GOODS: 'view_goods',
  ADD_GOODS: 'add_goods',
  MANAGE_WAREHOUSE: 'manage_warehouse',
  MANAGE_LOCATIONS: 'manage_locations',
  VIEW_REPORTS: 'view_reports',
  
  // Warehouse Staff / Operations Features
  RECEIPTS: 'receipts',
  INVOICE_GENERATION: 'invoice_generation',
  DELIVERIES: 'deliveries',
  SMART_ROUTE: 'smart_route',
  MOVE_HISTORY: 'move_history',
  INTERNAL_TRANSFER: 'internal_transfer',
  ADJUSTMENTS: 'adjustments',
  
  // Additional Features
  USER_MANAGEMENT: 'user_management',
  ANALYTICS: 'analytics',
  EMISSION_TRACKING: 'emission_tracking',
  ROUTE_OPTIMIZATION: 'route_optimization',
  FLEET_MANAGEMENT: 'fleet_management',
  SUSTAINABILITY: 'sustainability',
} as const

export type Feature = typeof FEATURES[keyof typeof FEATURES]

/**
 * Role to Feature Mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Feature[]> = {
  admin: Object.values(FEATURES),
  
  environment_manager: [
    FEATURES.AUDIT_REPORTS,
    FEATURES.COMPANY_AUDIT,
    FEATURES.EMISSION_TRACKING,
    FEATURES.SUSTAINABILITY,
    FEATURES.ANALYTICS,
    FEATURES.VIEW_REPORTS,
  ],
  
  inventory_manager: [
    FEATURES.VIEW_GOODS,
    FEATURES.ADD_GOODS,
    FEATURES.MANAGE_WAREHOUSE,
    FEATURES.MANAGE_LOCATIONS,
    FEATURES.VIEW_REPORTS,
    FEATURES.INTERNAL_TRANSFER,
    FEATURES.ADJUSTMENTS,
    FEATURES.ANALYTICS,
    FEATURES.MOVE_HISTORY,
  ],
  
  warehouse_staff: [
    FEATURES.RECEIPTS,
    FEATURES.INVOICE_GENERATION,
    FEATURES.DELIVERIES,
    FEATURES.SMART_ROUTE,
    FEATURES.ROUTE_OPTIMIZATION,
    FEATURES.FLEET_MANAGEMENT,
    FEATURES.MOVE_HISTORY,
    FEATURES.INTERNAL_TRANSFER,
    FEATURES.VIEW_GOODS,
    FEATURES.ADJUSTMENTS,
  ],
  
  auditor: [
    FEATURES.AUDIT_REPORTS,
    FEATURES.VIEW_REPORTS,
    FEATURES.MOVE_HISTORY,
    FEATURES.ANALYTICS,
  ],
}

/**
 * Navigation Menu Structure by Role
 */
interface NavigationItem {
  name: string
  path: string
  feature: Feature
  icon?: string
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

export const ROLE_NAVIGATION: Record<UserRole, { sections: NavigationSection[] }> = {
  admin: {
    sections: [
      {
        title: 'Environment',
        items: [
          { name: 'Audit Reports', path: '/audit-reports', feature: FEATURES.AUDIT_REPORTS },
          { name: 'Company Audit', path: '/company-audit', feature: FEATURES.COMPANY_AUDIT },
        ],
      },
      {
        title: 'Inventory',
        items: [
          { name: 'Your Goods', path: '/goods', feature: FEATURES.VIEW_GOODS },
          { name: 'Add Goods', path: '/goods/add', feature: FEATURES.ADD_GOODS },
          { name: 'Warehouse', path: '/warehouses', feature: FEATURES.MANAGE_WAREHOUSE },
          { name: 'Locations', path: '/locations', feature: FEATURES.MANAGE_LOCATIONS },
          { name: 'Reports', path: '/reports', feature: FEATURES.VIEW_REPORTS },
        ],
      },
      {
        title: 'Operations',
        items: [
          { name: 'Receipts', path: '/receipts', feature: FEATURES.RECEIPTS },
          { name: 'Deliveries', path: '/deliveries', feature: FEATURES.DELIVERIES },
          { name: 'Smart Route', path: '/routes', feature: FEATURES.SMART_ROUTE },
          { name: 'Move History', path: '/move-history', feature: FEATURES.MOVE_HISTORY },
          { name: 'Internal Transfer', path: '/transfer', feature: FEATURES.INTERNAL_TRANSFER },
          { name: 'Adjustments', path: '/adjustments', feature: FEATURES.ADJUSTMENTS },
        ],
      },
      {
        title: 'Management',
        items: [
          { name: 'User Management', path: '/users', feature: FEATURES.USER_MANAGEMENT },
          { name: 'Fleet', path: '/fleet', feature: FEATURES.FLEET_MANAGEMENT },
          { name: 'Analytics', path: '/analytics', feature: FEATURES.ANALYTICS },
        ],
      },
    ],
  },
  
  environment_manager: {
    sections: [
      {
        title: 'Environment Management',
        items: [
          { name: 'Audit Reports', path: '/audit-reports', feature: FEATURES.AUDIT_REPORTS },
          { name: 'Company Audit', path: '/company-audit', feature: FEATURES.COMPANY_AUDIT },
          { name: 'Sustainability', path: '/sustainability', feature: FEATURES.SUSTAINABILITY },
          { name: 'Analytics', path: '/analytics', feature: FEATURES.ANALYTICS },
        ],
      },
    ],
  },
  
  inventory_manager: {
    sections: [
      {
        title: 'Inventory Management',
        items: [
          { name: 'Your Goods', path: '/goods', feature: FEATURES.VIEW_GOODS },
          { name: 'Add Goods', path: '/goods/add', feature: FEATURES.ADD_GOODS },
          { name: 'Warehouse', path: '/warehouses', feature: FEATURES.MANAGE_WAREHOUSE },
          { name: 'Locations', path: '/locations', feature: FEATURES.MANAGE_LOCATIONS },
          { name: 'Reports', path: '/reports', feature: FEATURES.VIEW_REPORTS },
          { name: 'Internal Transfer', path: '/transfer', feature: FEATURES.INTERNAL_TRANSFER },
          { name: 'Adjustments', path: '/adjustments', feature: FEATURES.ADJUSTMENTS },
        ],
      },
    ],
  },
  
  warehouse_staff: {
    sections: [
      {
        title: 'Operations',
        items: [
          { name: 'Receipts', path: '/receipts', feature: FEATURES.RECEIPTS },
          { name: 'Invoice Generation', path: '/invoices', feature: FEATURES.INVOICE_GENERATION },
          { name: 'Deliveries', path: '/deliveries', feature: FEATURES.DELIVERIES },
          { name: 'Smart Route', path: '/routes', feature: FEATURES.SMART_ROUTE },
          { name: 'Fleet Management', path: '/fleet', feature: FEATURES.FLEET_MANAGEMENT },
          { name: 'Move History', path: '/move-history', feature: FEATURES.MOVE_HISTORY },
          { name: 'Internal Transfer', path: '/transfer', feature: FEATURES.INTERNAL_TRANSFER },
          { name: 'Adjustments', path: '/adjustments', feature: FEATURES.ADJUSTMENTS },
        ],
      },
    ],
  },
  
  auditor: {
    sections: [
      {
        title: 'Audit',
        items: [
          { name: 'Audit Reports', path: '/audit-reports', feature: FEATURES.AUDIT_REPORTS },
          { name: 'Move History', path: '/move-history', feature: FEATURES.MOVE_HISTORY },
          { name: 'Reports', path: '/reports', feature: FEATURES.VIEW_REPORTS },
        ],
      },
    ],
  },
}

/**
 * Check if user role has permission to access a feature
 */
export function hasPermission(role: UserRole | undefined, feature: Feature): boolean {
  if (!role) return false
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(feature)
}

/**
 * Get navigation menu for user role
 */
export function getNavigationForRole(role: UserRole | undefined): { sections: NavigationSection[] } {
  if (!role) return { sections: [] }
  return ROLE_NAVIGATION[role] || { sections: [] }
}

/**
 * Get all features accessible by role
 */
export function getFeaturesForRole(role: UserRole | undefined): Feature[] {
  if (!role) return []
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Check if user can access multiple features (any of them)
 */
export function hasAnyPermission(role: UserRole | undefined, features: Feature[]): boolean {
  if (!role) return false
  return features.some(feature => hasPermission(role, feature))
}

/**
 * Check if user can access all features
 */
export function hasAllPermissions(role: UserRole | undefined, features: Feature[]): boolean {
  if (!role) return false
  return features.every(feature => hasPermission(role, feature))
}
