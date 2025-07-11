# WTG Backend - Developer Setup & API Usage Guide

Welcome! This README is designed for **frontend developers** who want to use the WTG backend API. It includes instructions on setting up the development environment (including MongoDB installation for Linux, Windows, and macOS) and details on how to interact with the backend endpoints.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [MongoDB Installation](#mongodb-installation)
  - [Windows](#windows)
- [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Running the Backend](#running-the-backend)
- [API Overview](#api-overview)
  - [Authentication Routes](#authentication-routes)
  - [Business Routes](#business-routes)
- [Authentication & Tokens](#authentication--tokens)
- [Notes for Frontend Integration](#notes-for-frontend-integration)

---

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Git
- MongoDB (local installation or remote connection)

---

## MongoDB Installation


# Windows
 1. Download MongoDB Community Server from:
    https://www.mongodb.com/try/download/community
 2. Run the installer and follow prompts:
    - Select "Complete" setup
    - Choose to install MongoDB as a Windows service
 3. Start MongoDB service: net start MongoDB


 4. Verify installation by running in Command Prompt or PowerShell: mongo --version


### Backend Setup

# Clone the repository
```bash
git clone 'https://github.com/bilaalk079/WTG-backend.git'
cd WTG-backend
```

# Install dependencies
```bash
npm install
```
## Environment Variables

Create a `.env` file in the project root with your own configuration values. Below is the template; **replace the placeholder values with your own secrets and database URL**:

```env
# Server listening port
PORT=5000

# MongoDB connection string - replace with your own if using remote DB or different local setup
DATABASE_URL=<your-connection-string>

# JWT secret for access tokens - replace with a secure random string
JWT_ACCESS_SECRET=your_jwt_access_secret_here

# Access token expiration time (e.g., 1h, 30m)
JWT_ACCESS_EXPIRES_IN=1h

# JWT secret for refresh tokens - replace with a secure random string
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Refresh token expiration time (e.g., 30d for 30 days)
JWT_REFRESH_EXPIRES_IN=30d
```
## Running the Backend

```bash
npm run dev
```
The backend will run on http://localhost:5000 by default.

## API Overview

### Authentication Routes

| Method | Endpoint           | Description          | Body Params           | Auth Required |
|--------|--------------------|----------------------|-----------------------|---------------|
| POST   | `/api/auth/signup`  | Register new user     | `{ email, password }` | No            |
| POST   | `/api/auth/login`   | User login           | `{ email, password }` | No            |
| POST   | `/api/auth/logout`  | Logout user          | None                  | No            |
| GET    | `/api/auth/refresh` | Refresh access token | None                  | No            |

### Business Routes

| Method | Endpoint              | Description                     | Body / Query Params                   | Auth Required |
|--------|-----------------------|---------------------------------|-------------------------------------|---------------|
| GET    | `/api/business/search` | Search businesses with filters  | Query: `state`, `lga`, `town`, `category` | No            |
| POST   | `/api/business/`      | Create new business             | Business JSON                       | Yes           |
| GET    | `/api/business/me`    | Get current user's business     | None                               | Yes           |
| PUT    | `/api/business/me`    | Update current user's business  | Business update JSON               | Yes           |
| DELETE | `/api/business/me`    | Delete user account & business  | None                               | Yes           |
| GET    | `/api/business/:slug` | Get business profile by slug    | None                               | No            |

## Authentication & Tokens
Authentication is via JWT tokens.

Tokens are sent in the Authorization header as Bearer <token>.

Access tokens expire after 1 hour.

Use /api/auth/refresh to get new access tokens using the refresh token.

Logout clears tokens on the client and server.

## CORS Configuration (`corsOption`)

The backend uses a CORS configuration object to control which frontend origins can access the API. Below is the current setup:

```js
const corsOption = {
    origin: 'http://localost:5173',      // <-- Replace this URL with your frontend application's URL
    methods: 'PUT,DELETE,POST,GET',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Authorization'],
}

export default corsOption
```


### Notes for Frontend Integration
Always send Content-Type: application/json header for POST/PUT requests.

To access protected routes, include JWT access token in the Authorization header.

## Data Format & Usage Notes

### Phone Number Format
- Phone numbers must be **exactly 11 digits** long.
- Ensure your frontend validation enforces this to avoid backend errors.

### Allowed Business Categories
When creating or updating a business, the `categories` field must be an array containing any of the following values:

- Groceries
- Fashion
- Beauty
- Essentials
- Furniture
- Academic
- Gadgets
- Food
- Health

### Business Search Endpoint
- Use the endpoint `/api/business/search` to query businesses.
- You can filter businesses by any combination of the following query parameters:
  - `state`
  - `lga`
  - `town`
  - `category`
Example Login Request
```js
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```
Contact
For questions or issues, please open an issue in the repo or contact the backend team.

Thank you for working with WTG backend! 🚀

