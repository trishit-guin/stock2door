# 📱 SmartRoute – Application Flow Document

**Author:** Senior Product Manager (Google)  
**Version:** 1.0  
**Date:** July 13, 2025

---

## 🔧 1. System Roles & Entry Points

### 👤 User Roles

| Role                    | Access Level                                  |
|-------------------------|-----------------------------------------------|
| Admin                   | Full access, including simulation settings    |
| Logistics Manager       | Manage deliveries, routes, and analytics      |
| Fleet Operator          | View and execute optimized delivery plans     |
| Sustainability Officer  | View dashboard and sustainability reports     |

### 🚪 Entry Points

- **Web App**
  - Admin console
  - Logistics dashboard
- **Mobile App**
  - Fleet Operator delivery execution
- **API**
  - External integration for 3PL/warehouse systems

---

## 🔁 2. User Journey Overview

```text
[Login/Sign Up]
     ↓
[Dashboard Home]
     ↓
[Route Optimization Flow] ←— [CSV Upload]
     ↓
[Delivery Clustering View]
     ↓
[EV Compatibility Check]
     ↓
[Weather-Aware Routing]
     ↓
[Emissions Estimation & Comparison]
     ↓
[Generate Delivery Plan]
     ↓
[Send via API / Export]
```

---

## 🧭 3. Detailed App Flow

### 🔐 A. Authentication

- **Pages:** Login, Sign Up, Forgot Password
- **Logic:**
  - JWT-based session
  - OAuth2.0 token validation
  - Role-based redirection after login

---

### 🏠 B. Dashboard Home

- **Contextual UI based on Role**
- **Key Elements:**
  - Active delivery plans
  - Fleet summary
  - CO₂ savings (real-time)
  - Notifications (weather, route issues)

---

### 🗺️ C. Route Optimization Interface

- **Inputs:**
  - Source
  - Multiple Destinations
  - Vehicle Type
- **Process:**
  - Call /optimize-route API
  - Show route on Google Maps
- **Outputs:**
  - Optimized route with ETA, distance, CO₂
  - Option to compare with default route

---

### 🧮 D. Emissions Calculator

- **Input:** Route + Vehicle Type
- **API:** /emissions
- **Output:** Real-time CO₂ and fuel stats
- **UI Feature:** Side-by-side comparison view

---

### ⚡ E. EV Compatibility Checker

- **Input:** Route + EV Range
- **API:** /check-ev-compat
- **Output:** Charger locations, warnings
- **Feature:** Auto-recommend alternate compatible route

---

### 🌦️ F. Weather-Aware Routing

- **Process:**
  - Fetch route weather from OpenWeatherMap
  - Flag adverse conditions
  - Suggest alternate safe routes
- **UI:** Weather overlay + alerts

---

### 🔄 G. Batch Clustering

- **Input:** Uploaded CSV or manual batch of addresses
- **API:** /cluster-deliveries
- **Output:** Clustered delivery zones
- **Visualization:** Color-coded clusters on the map

---

### 📈 H. Analytics & Dashboard

- **Role-Based Views:**
  - Logistics Manager: Fuel/time optimization
  - Sustainability Officer: CO₂ savings, EV adoption
- **KPIs:**
  - CO₂ saved
  - Fleet emission trends
  - Avg delivery times
- **API:** /analytics/dashboard

---

### 📤 I. CSV Upload & Export

- **Upload Format:**
  - Source, Destination(s), Vehicle Type
- **API:** /bulk-upload
- **Export Options:**
  - Optimized delivery plan (CSV/JSON)
  - Simulation reports

---

### 🧪 J. Simulation Mode (Admin Only)

- **Adjustable Parameters:**
  - Emission vs Time vs Cost weights
- **Output:**
  - Side-by-side route simulations
  - Visualization of impact per change
- **API:** /admin/simulate

---

## 🔗 4. Navigation Map (Screen-Level)

```text
[Login] → [Home Dashboard]
    → [Route Optimizer] → [EV Checker]
                          → [Weather Routing]
    → [Upload CSV] → [Batch Clustering]
    → [Analytics Dashboard]
    → [Admin Simulation Panel] (Admin only)
```

---

## 📋 5. State Management Considerations

| State | Source | Cached? | Persisted? |
|-------|--------|---------|------------|
| Auth Token | OAuth Login | ✅ | ✅ |
| Route Plan | User input/API | ✅ | ✅ |
| Emission Data | API call | ✅ | ❌ |
| EV Compatibility | On-demand | ❌ | ❌ |
| CSV Uploads | User action | ❌ | ✅ |
| Simulation Weights | Admin input | ✅ | ✅ |

---

## 📱 6. Mobile App Flow (Fleet Operator)

- View today’s delivery plan
- See optimized route
- Mark delivery as done (sync with backend)
- Alert logistics manager (delayed, rerouted, issue)

---

## ✅ 7. Success Criteria

- Users reach delivery plan with < 5 clicks
- Mobile app latency < 500ms per screen
- Route generation under 2 seconds
- Admin simulations render in < 3 seconds

---

## 📎 8. Appendix

- [SmartRoute PRD](SmartRoute_PRD.md)
- [SmartRoute Backend Architecture](SmartRoute Backend Architecture & Implementation G.md)
