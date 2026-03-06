# UNISALE Backend

Production-ready backend for the UNISALE student marketplace (buy/sell platform similar to OLX).

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary image uploads
- Swagger (OpenAPI)
- dotenv, cookie-parser, cors

## Project Structure

```text
backend/
+ src/
¦  + controllers/
¦  ¦  + user.controller.js
¦  ¦  + product.controller.js
¦  + models/
¦  ¦  + user.model.js
¦  ¦  + product.model.js
¦  + routes/
¦  ¦  + user.routes.js
¦  ¦  + product.routes.js
¦  + middleware/
¦  ¦  + auth.middleware.js
¦  ¦  + error.middleware.js
¦  ¦  + validation.middleware.js
¦  ¦  + upload.middleware.js
¦  + services/
¦  ¦  + user.service.js
¦  ¦  + product.service.js
¦  + utils/
¦  ¦  + apiError.js
¦  ¦  + asyncHandler.js
¦  ¦  + cloudinary.js
¦  + docs/
¦  ¦  + swagger.js
¦  + db/
¦  ¦  + db.js
¦  + app.js
+ postman/
¦  + UNISALE.postman_collection.json
+ .env.example
+ .gitignore
+ package.json
+ README.md
+ server.js
```

## Environment Variables

Copy `.env.example` to `.env` and set values:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `JWT_EXPIRES_IN` (default: `7d`)
- `CLIENT_URL` (default: `http://localhost:5173`)
- `API_BASE_URL` (used by Swagger server URL)
- `NODE_ENV` (default: `development`)

## Setup and Run

```bash
cd backend
npm install
npm run dev
```

Production start:

```bash
npm start
```

## API Endpoints

### User Authentication

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/profile` (protected)

### Product APIs

- `POST /api/products` (protected, multipart/form-data)
- `GET /api/products`
- `GET /api/products/:id`
- `DELETE /api/products/:id` (protected, only seller can delete)

## Swagger Documentation

- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/docs.json`

## Notes

- JWT token is returned in response and set as an HTTP-only cookie (`token`).
- Protected routes accept token from cookie or `Authorization: Bearer <token>` header.
- Product and avatar images are uploaded to Cloudinary and stored in MongoDB.
- Error handling, request validation, and modular service/controller architecture are included.

## Postman

Import the sample collection from:

- `postman/UNISALE.postman_collection.json`
