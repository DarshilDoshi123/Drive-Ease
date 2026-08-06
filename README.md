# Drive Ease - Car Rental Management System

Drive Ease is a comprehensive MERN stack web application tailored for car rental management. It encompasses end-to-end functionality including user authentication, car listings, booking management, reviews, and admin management.

## Live Links & Repository

- **Frontend Application (Vercel):** [https://drive-ease-car-rental.vercel.app/](https://drive-ease-car-rental.vercel.app/)
- **Backend API Service (Render):** [https://drive-ease-miul.onrender.com](https://drive-ease-miul.onrender.com)
- **GitHub Repository:** [https://github.com/DarshilDoshi123/Drive-Ease](https://github.com/DarshilDoshi123/Drive-Ease)

## Project Architecture

```
Drive Ease/
├── backend/
│   ├── config/             # Database & third-party integrations (Cloudinary, etc.)
│   ├── middleware/         # Express auth and upload middlewares
│   ├── models/             # Mongoose schemas (Car, Booking, User, Review, Listing)
│   ├── routes/             # Express API endpoints
│   ├── utils/              # Helper utilities
│   ├── .env                # Backend environment configuration
│   ├── db.js               # MongoDB connection setup
│   ├── netlify.toml        # Netlify deployment configuration
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Express app entry point
└── frontend/
    ├── public/             # Public static assets & index.html
    ├── src/                # React components, pages, Redux store & API services
    ├── .env                # Frontend environment configuration
    └── package.json        # Frontend dependencies & scripts
```

## Quick Start

### 1. Install Dependencies

You can install dependencies for both services from the root folder:

```bash
npm run install:all
```

Or navigate to each folder directly:

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Create `.env` inside the `backend/` directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://drive-ease-car-rental.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create `.env` inside the `frontend/` directory:

```env
REACT_APP_API_URL=https://drive-ease-miul.onrender.com
```

### 3. Run Development Servers

From the root directory:

```bash
# Start backend server (Port 5000)
npm run dev:backend

# Start frontend application (Port 3000)
npm run dev:frontend
```

Alternatively:
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm start`

Open [http://localhost:3000](http://localhost:3000) in your browser to start using Drive Ease.
