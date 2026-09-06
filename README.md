# Food Ordering API

A small MERN-ready REST API for authentication, menu browsing, carts, and customer order history.

## Run locally

1. Install Node.js 18+ and MongoDB, then start MongoDB locally.
2. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
3. Install dependencies with `npm install`.
4. Add sample menu items with `npm run seed`.
5. Start the API with `npm run dev`.

The API is available at `http://localhost:5000`. A hosted MongoDB connection string can be used in `MONGO_URI` instead of a local database.

## Endpoints

- `GET /api/health`
- `POST /api/auth/register` with `{ name, email, password }`
- `POST /api/auth/login` with `{ email, password }`
- `GET /api/auth/me` (Bearer token)
- `GET /api/foods?category=Burgers&search=cheese`
- `GET /api/foods/:id`
- `GET /api/cart` (Bearer token)
- `POST /api/cart` with `{ foodId, quantity }` (Bearer token)
- `DELETE /api/cart/:foodId` (Bearer token)
- `DELETE /api/cart` (Bearer token)
- `POST /api/orders` with `{ deliveryAddress: { line1, city, postalCode } }` (Bearer token)
- `GET /api/orders` (Bearer token)
- `GET /api/orders/:id` (Bearer token)

Successful auth responses include a JWT in `token`. Send it on private requests as `Authorization: Bearer <token>`.
