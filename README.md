# 🛒 ShopSphere

A full-stack MERN e-commerce platform with JWT authentication, role-based access control, product management, cart and orders, Razorpay payments, Cloudinary image uploads, reviews, and an admin dashboard.

🔗 **Live Demo:** https://e-commerce-taupe-eta.vercel.app/

---

## ✨ Features

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Browse products
- Product search
- Category filtering
- Price sorting
- Product details
- Product reviews and ratings
- Shopping cart
- Cart quantity management
- Multiple address management
- Checkout and order placement
- Order history
- Order details
- Order cancellation
- User profile management

### 🛡️ Admin Features

- Admin authentication and authorization
- Admin dashboard
- Product CRUD operations
- Category management
- Inventory and stock management
- Customer order management
- Order status updates

### 💳 Payment Features

- Razorpay payment integration
- Razorpay order creation
- Payment signature verification
- Payment status tracking
- Razorpay webhook handling
- Refund initiation

### ☁️ Image Management

- Cloudinary-based product image uploads
- Image replacement when products are updated
- Image deletion when products are removed

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Validation | Express Validator |
| Security | Helmet, CORS, Rate Limiting |
| Payments | Razorpay |
| Image Storage | Cloudinary |
| Deployment | Vercel, MongoDB Atlas |

---

## 📐 System Architecture

```text
                    ┌──────────────────┐
                    │    React + Vite  │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │  Express.js API  │
                    │     Backend      │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ MongoDB  │  │ Razorpay │  │Cloudinary│
        │ Database │  │ Payments │  │  Images  │
        └──────────┘  └──────────┘  └──────────┘
```

---

## 📁 Project Structure

```text
E-commerce/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── pages/
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication & Authorization

The application uses JWT-based authentication and role-based authorization.

```text
                         User
                          │
                 ┌────────┴────────┐
                 │                 │
             Customer            Admin
                 │                 │
        Customer routes      Admin routes
```

The authentication middleware verifies the JWT before allowing access to protected API endpoints.

Role-based authorization restricts administrative operations to users with the appropriate role.

---

## 💳 Payment Flow

The checkout process uses Razorpay for online payments.

```text
Customer
   │
   ▼
Create Order
   │
   ▼
Create Razorpay Order
   │
   ▼
Razorpay Payment
   │
   ▼
Payment Signature Verification
   │
   ▼
Update Payment / Order Status
   │
   ▼
Razorpay Webhook
   │
   ▼
Webhook Signature Verification
   │
   ▼
Confirm Payment Event
```

The backend verifies Razorpay payment signatures using HMAC-SHA256 and validates webhook signatures using the configured Razorpay webhook secret.

---

## 🗄️ Data Models

The backend uses MongoDB with Mongoose.

Main models include:

- `User`
- `Product`
- `Category`
- `Cart`
- `Order`
- `Review`

The models use MongoDB references where relationships between entities are required.

---

## 🔒 Security

The backend includes:

- JWT authentication
- Role-based authorization
- Request validation
- MongoDB ObjectId validation
- Helmet security headers
- CORS configuration
- Rate limiting
- Centralized error handling
- Razorpay payment signature verification
- Razorpay webhook signature verification
- Environment-based secret management

**Never commit `.env` files or API credentials to GitHub.**

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Razorpay account for payment functionality
- Cloudinary account for image storage

### 1. Clone the Repository

```bash
git clone https://github.com/Swaritdixit/E-commerce.git
cd E-commerce
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Configure the required frontend environment variables.

Start the frontend:

```bash
npm run dev
```

The frontend will be available at the local development URL provided by Vite.

---

## 🌐 Deployment

The application uses:

- **Frontend:** Vercel
- **Database:** MongoDB Atlas
- **Image Storage:** Cloudinary
- **Payments:** Razorpay

### Live Application

🔗 **https://e-commerce-taupe-eta.vercel.app/**

---

## 🧩 Key Implementation Areas

### Authentication

JWT tokens are used to authenticate users and protect private API endpoints.

### Role-Based Access Control

The application separates customer and administrative permissions, preventing customers from accessing admin-only operations.

### Product Management

Administrators can create, update, and delete products while managing categories, images, pricing, and stock.

### Cart Management

Customers can add products to their cart, update quantities, and remove products.

### Order Management

Customers can place orders, view order history, view order details, and cancel eligible orders.

Administrators can view customer orders and update order status.

### Reviews

Authenticated users can submit product ratings and reviews.

### Payments

Razorpay is integrated for online payments. The backend performs payment signature verification and processes Razorpay webhook events.

### Image Management

Cloudinary is used to store product images and manage image replacement and deletion when products change.

---

## 📌 Future Improvements

- Automated testing
- Improved product recommendations
- Advanced search and filtering
- Order and sales analytics
- Improved caching
- More granular permissions
- Expanded payment and order workflows

---

## 👨‍💻 Author

**Swarit Dixit**

B.Tech Electronics & Communication Engineering  
IIT Bhilai

- 💻 GitHub: https://github.com/Swaritdixit
- 💼 LinkedIn: https://www.linkedin.com/in/swarit-dixit-b907b8309/
