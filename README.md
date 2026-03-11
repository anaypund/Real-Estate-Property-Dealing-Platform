# Real Estate Buyer-Seller Management Platform

A full-stack web application that connects real estate buyers and sellers, enabling seamless property browsing, inquiries, visits scheduling, and seller analytics.

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Stakeholder Diagram](#stakeholder-diagram)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Variables](#environment-variables)

---

## ✨ Features

### **Authentication & User Management**
- User registration with role-based access (Buyer, Seller, Agent, Admin)
- JWT-based secure authentication
- Password hashing with bcrypt
- User profile management
- User verification & suspension system

### **Property Management**
- Complete CRUD operations for properties
- Property listing with advanced filtering
- Image upload support (multiple images per property)
- Featured properties showcase
- Property view tracking
- Property status management (active, pending, sold, inactive)

### **Buyer Features**
- Browse all properties with filters (city, price range, bedrooms, property type, amenities)
- Save properties to favorites
- Submit inquiries to sellers
- Schedule property visits
- Track saved properties and inquiry status
- View visit history

### **Seller Features**
- Dashboard with statistics
- Lead management (view and update inquiry status)
- Analytics and reporting
- Property performance tracking
- Multiple property listings
- Lead status tracking (new, seen, contacted, closed)

### **Admin Panel Features** 🆕
- User management (view, suspend, delete users)
- Property moderation and verification
- System statistics and analytics
- Dispute resolution with buyers and sellers
- Featured property management
- Commission tracking and payments
- User reports and fraud detection
- Platform-wide analytics dashboard
- Manage property categories and amenities

### **Additional Features**
- Rate limiting for API security
- CORS enabled for cross-origin requests
- Security headers with Helmet.js
- Input validation with express-validator
- Error handling middleware
- Static file serving for uploaded images

---

## 🛠 Technology Stack

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js (v4.18.2)
- **Database:** MongoDB with Mongoose ODM (v8.0.3)
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Security:** 
  - bcryptjs (v2.4.3) for password hashing
  - Helmet.js (v7.1.0) for security headers
  - express-rate-limit (v7.1.5) for rate limiting
  - CORS enabled
- **File Upload:** Multer (v1.4.5-lts.1)
- **Validation:** express-validator (v7.0.1)
- **Environment:** dotenv (v16.3.1)
- **Development:** nodemon (v3.0.2)

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Tailwind CSS for styling
- **JavaScript (Vanilla)** - Frontend logic
- **RESTful API** - Communication with backend

---

## 📁 Project Structure

```
Real Estate app/
│
├── backend/                          # Backend API Server
│   ├── server.js                     # Main server entry point
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables
│   │
│   ├── config/
│   │   └── db.js                     # MongoDB connection setup
│   │
│   ├── controllers/                  # Business logic
│   │   ├── authController.js         # Authentication logic (register, login, getMe)
│   │   ├── propertyController.js     # Property CRUD operations
│   │   ├── buyerController.js        # Buyer features (favorites, inquiries, visits)
│   │   ├── sellerController.js       # Seller features (dashboard, analytics)
│   │   └── adminController.js        # Admin features (user management, moderation)
│   │
│   ├── models/                       # MongoDB Schemas
│   │   ├── User.js                   # User schema (name, email, role, phone, profilePicture)
│   │   ├── Property.js               # Property schema (title, desc, price, location, images, etc)
│   │   ├── Favorite.js               # Favorite properties schema
│   │   ├── Inquiry.js                # Property inquiries schema
│   │   ├── Visit.js                  # Property visit scheduling schema
│   │   └── Dispute.js                # Dispute/complaint schema for admin moderation
│   │
│   ├── middleware/                   # Custom middleware
│   │   ├── auth.js                   # JWT protection & role authorization
│   │   ├── errorHandler.js           # Global error handling
│   │   └── upload.js                 # File upload configuration (Multer)
│   │
│   ├── routes/                       # API endpoints
│   │   ├── auth.js                   # Auth routes (register, login, getMe)
│   │   ├── properties.js             # Property endpoints (CRUD, featured, search)
│   │   ├── buyers.js                 # Buyer endpoints (favorites, inquiries, visits)
│   │   ├── sellers.js                # Seller endpoints (dashboard, leads, analytics)
│   │   └── admin.js                  # Admin endpoints (user management, moderation)
│   │
│   ├── uploads/                      # Uploaded files storage
│   │   └── properties/               # Property images
│   │
│   └── README.md                     # Backend documentation
│
└── frontend/                          # Frontend Application
    ├── index.html                     # Root redirect to homepage
    ├── README.md                      # Frontend documentation
    │
    ├── pages/                         # HTML Pages
    │   ├── index.html                 # Homepage with featured properties
    │   ├── properties.html            # Property search & listing
    │   ├── property-details.html      # Single property details
    │   ├── buyer-dashboard.html       # Buyer dashboard (favorites, inquiries, visits)
    │   ├── seller-dashboard.html      # Seller dashboard (analytics, leads)
    │   ├── admin-dashboard.html       # Admin dashboard (user/property management)
    │   ├── login.html                 # User login page
    │   └── register.html              # User registration page
    │
    └── assets/
        ├── js/                        # JavaScript Files
        │   ├── api.js                 # Base API service & HTTP client
        │   ├── auth.js                # Authentication service
        │   ├── services.js            # API services (Property, Buyer, Seller)
        │   ├── utils.js               # Utility functions
        │   ├── homepage.js            # Homepage logic
        │   ├── propertyDetails.js     # Property details page logic
        │   ├── buyerDashboard.js      # Buyer dashboard logic
        │   ├── sellerDashboard.js     # Seller dashboard logic
        │   ├── propertiesPage.js      # Properties search page logic
        │   └── searchUtils.js         # Search & filtering utilities
        │
        ├── css/                       # Stylesheet files
        │   └── *.css                  # Tailwind CSS styles
        │
        └── images/                    # Image assets
```

---

## � Stakeholder Diagram

This diagram shows the different stakeholders in the Real Estate platform and their relationships:

```
                         ┌─────────────────────┐
                         │   ADMIN PANEL       │
                         │  (Platform Owner)   │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
         ┌─────────────┐    ┌──────────────┐   ┌──────────────┐
         │   BUYERS    │    │   SELLERS    │   │   AGENTS     │
         │             │    │              │   │              │
         │ - Browse    │    │ - List       │   │ - List       │
         │ - Search    │    │ - Manage     │   │ - Connect    │
         │ - Inquire   │    │ - Analytics  │   │ - Broker     │
         │ - Visit     │    │ - Leads      │   │ - Commissions│
         │ - Favorite  │    │ - Dashboard  │   │ - Dashboard  │
         └──────┬──────┘    └──────┬───────┘   └──────┬───────┘
                │                  │                  │
                └──────────────────┼──────────────────┘
                                   │
                         ┌─────────┴────────┐
                         │   PROPERTIES    │
                         │                 │
                         │ - Listings      │
                         │ - Inquiries     │
                         │ - Visits        │
                         │ - Reviews       │
                         └─────────────────┘
```

### **Admin Responsibilities & Capabilities**

| Admin Function | Manages | Capabilities |
|---|---|---|
| **User Management** | All Users | Suspend/Delete profiles, Verify accounts, Monitor activity, View reports |
| **Property Moderation** | Listings | Approve/Reject listings, Flag inappropriate content, Remove violations, Manage featured listings |
| **Dispute Resolution** | Complaints | Resolve disputes, Process refunds, Ban users, Collect evidence |
| **Analytics & Reports** | Platform Data | Platform statistics, Revenue tracking, User behavior analysis, Trends |
| **System Configuration** | Settings | Property categories, Amenities, Commission rates, Feature toggles |

---

## 🔄 User Interaction Flow

**Buyer Journey:**
```
Register → Login → Browse Properties → Filter & Search → View Details → 
  Add to Favorites → Submit Inquiry → Schedule Visit → Dashboard
```

**Seller Journey:**
```
Register → Login → Create Listing → Upload Images → Dashboard → 
  View Leads → Respond to Inquiries → Track Analytics
```

**Agent Journey:**
```
Register → Login → Create Listings → Broker Properties → 
  Manage Multiple Sellers → Commission Tracking → Analytics
```

**Admin Journey:**
```
Login → Dashboard → Monitor Users → Review Properties → Manage Disputes → 
  Configure System → View Analytics → Generate Reports
```

---

## �🚀 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud database)
- npm or yarn

### **Backend Setup**

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** in the `backend` directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/real-estate
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development
```

4. **Create uploads directory:**
```bash
mkdir uploads
mkdir uploads/properties
```

### **Frontend Setup**

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies** (if using npm for frontend):
```bash
npm install
```

3. Update API base URL in [assets/js/api.js](frontend/assets/js/api.js) if needed:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## ▶️ Running the Application

### **Start Backend**

```bash
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### **Start Frontend**

Open the frontend files in a web browser:
- `frontend/pages/index.html` - Homepage
- Or use a local server: `npx http-server frontend/`

Frontend will be served at `http://localhost:8080`

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Routes** (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // "buyer", "seller", "agent" (admin created by superadmin only)
}

Response: { success: true, token: "JWT_TOKEN", user: {...} }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { success: true, token: "JWT_TOKEN", user: {...} }
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer JWT_TOKEN

Response: { success: true, user: {...} }
```

---

### **Property Routes** (`/api/properties`)

#### Get All Properties (Public)
```
GET /api/properties?city=New York&minPrice=100000&maxPrice=500000&bedrooms=2&page=1&limit=10

Query Parameters:
- city           : Filter by city
- minPrice       : Minimum price filter
- maxPrice       : Maximum price filter
- bedrooms       : Minimum bedrooms filter
- bathrooms      : Minimum bathrooms filter
- propertyType   : Filter by property type (house, apartment, condo, etc)
- amenities      : Comma-separated amenities
- page           : Page number (default: 1)
- limit          : Items per page (default: 10)
- sort           : Sort field (default: -createdAt)

Response: { success: true, data: [...], total: 50, page: 1 }
```

#### Get Featured Properties (Public)
```
GET /api/properties/featured

Response: { success: true, data: [...] }
```

#### Get Single Property (Public)
```
GET /api/properties/:id

Response: { success: true, data: {...} }
```

#### Create Property (Protected - Seller/Agent Only)
```
POST /api/properties
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- title          : Property title (required)
- description    : Property description (required)
- price          : Price (required)
- propertyType   : Property type (required)
- bedrooms       : Number of bedrooms (required)
- bathrooms      : Number of bathrooms (required)
- sqft           : Square footage (required)
- images         : Multiple image files (max 10)
- amenities      : Comma-separated amenities
- location[address] : Address (required)
- location[city]    : City (required)
- location[state]   : State
- location[zipCode] : Zip code
- yearBuilt      : Year built
- featured       : Boolean, make it featured listing

Response: { success: true, data: {...} }
```

#### Update Property (Protected - Owner Only)
```
PUT /api/properties/:id
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data

Same fields as Create Property

Response: { success: true, data: {...} }
```

#### Delete Property (Protected - Owner Only)
```
DELETE /api/properties/:id
Authorization: Bearer JWT_TOKEN

Response: { success: true, message: "Property deleted" }
```

---

### **Buyer Routes** (`/api/buyers`) - All Protected (Buyer Role Required)

#### Add to Favorites
```
POST /api/buyers/favorites
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "propertyId": "property_object_id"
}

