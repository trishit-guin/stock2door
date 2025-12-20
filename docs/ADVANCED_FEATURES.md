# Stock2Door - Advanced Features Integration

## 🎯 Overview

This document describes the newly integrated advanced features that enhance the Stock2Door system with SmartRoute capabilities, including delivery clustering, route simulation, bulk operations, map visualization, and advanced analytics.

---

## 🚀 New Features

### 1. **Delivery Clustering (DBSCAN Algorithm)**

Automatically groups nearby deliveries into efficient clusters for optimized route planning.

#### Features:
- **DBSCAN-based clustering** for geo-spatial optimization
- Configurable epsilon (distance threshold) and minPoints
- Automatic centroid calculation
- Vehicle assignment to clusters
- Real-time cluster status tracking

#### API Endpoints:
```
POST   /api/v1/clusters/create
GET    /api/v1/clusters
GET    /api/v1/clusters/:id
PUT    /api/v1/clusters/:id/assign-vehicle
PUT    /api/v1/clusters/:id/start
PUT    /api/v1/clusters/:id/complete
GET    /api/v1/clusters/analytics
```

#### Usage Example:
```javascript
// Create clusters from deliveries
const response = await api.clusters.create({
  warehouseId: '507f1f77bcf86cd799439011',
  deliveryIds: ['id1', 'id2', 'id3'],
  epsilon: 5,      // 5km radius
  minPoints: 2,    // Minimum 2 deliveries per cluster
  scheduledDate: '2024-01-15'
});

// Assign vehicle to cluster
await api.clusters.assignVehicle(clusterId, vehicleId);

// Start cluster execution
await api.clusters.start(clusterId);
```

---

### 2. **Route Simulation**

Advanced simulation engine for testing different route optimization scenarios before execution.

#### Features:
- **Multiple optimization scenarios**: fastest, shortest, eco-friendly, balanced
- Vehicle assignment optimization
- Demand forecasting with growth/seasonality factors
- Cost and CO2 emission estimation
- Comparative analysis across scenarios

#### API Endpoints:
```
POST   /api/v1/simulation/route
POST   /api/v1/simulation/vehicle-assignment
POST   /api/v1/simulation/demand-forecast
```

#### Usage Example:
```javascript
// Simulate route optimization
const simulation = await api.simulation.optimizeRoute({
  warehouseId: '507f1f77bcf86cd799439011',
  deliveryIds: ['id1', 'id2', 'id3'],
  scenario: 'eco',           // eco-friendly routing
  vehicleType: 'van',
  departureTime: '2024-01-15T09:00:00Z'
});

// Returns: optimized route with metrics for all scenarios
console.log(simulation.data.recommendations.fastest);
console.log(simulation.data.recommendations.mostEconomical);

// Simulate vehicle assignments
const assignment = await api.simulation.assignVehicles({
  warehouseId: '507f1f77bcf86cd799439011',
  deliveryIds: ['id1', 'id2', 'id3'],
  vehicleIds: ['v1', 'v2']
});

// Forecast demand
const forecast = await api.simulation.forecastDemand({
  warehouseId: '507f1f77bcf86cd799439011',
  forecastPeriod: 7,        // 7 days
  growthRate: 5,            // 5% growth
  seasonalityFactor: 1.2    // 20% seasonal increase
});
```

---

### 3. **Bulk Operations**

CSV-based bulk upload/download for efficient data management.

#### Features:
- **Bulk upload**: Deliveries, Products, Stock
- **Bulk export**: CSV downloads with filters
- **Template generation**: Download CSV templates
- Data validation and error reporting
- Support for large datasets (10MB limit)

#### API Endpoints:
```
POST   /api/v1/bulk/deliveries/upload
POST   /api/v1/bulk/products/upload
GET    /api/v1/bulk/deliveries/export
GET    /api/v1/bulk/products/export
GET    /api/v1/bulk/stock/export
GET    /api/v1/bulk/template/:type
```

#### Usage Example:
```javascript
// Upload deliveries from CSV
const file = document.querySelector('input[type="file"]').files[0];
const response = await api.bulk.uploadDeliveries(file);

console.log(`Created: ${response.data.created}`);
console.log(`Errors: ${response.data.errors}`);

// Export deliveries to CSV
const csvBlob = await api.bulk.exportDeliveries({
  status: 'completed',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});

// Download template
const template = await api.bulk.getTemplate('deliveries');
```

