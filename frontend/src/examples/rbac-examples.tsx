/**
 * RBAC Usage Examples
 * Practical examples of using Role-Based Access Control in Stock2Door
 */

import { Can, Cannot, usePermissions, withPermission } from '@/components/RBAC'
import { FEATURES } from '@/lib/rbac'
import { Button } from '@/components/ui/button'

// ============================================
// Example 1: Conditional Button Rendering
// ============================================
export function ProductListExample() {
  return (
    <div>
      <h1>Products</h1>
      
      {/* Only show Add button if user can add goods */}
      <Can feature={FEATURES.ADD_GOODS}>
        <Button>Add New Product</Button>
      </Can>
      
      {/* Show message if user cannot add goods */}
      <Cannot feature={FEATURES.ADD_GOODS}>
        <p className="text-gray-500">You don't have permission to add products</p>
      </Cannot>
    </div>
  )
}

// ============================================
// Example 2: Multiple Features (Any)
// ============================================
export function InventoryDashboard() {
  return (
    <div>
      {/* Show if user has ANY of these permissions */}
      <Can features={[FEATURES.VIEW_GOODS, FEATURES.MANAGE_WAREHOUSE]}>
        <div className="inventory-section">
          <h2>Inventory Overview</h2>
          {/* Inventory widgets */}
        </div>
      </Can>
    </div>
  )
}

// ============================================
// Example 3: All Features Required
// ============================================
export function AdvancedSettings() {
  return (
    <div>
      {/* Show only if user has ALL permissions */}
      <Can 
        features={[FEATURES.MANAGE_WAREHOUSE, FEATURES.USER_MANAGEMENT]} 
        requireAll
      >
        <div className="admin-settings">
          <h2>Advanced Configuration</h2>
          {/* Admin settings */}
        </div>
      </Can>
    </div>
  )
}

