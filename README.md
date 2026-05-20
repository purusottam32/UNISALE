# UNISALE

UNISALE is a MERN-based marketplace where college students can buy and sell used products such as books, electronics, notes, and furniture.

## Overview

UNISALE solves a common campus problem: students need a trusted and simple way to sell items they no longer use and buy affordable second-hand items from peers.

The project includes:

- A React frontend with protected routes, marketplace browsing, wishlist, and chat UI.
- A Node.js + Express backend with JWT auth, product APIs, image uploads, and MongoDB persistence.

## Tech Stack

### Frontend

- React 19
- Vite 7
- TailwindCSS 4
- React Router DOM
- Axios
- TanStack Query (React Query)
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication (Bearer token + HTTP-only cookie support)
- Multer (memory storage)
- Cloudinary (image hosting)
- Swagger (OpenAPI docs)
- dotenv
- cookie-parser
- cors
- morgan

## Project Structure

```text
Unisale/
|-- backend/
|   |-- postman/
|   |   |-- UNISALE.postman_collection.json
|   |-- src/
|   |   |-- controllers/
|   |   |   |-- chat.controller.js
|   |   |   |-- product.controller.js
|   |   |   |-- user.controller.js
|   |   |   `-- wishlist.controller.js
|   |   |-- db/
|   |   |   `-- db.js
|   |   |-- docs/
|   |   |   `-- swagger.js
|   |   |-- middleware/
|   |   |   |-- auth.middleware.js
|   |   |   |-- error.middleware.js
|   |   |   |-- upload.middleware.js
|   |   |   `-- validation.middleware.js
|   |   |-- models/
|   |   |   |-- conversation.model.js
|   |   |   |-- message.model.js
|   |   |   |-- product.model.js
|   |   |   |-- user.model.js
|   |   |   `-- wishlist.model.js
|   |   |-- routes/
|   |   |   |-- chat.routes.js
|   |   |   |-- product.routes.js
|   |   |   |-- user.routes.js
|   |   |   `-- wishlist.routes.js
|   |   |-- services/
|   |   |   |-- chat.service.js
|   |   |   |-- product.service.js
|   |   |   |-- user.service.js
|   |   |   `-- wishlist.service.js
|   |   |-- utils/
|   |   |   |-- apiError.js
|   |   |   |-- asyncHandler.js
|   |   |   `-- cloudinary.js
|   |   `-- app.js
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- public/
|-- src/
|   |-- api/
|   |-- components/
|   |-- context/
|   |-- hooks/
|   |-- layout/
|   |-- lib/
|   |-- Pages/
|   |-- App.jsx
|   `-- main.jsx
|-- package.json
`-- README.md
```

## Features

- User registration, login, logout, and profile with JWT auth.
- Product create, list, details, and seller-only delete.
- Product image upload to Cloudinary.
- Product search by keyword (title, description, category).
- Category-based filtering.
- Pagination for product listing and user products.
- Wishlist add/view/remove.
- Buyer-seller chat with conversation list and messages.
- Profile page with user info, own listings, and wishlist items.
- Protected frontend routes for selling, profile, and chat.
- Swagger UI for API exploration.
- Sample Postman collection for quick API testing.

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as the template.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | Backend port (default used in code: `5000`) |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key used to sign JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `JWT_EXPIRES_IN` | No | JWT expiry, default is `7d` |
| `CLIENT_URL` | No | Allowed frontend origin(s) for CORS, default `http://localhost:5173` |
| `API_BASE_URL` | No | Base URL shown in Swagger server list |
| `NODE_ENV` | No | `development` or `production` |

### Frontend (root)

No required frontend environment variables are currently used for API calls.
The existing root `.env.sample` contains legacy Appwrite keys and is not used by the current code.

The frontend API base URL is hardcoded in `src/api/axios.js`:

```js
baseURL: "http://localhost:5000/api";
```

## Installation

1. Clone the repository.
2. Install frontend dependencies from project root.
3. Install backend dependencies from `backend`.
4. Create `backend/.env` from `backend/.env.example`.
5. Start backend and frontend in separate terminals.

```bash
# 1) clone
git clone <your-repo-url>
cd Unisale

# 2) frontend deps
npm install

# 3) backend deps
cd backend
npm install
```

## API Endpoints

Base URL: `http://localhost:5000`

### Health

- `GET /api/health`

### Users and Auth

- `POST /api/users/register` (multipart/form-data: `name`, `email`, `password`, optional `avatar`)
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/profile` (Protected)
- `GET /api/users/:id/products`

### Products

- `GET /api/products`
- `GET /api/products/search?q=keyword`
- `GET /api/products/:id`
- `POST /api/products` (Protected, multipart/form-data: `title`, `description`, `price`, `category`, `images`)
- `DELETE /api/products/:id` (Protected, seller only)

Supported `GET /api/products` query params:

- `page`, `limit`
- `category`
- `q` or `search`
- `minPrice`, `maxPrice`
- `sortBy` (`createdAt`, `price`, `title`)
- `sortOrder` (`asc`, `desc`)

### Wishlist (Protected)

- `POST /api/wishlist/add` (body: `productId`)
- `GET /api/wishlist`
- `DELETE /api/wishlist/:productId`

### Chat (Protected)

- `POST /api/chat/start` (body: `sellerId`, optional `productId`)
- `GET /api/chat/conversations`
- `GET /api/chat/:conversationId`
- `POST /api/chat/send` (body: `conversationId`, `text`)

### API Documentation

- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/docs.json`
- Postman collection: `backend/postman/UNISALE.postman_collection.json`

## Running the Project Locally

Run backend and frontend in two terminals.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`.

### Terminal 2: Frontend

```bash
cd Unisale
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Deployment

Recommended deployment setup:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
- Image Storage: Cloudinary

Deployment notes:

- Set production values for backend environment variables.
- Set `CLIENT_URL` in backend env to your deployed frontend URL.
- If backend URL changes, update frontend API base URL in `src/api/axios.js`.

## Contribution

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes.
4. Push the branch and open a Pull Request.
5. Include clear descriptions and test steps in the PR.

## License

This project is licensed under the MIT License.


