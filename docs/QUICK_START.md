# Stock2Door - Quick Start Guide

Get Stock2Door up and running in 10 minutes! 🚀

---

## 📋 Prerequisites

- **Node.js** 18+ (20+ recommended)
- **MongoDB** 6.0+ (or MongoDB Atlas account)
- **Google Maps API Key** ([Get one here](https://console.cloud.google.com/))
- **Git** (for cloning)
- **Code Editor** (VS Code recommended)

---

## 🚀 Installation

### Step 1: Install MongoDB (if not using Atlas)

**Windows:**
```powershell
# Download MongoDB installer from https://www.mongodb.com/try/download/community
# Or use Chocolatey
choco install mongodb
```

**Mac/Linux:**
```bash
# Mac (Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
```

Start MongoDB:
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### Step 2: Clone or Navigate to Project

```bash
cd C:\Users\manas\ignite
```

You should see:
```
stock2door/          # Frontend
stock2door_backend/  # Backend
```

---

## 🔧 Backend Setup (5 minutes)

### 1. Install Dependencies
```bash
cd stock2door_backend
npm install
```

### 2. Create .env File
```bash
# Copy this into .env file
NODE_ENV=development
PORT=5000

# Database (local)
MONGODB_URI=mongodb://localhost:27017/stock2door

# OR use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock2door

# Authentication
JWT_SECRET=your_super_secure_random_string_here_min_32_chars
JWT_EXPIRE=7d

# Google Maps (REQUIRED for route optimization)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Start Backend Server
```bash
npm run dev
```

You should see:
```
✓ MongoDB connected successfully!
✓ Server running on http://localhost:5000
✓ Environment: development
```

**Test it:**
Open browser: http://localhost:5000/api/v1

Should see:
```json
{
  "success": true,
  "message": "Stock2Door API - Integrated with SmartRoute",
  "version": "2.0.0"
}
```

---

## 🎨 Frontend Setup (5 minutes)

### 1. Install Dependencies
```bash
cd stock2door/frontend
npm install
```

### 2. Create .env.local File
```bash
# Copy this into .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_APP_NAME=Stock2Door
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### 3. Start Frontend Server
```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

**Test it:**
Open browser: http://localhost:3000

---

## 👤 Create Your First User

### Option 1: Using API (Thunder Client/Postman)

**POST** `http://localhost:5000/api/v1/auth/register`

Body (JSON):
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@stock2door.com",
  "password": "Admin123!",
  "role": "admin"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@stock2door.com",
      "role": "admin"
    }
  }
}
```

### Option 2: Using Frontend

1. Go to http://localhost:3000/auth
2. Click "Register"
3. Fill in:
   - First Name: Admin
   - Last Name: User
   - Email: admin@stock2door.com
   - Password: Admin123!
   - Role: Admin
4. Click "Sign Up"
5. You'll be logged in automatically!

---

## 🎯 First Steps After Login

### 1. Create a Warehouse
Navigate to: **Warehouses** → **Create Warehouse**

Fill in:
- Name: Main Warehouse
- Warehouse Code: WH-001
- Address: 123 Main St, New York, NY
- Capacity: 10000
- Latitude: 40.7128
- Longitude: -74.0060

### 2. Add Products
Navigate to: **Products** → **Create Product**

Fill in:
- Name: Sample Product
- SKU: PROD-001
- Category: Electronics
- Price: 99.99
- Weight: 2.5 kg

### 3. Add Stock
Navigate to: **Stock** → **Add Stock**

Select:
- Warehouse: Main Warehouse
- Product: Sample Product
- Quantity: 100

### 4. Create a Vehicle
Navigate to: **Vehicles** → **Add Vehicle**

Fill in:
- Vehicle Number: VH-001
- Type: Van
- Capacity: 500 kg

### 5. Create a Delivery
Navigate to: **Deliveries** → **Create Delivery**

Fill in:
- Warehouse: Main Warehouse
- Customer Name: John Doe
- Destination Address: 456 Park Ave, New York, NY
- Destination Coordinates: 40.7589, -73.9851
- Priority: High

### 6. Try Advanced Features

**Clustering:**
- Navigate to: **Clustering**
- Select multiple deliveries
- Click "Create Cluster"
- Assign a vehicle

**Route Simulation:**
- Navigate to: **Simulation**
- Select deliveries
- Choose scenario (Fastest, Shortest, Eco, Balanced)
- Click "Simulate"
- View comparison and recommendations

**Map Visualization:**
- Navigate to: **Map View**
- See warehouses and deliveries on map
- Click markers for details

**Analytics:**
- Navigate to: **Analytics**
- View KPIs, charts, and insights
- Export reports as CSV/PDF

---

## 🔑 Getting Google Maps API Key

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "Stock2Door"

### 2. Enable APIs
Enable these APIs:
- Maps JavaScript API
- Directions API
- Distance Matrix API
- Geocoding API
- Places API

### 3. Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. (Optional) Restrict the key:
   - HTTP referrers: `http://localhost:3000/*`, `https://yourdomain.com/*`
   - API restrictions: Select the APIs listed above