#### CSV Format Examples:

**Deliveries Template:**
```csv
warehouseId,customerName,customerPhone,customerEmail,destinationAddress,destinationLatitude,destinationLongitude,totalWeight,priority,scheduledDate,notes,items
507f1f77bcf86cd799439011,John Doe,+1234567890,john@example.com,"123 Main St, City",40.7128,-74.0060,25.5,high,2024-01-15,Handle with care,"[{""productId"":""507f1f77bcf86cd799439012"",""quantity"":2}]"
```

**Products Template:**
```csv
name,description,sku,category,price,weight,length,width,height,dimensionUnit,reorderLevel,reorderQuantity,supplier,tags,isActive
Sample Product,Product description,SKU-001,Electronics,99.99,2.5,30,20,10,cm,10,50,Supplier Name,"tag1, tag2",true
```

---

### 4. **Map Visualization**

Interactive Google Maps component for real-time route and delivery visualization.

#### Features:
- **Multi-marker support**: Warehouses, deliveries, waypoints
- **Status-based coloring**: Pending (red), In Progress (yellow), Completed (green)
- **Route polylines**: Visual route paths
- **Interactive info windows**: Click markers for details
- **Auto-fitting bounds**: Automatically adjusts zoom
- **Custom legend**: Clear marker identification

#### React Component:
```typescript
import RouteMap from '@/components/RouteMap';

// Usage in your component
<RouteMap
  warehouses={[
    {
      lat: 40.7128,
      lng: -74.0060,
      label: 'Main Warehouse',
      address: '123 Warehouse St',
      type: 'warehouse'
    }
  ]}
  deliveries={[
    {
      lat: 40.7589,
      lng: -73.9851,
      label: 'Delivery #1',
      address: '456 Delivery Ave',
      type: 'delivery',
      status: 'pending'
    }
  ]}
  polyline="encodedPolylineString"  // From Google Directions API
  center={{ lat: 40.7128, lng: -74.0060 }}
  zoom={12}
  onLocationClick={(location) => console.log('Clicked:', location)}
/>
```

#### Setup:
1. Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Enable APIs: Maps JavaScript API, Directions API, Places API

---

### 5. **Advanced Analytics Dashboard**

Comprehensive analytics with charts, trends, and AI-powered insights.

#### Features:
- **Real-time KPI cards**: 6 key metrics with trend indicators
- **Interactive charts**: Line, Bar, Doughnut charts (Chart.js)
- **Delivery trends**: Track completed, pending, failed deliveries
- **Vehicle utilization**: Per-vehicle performance metrics
- **CO2 emission breakdown**: Environmental impact analysis
- **Top routes**: Performance leaderboard
- **AI insights**: Automated recommendations
- **Export capabilities**: CSV & PDF export

#### React Component:
```typescript
import AdvancedAnalytics from '@/components/AdvancedAnalytics';

// Usage in your page
<AdvancedAnalytics
  warehouseId="507f1f77bcf86cd799439011"  // Optional filter
  dateRange={{
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  }}
/>
```

#### Metrics Displayed:
1. **Total Deliveries** - with % change
2. **Completed** - completion rate
3. **Avg Delivery Time** - efficiency metric
4. **Active Vehicles** - fleet utilization
5. **CO2 Emissions** - sustainability tracking
6. **Fleet Utilization** - capacity usage

#### Charts:
- **Delivery Trends**: Multi-line chart showing daily delivery patterns
- **Vehicle Utilization**: Bar chart per vehicle
- **CO2 Sources**: Doughnut chart breakdown (Transport, Idle, Warehouse)
- **Top Routes**: Performance ranking with efficiency scores

---

## 📦 Dependencies

### Backend (stock2door_backend)
```json
{
  "csv-parser": "^3.0.0",
  "json2csv": "^6.0.0",
  "multer": "^1.4.5-lts.1",
  "@googlemaps/google-maps-services-js": "^3.4.0"
}
```

### Frontend (stock2door/frontend)
```json
{
  "@googlemaps/js-api-loader": "^1.16.8",
  "chart.js": "^4.4.1",
  "react-chartjs-2": "^5.2.0"
}
```

---

## 🗂️ File Structure

