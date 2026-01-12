# Mugodi - Online Grocery Store

A full-featured e-commerce grocery delivery web application built with React, Node.js, Express, and MongoDB.

## Features

### Customer Features
- **User Authentication** - Register, login, JWT-based authentication
- **Product Browsing** - Browse by categories, search, filter, sort
- **Shopping Cart** - Add/remove items, quantity management
- **Wishlist** - Save favorite products
- **Checkout** - Multiple payment methods, address selection
- **Order Management** - Order history, tracking, cancellation
- **Wallet System** - Digital wallet for payments and refunds
- **Loyalty Program** - Earn and redeem points
- **Coupons** - Apply discount codes
- **Profile Management** - Update profile, manage addresses

### Admin Features
- Dashboard with statistics
- User management
- Product management
- Order management
- Coupon management
- Banner management

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Zustand (State Management)
- React Router DOM
- Axios
- Framer Motion
- Lucide React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)
- Express Validator
- Security: Helmet, Rate Limiting, CORS, HPP, XSS Protection

## Project Structure

```
mugodi.com/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── config/            # Database & security config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & security middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utilities & seeders
│   ├── server.js          # Server entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### Setup

1. **Clone/Navigate to the project**
   ```bash
   cd C:\laragon\www\mugodi.com
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**

   Edit `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mugodi
   JWT_SECRET=your_secret_key_change_in_production
   JWT_EXPIRE=7d
   ```

4. **Seed the Database**
   ```bash
   npm run seed
   ```
   This creates sample categories, products, users, banners, and coupons.

5. **Start the Server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

6. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

7. **Start the Client**
   ```bash
   npm run dev
   ```
   Client runs on http://localhost:3000

## Demo Credentials

After seeding the database:

- **Admin User**
  - Email: admin@mugodi.com
  - Password: Admin123!

- **Test User**
  - Email: user@mugodi.com
  - Password: User123!
  - Has: 500 loyalty points, $25 wallet balance

## Available Coupon Codes

- `WELCOME20` - 20% off (new customers, min $30)
- `SAVE10` - $10 off (min $50)
- `FRESH15` - 15% off (min $25)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/daily-needs` - Get daily essentials
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/:id` - Get single product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id/products` - Get products by category

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:id` - Remove item
- `POST /api/cart/apply-coupon` - Apply coupon

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Addresses
- `GET /api/addresses` - Get addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Wallet & Loyalty
- `GET /api/wallet` - Get wallet balance
- `GET /api/wallet/transactions` - Get transactions
- `POST /api/wallet/add-funds` - Add funds
- `GET /api/loyalty` - Get loyalty points
- `POST /api/loyalty/convert` - Convert points to wallet

## Pages

- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/orders` - Order history
- `/orders/:id` - Order details
- `/profile` - User profile
- `/addresses` - Address management
- `/wishlist` - Wishlist
- `/wallet` - Wallet
- `/loyalty` - Loyalty points
- `/coupons` - Available coupons
- `/login` - Login
- `/register` - Register

## License

MIT