Response: { success: true, data: {...} }
```

#### Get Favorites
```
GET /api/buyers/favorites
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: [...] }
```

#### Remove from Favorites
```
DELETE /api/buyers/favorites/:propertyId
Authorization: Bearer JWT_TOKEN

Response: { success: true, message: "Removed from favorites" }
```

#### Submit Inquiry
```
POST /api/buyers/inquiries
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "propertyId": "property_object_id",
  "message": "I'm interested in this property",
  "phone": "123-456-7890"
}

Response: { success: true, data: {...} }
```

#### Get Inquiries
```
GET /api/buyers/inquiries
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: [...] }
```

#### Schedule Visit
```
POST /api/buyers/visits
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "propertyId": "property_object_id",
  "visitDate": "2024-03-20",
  "visitTime": "14:00",
  "notes": "Optional notes about the visit"
}

Response: { success: true, data: {...} }
```

#### Get Scheduled Visits
```
GET /api/buyers/visits
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: [...] }
```

---

### **Seller Routes** (`/api/sellers`) - All Protected (Seller/Agent Role Required)

#### Get Dashboard Statistics
```
GET /api/sellers/dashboard
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: { totalProperties, activeListings, totalViews, totalInquiries } }
```

#### Get Leads
```
GET /api/sellers/leads
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: [...] }
```

#### Update Lead Status
```
PUT /api/sellers/leads/:inquiryId
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "status": "contacted"  // "new", "seen", "contacted", "closed"
}

