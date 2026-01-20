# Frontend Integration - Quick Start Guide

## 🎯 What's Been Integrated

Your frontend has been successfully integrated with the backend API while preserving all existing Tailwind designs!

## 📁 New Folder Structure

```
frontend/
├── pages/
│   ├── index.html                 (Homepage with API)
│   ├── properties.html            (Search & listings - ready for API)
│   ├── property-details.html     (Single property - ready for API)
│   ├── buyer-dashboard.html      (Buyer dashboard - ready for API)
│   ├── seller-dashboard.html     (Seller dashboard - ready for API)
│   ├── login.html                ✨ NEW (Fully functional)
│   └── register.html             ✨ NEW (Fully functional)
├── assets/
│   ├── js/
│   │   ├── api.js                ✨ Base API service
│   │   ├── auth.js               ✨ Authentication service
│   │   ├── utils.js              ✨ Utility functions
│   │   ├──services.js           ✨ API services (Properties, Buyer, Seller)
│   │   └── homepage.js           ✨ Homepage integration
│   ├── css/
│   └── images/
└── index.html (Redirects to pages/index.html)
```

## ✅ Completed Integrations

### 1. **Authentication Pages** (100% Complete)
- ✅ Login page with email/password
- ✅ Register page with role selection (buyer/seller/agent)
- ✅ Auto-redirect based on user role
- ✅ Token management (localStorage)
- ✅ Form validation

### 2. **Homepage** (95% Complete)
- ✅ Fetches featured properties from API
- ✅ Dynamic property cards
- ✅ Search bar connects to properties page
- ✅ Auth-aware navigation (shows login or user profile)
- ✅ Favorite button integration  (requires login)
- ✅ All existing Tailwind styles preserved

### 3. **API Service Layer** (100% Complete)
- ✅ `api.js` - Base HTTP client with token management
- ✅ `auth.js` - Login, Register, Logout, Auth guards
- ✅ `services.js` - Property, Buyer, Seller services
- ✅ `utils.js` - Toast notifications, loaders, formatters

## 🔄 Next Steps (Remaining Pages)

To complete the integration, add these scripts to the remaining pages:

### Properties Page (Search & Listings)
Add before `</body>`:
```html
<script src="../assets/js/api.js"></script>
<script src="../assets/js/utils.js"></script>
<script src="../assets/js/auth.js"></script>
<script src="../assets/js/services.js"></script>
<script>
// TODO: Fetch properties with filters
// PropertyService.getProperties({ city, minPrice, maxPrice, bedrooms, propertyType, page, limit })
</script>
```

### Property Details Page
Add before `</body>`:
```html
<script src="../assets/js/api.js"></script>
<script src="../assets/js/utils.js"></script>
<script src="../assets/js/auth.js"></script>
<script src="../assets/js/services.js"></script>
<script>
// TODO: Get property ID from URL and fetch details
// const id = getPropertyIdFromUrl();
// PropertyService.getProperty(id)
// BuyerService.submitInquiry(id, message)
// BuyerService.scheduleVisit(id, date, time, notes)
</script>
```

### Buyer Dashboard
Add before `</body>`:
```html
<script src="../assets/js/api.js"></script>
<script src="../assets/js/utils.js"></script>
<script src="../assets/js/auth.js"></script>
<script src="../assets/js/services.js"></script>
<script>
// Auth guard
AuthService.requireAuth('buyer');

// TODO: Load buyer data
// BuyerService.getFavorites()
// BuyerService.getInquiries()
// BuyerService.getVisits()
</script>
```

### Seller Dashboard
Add before `</body>`:
```html
<script src="../assets/js/api.js"></script>
<script src="../assets/js/utils.js"></script>
<script src="../assets/js/auth.js"></script>
<script src="../assets/js/services.js"></script>
<script>
// Auth guard
AuthService.requireAuth('seller');

// TODO: Load seller data
// SellerService.getDashboardStats()
// SellerService.getLeads()
// PropertyService.createProperty(formData) // for add property form
</script>
```

## 🚀 How to Test

1. **Start the backend server** (should already be running):
   ```bash
   cd backend
   npm start
   ```

2. **Open the frontend**:
   - Open `frontend/pages/index.html` in your browser
   - Or use Live Server extension in VS Code

3. **Test Authentication**:
   - Click "Sign In" → Try login
   - Click "Register" → Create new account (buyer or seller)
   - Try both buyer and seller roles

4. **Test Homepage**:
   - View featured properties (loaded from API)
   - Click on property cards
   - Try the search bar
   - Try favorite button (requires login)

## 📚 Available API Functions

### Authentication
```javascript
AuthService.login(email, password)
AuthService.register(userData)
AuthService.logout()
AuthService.getCurrentUser()
AuthService.isAuthenticated()
AuthService.requireAuth(role) // Use in protected pages
```

### Properties
```javascript
PropertyService.getProperties(filters) // filters: { city, minPrice, maxPrice, bedrooms, propertyType, page, limit }
PropertyService.getFeaturedProperties()
PropertyService.getProperty(id)
PropertyService.createProperty(formData) // Seller only
PropertyService.updateProperty(id, formData) // Seller only
PropertyService.deleteProperty(id) // Seller only
```

### Buyer Features
```javascript
BuyerService.addFavorite(propertyId)
BuyerService.getFavorites()
BuyerService.removeFavorite(propertyId)
BuyerService.submitInquiry(propertyId, message)
BuyerService.getInquiries()
BuyerService.scheduleVisit(propertyId, visitDate, visitTime, notes)
BuyerService.getVisits()
```

### Seller Features
```javascript
SellerService.getDashboardStats()
SellerService.getLeads()
SellerService.updateLeadStatus(leadId, status)
SellerService.getAnalytics()
```

### Utilities
```javascript
showToast(message, type) // type: 'success', 'error', 'warning', 'info'
showLoader()
hideLoader()
formatPrice(price) // Returns $1,250,000
formatDate(dateString) // Returns "Jan 20, 2026"
formatRelativeTime(dateString) // Returns "2 hours ago"
getQueryParams() // Returns { city: 'Los Angeles', ... }
getImageUrl(imagePath) // Returns full image URL
```

## 🎨 Design Principles

- ✨ **No design changes** - All existing Tailwind styles are preserved
- 🔒 **Security** - JWT tokens stored in localStorage
- 📱 **Responsive** - All integrations work on mobile
- ⚡ **Performance** - Async/await for all API calls
- 🎯 **UX** - Toast notifications for user feedback
- 🔄 **Loading states** - Show loaders during API calls

##🐛 Troubleshooting

**CORS Error**: Make sure backend server is running on `http://localhost:5000`

**Token expired**: Logout and login again

**Images not showing**: Check if `uploads` folder exists in backend

**404 on API calls**: Verify backend server is running

## 📝 Notes

- Backend must be running for frontend to work
- JWT tokens expire after 30 days
- All API calls automatically include the token
- Unauthorized requests redirect to login page
- Role-based redirects after login (buyer → buyer dashboard, seller → seller dashboard)

---

**Status**: 🟢 Core integration complete - Homepage fully functional, authentication working!