### Backend (stock2door_backend)
```
src/
├── controllers/
│   ├── cluster.controller.js          # Delivery clustering logic
│   ├── simulation.controller.js       # Route simulation & forecasting
│   └── bulk.controller.js             # CSV bulk operations
├── routes/
│   ├── cluster.routes.js
│   ├── simulation.routes.js
│   └── bulk.routes.js
└── models/
    └── Cluster.js                     # Cluster data model
```

### Frontend (stock2door/frontend)
```
src/
├── components/
│   ├── RouteMap.tsx                   # Google Maps visualization
│   └── AdvancedAnalytics.tsx          # Analytics dashboard
└── lib/
    └── api.ts                         # Updated with new endpoints
```

---

## 🔐 Permissions & RBAC

### Clustering
- **Create/Manage**: Admin, Logistics Manager
- **View**: All authenticated users
- **Execute**: Admin, Logistics Manager, Fleet Operator

### Simulation
- **Access**: Admin, Logistics Manager

### Bulk Operations
- **Upload Deliveries**: Admin, Logistics Manager
- **Upload Products**: Admin, Inventory Manager
- **Export**: All authenticated users

---

## 🧪 Testing

### Cluster Creation Test:
```bash
curl -X POST http://localhost:5000/api/v1/clusters/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouseId": "507f1f77bcf86cd799439011",
    "deliveryIds": ["id1", "id2", "id3"],
    "epsilon": 5,
    "minPoints": 2
  }'
```

### Route Simulation Test:
```bash
curl -X POST http://localhost:5000/api/v1/simulation/route \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouseId": "507f1f77bcf86cd799439011",
    "deliveryIds": ["id1", "id2"],
    "scenario": "eco"
  }'
```

### Bulk Upload Test:
```bash
curl -X POST http://localhost:5000/api/v1/bulk/deliveries/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@deliveries.csv"
```

---

## 🚦 Getting Started

### 1. Backend Setup
```bash
cd stock2door_backend
npm install
```

Add to `.env`:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd stock2door/frontend
npm install
```

Add to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Start development server:
```bash
npm run dev
```

### 3. Access Advanced Features

Navigate to:
- **Clustering**: `/clusters` or `/logistics/clusters`
- **Simulation**: `/simulation` or `/logistics/simulation`
- **Bulk Operations**: `/bulk` or `/admin/bulk`
- **Analytics**: `/analytics` or `/dashboard/analytics`

---

## 📊 Performance Optimization Tips

1. **Clustering**:
   - Use epsilon 3-10 km for urban areas
   - Set minPoints to 2-5 for optimal clusters
   - Schedule during off-peak hours

2. **Simulation**:
   - Cache simulation results for identical inputs
   - Use 'balanced' scenario as default
   - Run simulations before assigning vehicles

3. **Bulk Operations**:
   - Keep CSV files under 5MB for faster processing
   - Validate data locally before upload
   - Use templates to ensure correct format

4. **Map Visualization**:
   - Limit markers to 100-200 for performance
   - Use clustering for large datasets
   - Enable API quotas and monitoring

5. **Analytics**:
   - Query specific date ranges
   - Use filters to reduce data volume
   - Export large reports as CSV instead of viewing

---

## 🐛 Troubleshooting

### Map not loading
- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
- Verify API key has Maps JavaScript API enabled
- Check browser console for errors

### Bulk upload failing
- Verify CSV format matches template
- Check file size (max 10MB)
- Ensure all required fields are present
- Review error details in response

### Clustering not creating clusters
- Verify deliveries have valid coordinates
- Check epsilon value (may be too small)
- Ensure minPoints ≤ number of deliveries
- Confirm deliveries are in 'pending' status

### Simulation returning errors
- Verify Google Maps API key is set on backend
- Check warehouse and delivery IDs exist
- Ensure deliveries have valid coordinates
- Review API rate limits

---

## 📚 Additional Resources

- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [DBSCAN Clustering Algorithm](https://en.wikipedia.org/wiki/DBSCAN)
- [CSV Format Specifications](https://tools.ietf.org/html/rfc4180)

---

## 🎉 Summary

The Stock2Door system now includes:

✅ **Delivery Clustering** with DBSCAN algorithm  
✅ **Route Simulation** with 4 optimization scenarios  
✅ **Bulk Operations** for CSV import/export  
✅ **Map Visualization** with Google Maps integration  
✅ **Advanced Analytics** with charts and AI insights  

All features are fully integrated, RBAC-protected, and production-ready!

---

**Need Help?** Contact the development team or refer to the main project documentation in `/docs`.