Response: { success: true, data: {...} }
```

#### Get Analytics
```
GET /api/sellers/analytics
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: { viewsPerProperty, inquiriesPerProperty, conversionRate } }
```

---

### **Admin Routes** (`/api/admin`) - All Protected (Admin Role Required) 🔐

#### Get Dashboard Statistics
```
GET /api/admin/dashboard
Authorization: Bearer JWT_TOKEN

Response: { 
  success: true, 
  data: { 
    totalUsers, 
    totalProperties, 
    totalInquiries,
    activeListings,
    platformRevenue,
    totalDisputes
  } 
}
```

#### Get All Users (Paginated)
```
GET /api/admin/users?page=1&limit=20&role=buyer&status=active

Query Parameters:
- page      : Page number (default: 1)
- limit     : Items per page (default: 20)
- role      : Filter by role (buyer, seller, agent)
- status    : Filter by status (active, suspended, banned)
- search    : Search by name or email

Response: { success: true, data: [...], total: 150, page: 1 }
```

#### Get User Details
```
GET /api/admin/users/:userId
Authorization: Bearer JWT_TOKEN

Response: { success: true, data: { user details, activityLog, properties, inquiries } }
```

#### Suspend User
```
PUT /api/admin/users/:userId/suspend
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "reason": "Inappropriate behavior",
  "duration": 30  // days, 0 for permanent
}

