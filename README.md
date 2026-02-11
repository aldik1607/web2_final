# Freddie Coffee Shop API

REST API for a coffee shop built with Node.js, Express, and MongoDB.

## Project Overview

A backend API for managing a coffee shop with:
- User authentication (JWT)
- Role-based access control (RBAC)
- Product management (CRUD)
- Email notifications

## Project Structure

```
web2_final/
├── config/
│   └── db.js                  # Database connection
├── controllers/
│   ├── authController.js      # Register & login logic
│   ├── userController.js      # Profile management
│   └── productController.js   # Product CRUD logic
├── middleware/
│   ├── auth.js                # JWT & role verification
│   └── validate.js            # Input validation
├── models/
│   ├── User.js                # User schema
│   └── Product.js             # Product schema
├── routes/
│   ├── auth.js                # Auth endpoints
│   ├── users.js               # User endpoints
│   └── products.js            # Product endpoints
├── services/
│   └── emailService.js        # SMTP email service
├── .env                       # Environment variables
├── seed.js                    # Database seeder
└── server.js                  # Entry point
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create `.env` file:
   ```
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/coffeeshop
   JWT_SECRET=your-secret-key
   
   # Optional: SMTP for emails
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-api-key
   ```

3. **Start MongoDB**

4. **Seed database (optional)**
   ```bash
   npm run seed
   ```

5. **Run server**
   ```bash
   npm run dev
   ```

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coffee.com | admin123 |
| Moderator | mod@coffee.com | mod123 |
| Premium | premium@coffee.com | premium123 |
| User | user@coffee.com | user123 |

## API Documentation

Base URL: `http://localhost:3000/api`

### Authentication (Public)

#### POST /auth/register
Register a new user.
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": { "id": "...", "username": "john", "email": "john@example.com", "role": "user" }
}
```

#### POST /auth/login
Login user.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `200 OK`
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { "id": "...", "username": "john", "email": "john@example.com", "role": "user" }
}
```

### User Management (Private)

**Header required:** `Authorization: Bearer <token>`

#### GET /users/profile
Get logged-in user's profile.

Response: `200 OK`
```json
{
  "user": { "_id": "...", "username": "john", "email": "john@example.com", "role": "user" }
}
```

#### PUT /users/profile
Update profile.
```json
{
  "username": "john_updated",
  "email": "john_new@example.com"
}
```

### Products (Second Collection)

#### GET /products (Public)
Get all available products.

Response: `200 OK`
```json
{
  "count": 6,
  "products": [
    { "_id": "...", "name": "Espresso", "description": "Strong black coffee", "price": 2.99, "category": "coffee" }
  ]
}
```

#### GET /products/:id (Public)
Get single product.

#### POST /products (Admin only)
Create new product.
```json
{
  "name": "Mocha",
  "description": "Coffee with chocolate",
  "price": 4.99,
  "category": "coffee"
}
```

#### PUT /products/:id (Admin only)
Update product.

#### DELETE /products/:id (Admin only)
Delete product.

## Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| user | View products, manage own profile |
| premium | Same as user (can add premium features) |
| moderator | Same as user (can add moderation features) |
| admin | Full access - create/update/delete products |

## Error Handling

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / Validation error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not enough permissions) |
| 404 | Not found |
| 500 | Server error |

Example error response:
```json
{
  "message": "Validation failed",
  "errors": ["Username must be at least 3 characters"]
}
```

## Screenshots

### 1. Register User
![Register](screenshots/register.png)
*New user registration with validation*

### 2. Login
![Login](screenshots/login.png)
*User login returning JWT token*

### 3. Get Products
![Products](screenshots/products.png)
*List of all available products*

### 4. Create Product (Admin)
![Create](screenshots/create-product.png)
*Admin creating a new product*

### 5. User Profile
![Profile](screenshots/profile.png)
*User viewing their profile*

## Deployment

1. Push code to GitHub
2. Create account on Render/Railway
3. Connect GitHub repository
4. Set environment variables:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Deploy

## Technologies

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Nodemailer
- CORS

---

Made with Express + MongoDB