// ============================================
// Example 4: Programmatic Permission Checks
// ============================================
export function WarehouseOperations() {
  const { can, canAny, role } = usePermissions()
  
  const handleTransfer = () => {
    if (!can(FEATURES.INTERNAL_TRANSFER)) {
      alert('You do not have permission to create transfers')
      return
    }
    
    // Proceed with transfer
  }
  
  return (
    <div>
      <h1>Warehouse Operations</h1>
      
      {can(FEATURES.INTERNAL_TRANSFER) && (
        <Button onClick={handleTransfer}>
          Create Transfer
        </Button>
      )}
      
      {canAny([FEATURES.RECEIPTS, FEATURES.DELIVERIES]) && (
        <div className="operations-panel">
          {/* Show operations panel */}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Logged in as: {role}
      </p>
    </div>
  )
}

// ============================================
// Example 5: Page-Level Protection
// ============================================
function AdminPanelPage() {
  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </div>
  )
}

// Protect entire page - redirects if no permission
export default withPermission(AdminPanelPage, FEATURES.USER_MANAGEMENT)

// ============================================
// Example 6: Conditional Rendering with Fallback
// ============================================
export function RouteOptimizer() {
  return (
    <Can 
      feature={FEATURES.SMART_ROUTE}
      fallback={
        <div className="p-8 text-center">
          <h2>Access Restricted</h2>
          <p>Please contact your administrator for route optimization access</p>
        </div>
      }
    >
      <div className="route-optimizer">
        {/* Route optimization UI */}
      </div>
    </Can>
  )
}

// ============================================
// Example 7: Complex Component Logic
// ============================================
export function DeliveryManagement() {
  const { can, cannot } = usePermissions()
  
  const showCreateDelivery = can(FEATURES.DELIVERIES)
  const showRouteOptimization = can(FEATURES.SMART_ROUTE)
  const showFleetManagement = can(FEATURES.FLEET_MANAGEMENT)
  const isReadOnly = cannot(FEATURES.DELIVERIES)
  
  return (
    <div>
      <h1>Delivery Management {isReadOnly && '(View Only)'}</h1>
      
      <div className="delivery-actions">
        {showCreateDelivery && (
          <Button>Create New Delivery</Button>
        )}
        
        {showRouteOptimization && (
          <Button variant="secondary">Optimize Routes</Button>
        )}
        
        {showFleetManagement && (
          <Button variant="outline">Manage Fleet</Button>
        )}
      </div>
      
      {/* Delivery list */}
    </div>
  )
}

// ============================================
// Example 8: Table with Conditional Actions
// ============================================
export function ProductTable({ products }: { products: any[] }) {
  const { can } = usePermissions()
  
  const canEdit = can(FEATURES.ADD_GOODS)
  const canDelete = can(FEATURES.ADJUSTMENTS)
  
  return (
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>SKU</th>
          <th>Stock</th>
          {(canEdit || canDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.stock}</td>
            {(canEdit || canDelete) && (
              <td>
                {canEdit && <Button size="sm">Edit</Button>}
                {canDelete && <Button size="sm" variant="destructive">Delete</Button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ============================================
// Example 9: Nested Permissions
// ============================================
export function WarehouseSettings() {
  return (
    <Can feature={FEATURES.MANAGE_WAREHOUSE}>
      <div className="warehouse-settings">
        <h2>Warehouse Settings</h2>
        
        {/* Basic settings - all warehouse managers can see */}
        <div className="basic-settings">
          <input placeholder="Warehouse Name" />
          <input placeholder="Address" />
        </div>
        
        {/* Advanced settings - only admin */}
        <Can feature={FEATURES.USER_MANAGEMENT}>
          <div className="advanced-settings">
            <h3>Advanced Configuration</h3>
            <input placeholder="API Key" />
            <input placeholder="Integration Settings" />
          </div>
        </Can>
      </div>
    </Can>
  )
}

// ============================================
// Example 10: Dynamic Menu Items
// ============================================
export function ActionMenu() {
  const { can } = usePermissions()
  
  const menuItems = [
    { label: 'View Goods', feature: FEATURES.VIEW_GOODS, action: () => {} },
    { label: 'Add Goods', feature: FEATURES.ADD_GOODS, action: () => {} },
    { label: 'Create Transfer', feature: FEATURES.INTERNAL_TRANSFER, action: () => {} },
    { label: 'View Reports', feature: FEATURES.VIEW_REPORTS, action: () => {} },
    { label: 'Manage Users', feature: FEATURES.USER_MANAGEMENT, action: () => {} },
  ]
  
  // Filter menu items based on permissions
  const availableItems = menuItems.filter(item => can(item.feature))
  
  return (
    <div className="menu">
      {availableItems.map(item => (
        <button key={item.label} onClick={item.action}>
          {item.label}
        </button>
      ))}
      
      {availableItems.length === 0 && (
        <p>No actions available</p>
      )}
    </div>
  )
}

// ============================================
// Example 11: Loading State with Permissions
// ============================================
export function DashboardWithLoading() {
  const { can, role } = usePermissions()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!role) {
    return <div>Please log in</div>
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Can feature={FEATURES.ANALYTICS}>
        <AnalyticsWidget />
      </Can>
      
      <Can feature={FEATURES.VIEW_GOODS}>
        <InventoryWidget />
      </Can>
      
      <Can feature={FEATURES.DELIVERIES}>
        <DeliveryWidget />
      </Can>
    </div>
  )
}

// ============================================
// Example 12: Form with Conditional Fields
// ============================================
export function TransferForm() {
  const { can } = usePermissions()
  
  return (
    <form>
      <input name="product" placeholder="Product" required />
      <input name="quantity" type="number" placeholder="Quantity" required />
      <input name="fromWarehouse" placeholder="From Warehouse" required />
      <input name="toWarehouse" placeholder="To Warehouse" required />
      
      {/* Only show route optimizer for users with smart route access */}
      {can(FEATURES.SMART_ROUTE) && (
        <div className="route-options">
          <label>
            <input type="checkbox" name="optimizeRoute" />
            Optimize Route
          </label>
          <select name="transportMode">
            <option>Truck</option>
            <option>Van</option>
            <option>Bike</option>
          </select>
        </div>
      )}
      
      {/* Only admin can set priority */}
      {can(FEATURES.USER_MANAGEMENT) && (
        <select name="priority">
          <option>Normal</option>
          <option>High</option>
          <option>Urgent</option>
        </select>
      )}
      
      <button type="submit">Create Transfer</button>
    </form>
  )
}