Response: { success: true, message: "User suspended" }
```

#### Delete User
```
DELETE /api/admin/users/:userId
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "reason": "Fraudulent activity"
}

Response: { success: true, message: "User deleted" }
```

#### Get All Properties (For Review)
```
GET /api/admin/properties?status=pending&page=1&limit=20

Query Parameters:
- status    : Filter by status (active, pending, flagged, rejected)
- page      : Page number (default: 1)
- limit     : Items per page (default: 20)
- featured  : Filter featured properties

Response: { success: true, data: [...], total: 500 }
```

#### Approve Property
```
PUT /api/admin/properties/:propertyId/approve
Authorization: Bearer JWT_TOKEN

Response: { success: true, message: "Property approved" }
```

#### Reject Property
```
PUT /api/admin/properties/:propertyId/reject
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "reason": "Inappropriate images"
}

Response: { success: true, message: "Property rejected" }
```

#### Flag Property (Inappropriate Content)
```
PUT /api/admin/properties/:propertyId/flag
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "reason": "Spam listing",
  "severity": "high"  // "low", "medium", "high"
}

Response: { success: true, message: "Property flagged" }
```

#### Remove Property
```
DELETE /api/admin/properties/:propertyId
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "reason": "Policy violation"
}

Response: { success: true, message: "Property deleted" }
```

#### Make Featured
```
PUT /api/admin/properties/:propertyId/featured
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "featured": true,
  "duration": 30  // days
}

Response: { success: true, data: {...} }
```

#### Get Disputes/Complaints
```
GET /api/admin/disputes?status=open&page=1&limit=20

