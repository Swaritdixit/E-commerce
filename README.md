# 🛒 ShopSphere

ShopSphere is a full-stack e-commerce web application built using the MERN stack. It provides a complete shopping experience for customers along with an administrative dashboard for managing products, categories, orders, and users.

## 🚀 Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Product browsing
- Product search
- Category filtering
- Price sorting
- Product details
- Shopping cart
- Quantity management
- Address management
- Checkout
- Order placement
- Order history
- Order details
- Order cancellation
- Product reviews and ratings
- User profile management

### 🛠️ Admin Features

- Admin authentication
- Admin dashboard
- Product management
- Add, update and delete products
- Category management
- Order management
- Update order status
- View customer orders
- Inventory/stock management

### 💳 Payment

- Razorpay payment integration
- Payment verification
- Payment status tracking
- Razorpay webhook support
- Refund handling

### ☁️ Image Management

- Product image uploads using Cloudinary
- Image management when products are updated or deleted

---

## 🏗️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator
- Helmet
- Morgan
- CORS

### Services

- MongoDB Atlas
- Cloudinary
- Razorpay

---

## 📁 Project Structure

```text
ShopSphere/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md

ShopSphere is a full-stack MERN e-commerce platform that allows users to browse and search products, manage carts and addresses, place and track orders, make secure online payments through Razorpay, and leave product reviews. It also includes an admin dashboard for managing products, categories, inventory, and orders.