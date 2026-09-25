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