Query Parameters:
- status    : Filter by status (open, resolved, closed)
- priority  : Filter by priority (low, medium, high)
- page      : Page number (default: 1)
- limit     : Items per page (default: 20)

Response: { success: true, data: [...] }
```

#### Resolve Dispute
```
PUT /api/admin/disputes/:disputeId/resolve
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "resolution": "Refund issued",
  "refundAmount": 5000,
  "action": "suspend_user"  // "none", "suspend_user", "ban_user"
}

Response: { success: true, data: {...} }
```

#### Get Platform Analytics
```
GET /api/admin/analytics?period=month&startDate=2024-01-01&endDate=2024-03-11

Query Parameters:
- period    : Time period (day, week, month, year)
- startDate : Start date (YYYY-MM-DD)
- endDate   : End date (YYYY-MM-DD)

Response: { 
  success: true, 
  data: { 
    userGrowth,
    propertyTrends,
    inquiryMetrics,
    revenueAnalytics,
    topCities,
    conversionRates
  } 
}
```

#### Get System Settings
```
GET /api/admin/settings
Authorization: Bearer JWT_TOKEN

Response: { 
  success: true, 
  data: { 
    commissionRate,
    categories,
    amenities,
    propertyTypes,
    features
  } 
}
```

#### Update System Settings
```
PUT /api/admin/settings
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "commissionRate": 5,
  "maxImagesPerProperty": 10,
  "verificationRequired": true
}

