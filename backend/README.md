# Real Estate Backend API

Production-grade REST API for Real Estate Buyer-Seller Management Platform built with Node.js, Express, and MongoDB.

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Buyer, Seller, Agent)
- Secure password hashing with bcrypt

✅ **Property Management**
- Complete CRUD operations
- Advanced search and filtering
- Image upload support
- View tracking
- Featured properties

✅ **Buyer Features**
- Save/favorite properties
- Submit inquiries to sellers
- Schedule property visits
- Track saved properties and inquiries

✅ **Seller Features**
- Dashboard with statistics
- Lead management
- Analytics and reporting
- Property performance tracking

## Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment Variables:**
Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

3. **Create uploads directory:**
```bash
mkdir uploads
mkdir uploads/properties
```

4. **Start server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (Protected)
```

### Properties
```
GET    /api/properties              - Get all properties (with filters)
GET    /api/properties/featured     - Get featured properties
GET    /api/properties/:id          - Get single property
POST   /api/properties              - Create property (Seller only)
PUT    /api/properties/:id          - Update property (Owner only)
DELETE /api/properties/:id          - Delete property (Owner only)
```

**Query Parameters for GET /api/properties:**
- `city` - Filter by city
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Minimum bedrooms
- `propertyType` - Property type
- `amenities` - Comma-separated amenities
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (default: -createdAt)

### Buyers (Protected - Buyer role required)
```
POST   /api/buyers/favorites           - Add to favorites
GET    /api/buyers/favorites           - Get favorites
DELETE /api/buyers/favorites/:id       - Remove from favorites
POST   /api/buyers/inquiries           - Submit inquiry
GET    /api/buyers/inquiries           - Get inquiries
POST   /api/buyers/visits              - Schedule visit
GET    /api/buyers/visits              - Get visits
```

### Sellers (Protected - Seller role required)
```
GET    /api/sellers/dashboard          - Get dashboard stats
GET    /api/sellers/leads              - Get all leads
PUT    /api/sellers/leads/:id          - Update lead status
GET    /api/sellers/analytics          - Get analytics data
```

## Request Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer",
  "phone": "555-1234"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Property (Seller)
```json
POST /api/properties
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Modern Villa",
  "description": "Beautiful modern villa...",
  "price": 1250000,
  "propertyType": "Villa",
  "location": {
    "address": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001"
  },
  "bedrooms": 4,
  "bathrooms": 3,
  "sqft": 2800,
  "amenities": ["Pool", "Garage", "Garden"],
  "images": [file uploads]
}
```

### Search Properties
```
GET /api/properties?city=Los Angeles&minPrice=500000&maxPrice=2000000&bedrooms=3&propertyType=Villa&page=1&limit=10
```

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 10 minutes)
- Password hashing with bcrypt
- JWT token expiration
- Role-based access control
- Input validation with express-validator

## Database Models

- **User** - name, email, password, role, phone, profilePicture
- **Property** - title, description, price, location, bedrooms, bathrooms, sqft, images, amenities, status, seller
- **Inquiry** - property, buyer, seller, message, status
- **Visit** - property, buyer, visitDate, visitTime, status
- **Favorite** - user, property

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Express-validator for input validation
- Helmet for security
- CORS enabled

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Success Response Format

```json
{
  "success": true,
  "data": {}
}
```

## License

ISC
