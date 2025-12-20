# Environment Configuration Guide

## 📋 Overview

This guide explains how to set up environment variables for both backend and frontend applications.

---

## 🔧 Backend Environment Variables

### Location
- Development: `stock2door_backend/.env`
- Example: `stock2door_backend/.env.example`
- Production: `stock2door_backend/.env.production`

### Required Variables

#### Server Configuration
```env
NODE_ENV=development          # Environment: development, production, test
PORT=5000                     # Server port
```

#### Database
```env
MONGODB_URI=mongodb://localhost:27017/stock2door
```

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/stock2door
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock2door?retryWrites=true&w=majority
```

#### Authentication
```env
JWT_SECRET=your_secure_secret_min_32_characters
JWT_EXPIRE=7d                 # Token expiration: 7d, 30d, etc.
BCRYPT_ROUNDS=10             # Password hashing rounds (10-12)
```

#### Google Maps API
```env
GOOGLE_MAPS_API_KEY=AIzaSyC_your_api_key_here
```

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Distance Matrix API
   - Geocoding API
   - Places API
4. Create API Key under "Credentials"
5. (Optional) Restrict key to specific APIs and domains

#### CORS
```env
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Optional Variables

#### Email (for notifications)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password    # Use Gmail App Password
EMAIL_FROM=Stock2Door <noreply@stock2door.com>
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account > Security > App Passwords
3. Use the 16-character password

#### Redis (caching)
```env
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=false
```

#### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max requests per window
```

---

## 🎨 Frontend Environment Variables

### Location
- Development: `stock2door/frontend/.env.local`
- Example: `stock2door/frontend/.env.example`
- Production: `stock2door/frontend/.env.production`

### Required Variables

#### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

#### Google Maps
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC_your_api_key_here
```

**Note:** Same key as backend, or separate key with HTTP referrer restrictions.

#### Application Info
```env
NEXT_PUBLIC_APP_NAME=Stock2Door
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_DESCRIPTION=Enterprise Inventory & Logistics Management
NEXT_PUBLIC_ENV=development
```

### Optional Variables

#### Feature Flags
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MAP_VIEW=true
NEXT_PUBLIC_ENABLE_CLUSTERING=true
NEXT_PUBLIC_ENABLE_SIMULATION=true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
```

#### Map Configuration
```env
NEXT_PUBLIC_DEFAULT_MAP_CENTER_LAT=40.7128
NEXT_PUBLIC_DEFAULT_MAP_CENTER_LNG=-74.0060
NEXT_PUBLIC_DEFAULT_MAP_ZOOM=12
```

#### Pagination
```env
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10
NEXT_PUBLIC_MAX_PAGE_SIZE=100
```

#### Analytics (Google Analytics)
```env
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_TRACKING=false
```

#### Error Tracking (Sentry)
```env
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/project
NEXT_PUBLIC_SENTRY_ENABLED=false
```

---

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd stock2door_backend

# Copy example file
cp .env.example .env

# Edit .env file
# - Update MONGODB_URI
# - Add GOOGLE_MAPS_API_KEY
# - Generate secure JWT_SECRET (minimum 32 characters)
```

**Generate JWT Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

### 2. Frontend Setup

```bash
cd stock2door/frontend

# Copy example file
cp .env.example .env.local

# Edit .env.local file
# - Update NEXT_PUBLIC_API_URL
# - Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

### 3. Verify Configuration

**Backend:**
```bash
cd stock2door_backend
npm run dev
```

Check console output:
```
✓ MongoDB connected successfully!
✓ Server running on http://localhost:5000
✓ Environment: development
```

**Frontend:**
```bash
cd stock2door/frontend
npm run dev
```

Check console output:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

---

## 🔒 Security Best Practices

### Development
1. ✅ Never commit `.env` files to Git
2. ✅ Use `.env.example` as template
3. ✅ Keep secrets in environment variables only
4. ✅ Use different values for dev/staging/prod

### Production
1. ✅ Use strong, randomly generated secrets
2. ✅ Enable HTTPS for all connections
3. ✅ Restrict API keys by domain/IP
4. ✅ Use environment variables from hosting platform
5. ✅ Rotate secrets regularly
6. ✅ Enable rate limiting
7. ✅ Use Redis for session management
8. ✅ Set up monitoring and alerts

### Git Configuration

Add to `.gitignore`:
```gitignore
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Keep examples
!.env.example
!.env.production.example
```

---

## 🌍 Environment-Specific Configuration

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_ENV=development
ENABLE_API_DOCS=true
ENABLE_MORGAN_LOGGER=true
LOG_LEVEL=debug
```

### Staging
```env
NODE_ENV=staging
NEXT_PUBLIC_ENV=staging
ENABLE_API_DOCS=true
ENABLE_MORGAN_LOGGER=true
LOG_LEVEL=info
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_ENV=production
ENABLE_API_DOCS=false
ENABLE_MORGAN_LOGGER=false
LOG_LEVEL=error
```

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Check MongoDB is running: `mongosh`
- Verify MONGODB_URI is correct
- For Atlas, check network access whitelist

**JWT Secret Missing:**
```
Error: JWT_SECRET is not defined
```
- Add JWT_SECRET to .env file
- Must be at least 32 characters
- Restart server after adding

**Google Maps API Error:**
```
Error: REQUEST_DENIED
```
- Check GOOGLE_MAPS_API_KEY is valid
- Verify required APIs are enabled
- Check API key restrictions

### Frontend Issues

**API Connection Failed:**
```
Network Error: Failed to fetch
```
- Verify backend is running on correct port
- Check NEXT_PUBLIC_API_URL matches backend port
- Ensure CORS is configured correctly

**Map Not Loading:**
```
InvalidKeyMapError
```
- Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
- Verify API key has Maps JavaScript API enabled
- Check browser console for specific error

**Environment Variables Not Working:**
```
undefined when accessing process.env.NEXT_PUBLIC_*
```
- Ensure variables start with `NEXT_PUBLIC_`
- Restart development server after changes
- Check .env.local file exists and is in correct location

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [JWT Best Practices](https://jwt.io/introduction)

---

## ✅ Verification Checklist

Before starting development:

### Backend
- [ ] `.env` file created from `.env.example`
- [ ] MongoDB URI configured and tested
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Google Maps API key added
- [ ] CORS origins configured
- [ ] Server starts without errors

### Frontend
- [ ] `.env.local` file created from `.env.example`
- [ ] API URL points to backend
- [ ] Google Maps API key added
- [ ] App loads without errors
- [ ] Can login/register
- [ ] Map displays correctly

---

## 🎉 You're Ready!

Once all environment variables are configured:

1. Start backend: `cd stock2door_backend && npm run dev`
2. Start frontend: `cd stock2door/frontend && npm run dev`
3. Access app: http://localhost:3000
4. Test features: Login, create warehouse, view map, etc.

**Need help?** Refer to [QUICK_START.md](./QUICK_START.md) for complete setup guide.