Response: { success: true, data: {...} }
```

---

## 📊 Database Models

### **User Model**
```javascript
{
  _id:             ObjectId,
  name:            String (required),
  email:           String (required, unique, lowercase),
  password:        String (required, hashed),
  role:            String (enum: ['buyer', 'seller', 'agent', 'admin'], default: 'buyer'),
  phone:           String,
  profilePicture:  String,
  status:          String (enum: ['active', 'suspended', 'banned'], default: 'active'),
  verificationStatus: String (enum: ['unverified', 'verified', 'rejected'], default: 'unverified'),
  suspensionReason: String,
  suspensionUntil: Date,
  createdAt:       Date (default: now),
  lastLogin:       Date
}
```

### **Property Model**
```javascript
{
  _id:             ObjectId,
  title:           String (required, max 100),
  description:     String (required, max 2000),
  price:           Number (required),
  propertyType:    String (required),
  location: {
    address:       String (required),
    city:          String (required),
    state:         String,
    zipCode:       String,
    country:       String (default: 'USA')
  },
  bedrooms:        Number (required),
  bathrooms:       Number (required),
  sqft:            Number (required),
  yearBuilt:       Number,
  images:          [String],
  amenities:       [String],
  status:          String (enum: ['active', 'pending', 'sold', 'inactive'], default: 'active'),
  featured:        Boolean (default: false),
  views:           Number (default: 0),
  seller:          ObjectId (ref: User),
  createdAt:       Date (default: now)
}
```

### **Favorite Model**
```javascript
{
  _id:             ObjectId,
  user:            ObjectId (ref: User, required),
  property:        ObjectId (ref: Property, required),
  createdAt:       Date (default: now)
  
  // Unique constraint: (user, property) tuple
}
```

### **Inquiry Model**
```javascript
{
  _id:             ObjectId,
  property:        ObjectId (ref: Property, required),
  buyer:           ObjectId (ref: User, required),
  seller:          ObjectId (ref: User, required),
  message:         String (required, max 1000),
  buyerName:       String (required),
  buyerEmail:      String (required),
  buyerPhone:      String,
  status:          String (enum: ['new', 'seen', 'contacted', 'closed'], default: 'new'),
  createdAt:       Date (default: now)
}
```

### **Visit Model**
```javascript
{
  _id:             ObjectId,
  property:        ObjectId (ref: Property, required),
  buyer:           ObjectId (ref: User, required),
  visitDate:       Date (required),
  visitTime:       String (required),
  status:          String (enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending'),
  notes:           String (max 500),
  createdAt:       Date (default: now)
}
```

### **Dispute Model** (Admin)
```javascript
{
  _id:             ObjectId,
  complainant:     ObjectId (ref: User, required),
  respondent:      ObjectId (ref: User, required),
  property:        ObjectId (ref: Property),
  complaintType:   String (enum: ['fraud', 'harassment', 'misrepresentation', 'payment', 'other']),
  description:     String (required, max 2000),
  attachments:     [String],
  priority:        String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium'),
  status:          String (enum: ['open', 'in_review', 'resolved', 'closed'], default: 'open'),
  resolution:      String,
  refundAmount:    Number,
  actionTaken:     String (enum: ['none', 'suspend_user', 'ban_user', 'refund'], default: 'none'),
  adminNotes:      String,
  resolvedAt:      Date,
  resolvedBy:      ObjectId (ref: User),
  createdAt:       Date (default: now),
  updatedAt:       Date (default: Date.now)
}
```

---

## 🔐 Authentication & Authorization

### **JWT Token Structure**
The server returns a JWT token upon successful login/registration. Include this token in the `Authorization` header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

### **Role-Based Access Control**

| Route | Buyer | Seller | Agent | Admin | Public |
|-------|-------|--------|-------|-------|--------|
| GET /properties | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /properties | ❌ | ✅ | ✅ | ❌ | ❌ |
| PUT /properties/:id | ❌ | ✅* | ✅* | ✅ | ❌ |
| DELETE /properties/:id | ❌ | ✅* | ✅* | ✅ | ❌ |
| POST /buyers/* | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /sellers/* | ❌ | ✅ | ✅ | ❌ | ❌ |
| GET/PUT/DELETE /admin/* | ❌ | ❌ | ❌ | ✅ | ❌ |

*Owner only (Seller/Agent can only manage their own properties)

### **Security Features**
- **Password Hashing:** bcryptjs with salt rounds
- **JWT Expiration:** 30 days (configurable)
- **Rate Limiting:** 100 requests per 10 minutes per IP
- **CORS:** Enabled for cross-origin requests
- **Security Headers:** Applied via Helmet.js
- **Input Validation:** All inputs validated before processing

---

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/real-estate
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload (Optional)
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### **Important Notes**
- Never commit `.env` file to version control
- Change `JWT_SECRET` in production to a strong, random value
- Use MongoDB Atlas for production (not localhost)
- Set `NODE_ENV=production` in production environment

---

## 📝 Project Features Summary

| Feature | Status | Backend | Frontend |
|---------|--------|---------|----------|
| User Authentication | ✅ | Routes & Controllers | Login/Register pages |
| Property Listing | ✅ | CRUD endpoints | Properties page |
| Advanced Search | ✅ | Query filters | Search UI |
| Property Details | ✅ | GET endpoint | Details page |
| Image Upload | ✅ | Multer middleware | Upload form |
| Favorites/Saved | ✅ | Buyer controller | Buyer dashboard |
| Inquiries | ✅ | Buyer controller | Inquiry form |
| Visit Scheduling | ✅ | Buyer controller | Calendar/form |
| Seller Dashboard | ✅ | Seller controller | Dashboard page |
| Lead Management | ✅ | Seller controller | Dashboard |
| Analytics | ✅ | Seller controller | Dashboard charts |
| Role-Based Access | ✅ | Auth middleware | Route protection |
| **Admin Panel** 🆕 | ✅ | Admin controller | Admin dashboard |
| **User Management** 🆕 | ✅ | Admin controller | Admin panel |
| **Property Moderation** 🆕 | ✅ | Admin controller | Admin panel |
| **Dispute Resolution** 🆕 | ✅ | Admin controller | Admin panel |
| **Platform Analytics** 🆕 | ✅ | Admin controller | Admin panel |
| **System Settings** 🆕 | ✅ | Admin controller | Admin panel |

---

## 📞 Support & Contribution

For issues or contributions, please:
1. Create a detailed issue/PR description
2. Follow the existing code structure
3. Test all changes before submitting
4. Update documentation as needed

---

## 📄 License

ISC License

---

**Last Updated:** March 2024