### 4. Add to .env Files
Backend `.env`:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

Frontend `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 5. Restart Servers
```bash
# Stop both servers (Ctrl+C)
# Restart backend
cd stock2door_backend
npm run dev

# Restart frontend (in new terminal)
cd stock2door/frontend
npm run dev
```

---

## 📊 Default User Roles

You can create users with these roles:

| Role | Access Level | Use Case |
|------|-------------|----------|
| `admin` | Full access | System administration |
| `logistics_manager` | Deliveries, vehicles, routes | Operations management |
| `inventory_manager` | Products, stock, warehouses | Inventory control |
| `warehouse_staff` | Stock updates only | Daily operations |
| `fleet_operator` | Vehicles, deliveries | Fleet management |
| `environment_manager` | Emissions, sustainability | Environmental tracking |
| `sustainability_manager` | Green initiatives | Carbon footprint |
| `auditor` | Read-only access | Compliance, reporting |

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "MongoDB connection failed"**
```bash
# Check if MongoDB is running
# Windows:
tasklist | findstr mongod

# Mac/Linux:
ps aux | grep mongod

# Start MongoDB if not running
# Windows: mongod
# Mac/Linux: sudo systemctl start mongod
```

**Error: "Port 5000 already in use"**
```bash
# Change port in .env
PORT=5001

# Or kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Frontend won't start

**Error: "Port 3000 already in use"**
```bash
# Change port
PORT=3001 npm run dev

# Or kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

**Error: "Cannot connect to API"**
- Check backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check for CORS errors in browser console

### Map not loading

**Error: "Google Maps failed to load"**
- Verify `GOOGLE_MAPS_API_KEY` is set in both `.env` files
- Check API key has required APIs enabled
- Check browser console for specific error
- Verify billing is enabled in Google Cloud (after free tier)

### Authentication issues

**Error: "Invalid token"**
```bash
# Clear browser localStorage
# Open browser console (F12)
localStorage.clear()
# Refresh page
```

**Error: "Password doesn't meet requirements"**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## 📚 Next Steps

### Learn More
1. Read [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for detailed feature documentation
2. Check [RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md) for permission details
3. Review [API_INTEGRATION_COMPLETE.md](./API_INTEGRATION_COMPLETE.md) for API reference

### Customize
1. Update branding in `.env` files
2. Modify colors in `tailwind.config.js`
3. Add custom business logic in controllers
4. Create custom reports in analytics

### Deploy
1. Set up production MongoDB (MongoDB Atlas)
2. Configure production environment variables
3. Build frontend: `npm run build`
4. Deploy to hosting platform (Vercel, AWS, etc.)

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connected (check backend console)
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] Can create warehouse
- [ ] Can create product
- [ ] Can create delivery
- [ ] Map displays correctly
- [ ] Analytics page loads
- [ ] All navigation items accessible

---

## 🎉 You're Ready!

Congratulations! Stock2Door is now running on your system.

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1

**Default credentials (if you followed guide):**
- Email: admin@stock2door.com
- Password: Admin123!

**Need help?**
- Check [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) for full system overview
- Review [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for feature guides
- Consult [RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md) for permissions

---

## 🚀 Quick Commands Reference

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Check code quality
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code quality
```

### Database
```bash
mongosh              # Open MongoDB shell
mongodump            # Backup database
mongorestore         # Restore database
```

---

**Happy Shipping! 🚚📦**

*Stock2Door v2.0.0 - Enterprise Inventory & Logistics Management*
