# 🍽️ Plateful — Food Ordering API

> A MERN-ready REST API for authentication, menu browsing, per-user carts, and customer order history.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🔐 User registration and JWT authentication
- 🍛 Available food menu with category and text search
- 🛒 Persistent, authenticated carts stored per user
- 📦 Order creation and order history
- ✅ Request validation with clear API errors
- 🛡️ Helmet security headers, CORS, and rate limiting
- 📝 Development request logging with Morgan
- 🌱 Database seeding with sample menu items
- 🔌 Configurable MongoDB, client URL, and JWT settings

## 🧰 Tech Stack

| Technology | Purpose |
| --- | --- |
| Node.js 18+ | JavaScript runtime |
| Express 5 | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Helmet | HTTP security headers |
| CORS | Frontend API access |

## 📁 Project Structure

```text
src/
├── config/
│   └── db.js
├── middleware/
│   ├── auth.js
│   ├── error.js
│   └── validate.js
├── models/
│   ├── Food.js
│   ├── Order.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── cart.js
│   ├── foods.js
│   └── orders.js
├── utils/
│   └── asyncHandler.js
├── app.js
├── seed.js
└── server.js
```

## ✅ Prerequisites

Before you begin, make sure you have:

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- The Plateful frontend running locally or deployed

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mern-food-backend.git
cd mern-food-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Copy `.env.example` to `.env` and update the values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/food_ordering
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string. Never commit `.env`; it is ignored by Git.

### 4. Seed sample menu data

```bash
npm run seed
```

This clears and recreates the sample food collection. Use it only when you are comfortable replacing existing seeded food data.

### 5. Start the API

Development mode with automatic restart:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API runs at `http://localhost:5000` by default.

## 🔌 API Reference

### Health and root

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/` | No | API status message |
| GET | `/api/health` | No | Health check |

### Authentication

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Sign in and receive a JWT |
| GET | `/api/auth/me` | Bearer token | Get the current user |

Register request:

```json
{
	"name": "Alex Morgan",
	"email": "alex@example.com",
	"password": "secret123"
}
```

Login request:

```json
{
	"email": "alex@example.com",
	"password": "secret123"
}
```

Successful authentication responses include a `token`. Send it with protected requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Foods

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/foods` | No | List available foods |
| GET | `/api/foods?category=Burgers&search=cheese` | No | Filter and search foods |
| GET | `/api/foods/:id` | No | Get one available food |

### Cart

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/cart` | Bearer token | Get the current user's cart |
| POST | `/api/cart` | Bearer token | Add or update a food quantity |
| DELETE | `/api/cart/:foodId` | Bearer token | Remove one food |
| DELETE | `/api/cart` | Bearer token | Clear the cart |

Cart update request:

```json
{
	"foodId": "MONGODB_FOOD_ID",
	"quantity": 2
}
```

### Orders

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/orders` | Bearer token | Create an order from the user's cart |
| GET | `/api/orders` | Bearer token | List the user's orders |
| GET | `/api/orders/:id` | Bearer token | Get one of the user's orders |

Order request:

```json
{
	"deliveryAddress": {
		"line1": "123 Market Street",
		"city": "Mumbai",
		"postalCode": "400001"
	}
}
```

Orders are created from the authenticated user's saved cart. After a successful order, the cart is cleared.

## 🧪 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |
| `npm run seed` | Replace food data with sample menu items |
| `npm run check` | Check server JavaScript syntax |

## 🔗 Frontend Integration

The Plateful frontend uses this API by setting the following value in `mern-food-frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start both applications in separate terminals:

```bash
# Terminal 1
cd mern-food-backend
npm run dev

# Terminal 2
cd mern-food-frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🌐 Publishing on GitHub

From this backend directory:

```bash
git add .
git commit -m "Update backend documentation"
git push
```

The repository ignores `.env`, `node_modules`, and npm debug logs. Confirm that secrets are not staged before pushing:

```bash
git status
git ls-files
```

Commit `.env.example`, but never commit `.env`.

## 📄 License

This project is available under the MIT License.
