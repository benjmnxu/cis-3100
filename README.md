# Kitchen Scout 🍳

**Kitchen Scout** is a full-stack web application that helps users find, save, and manage recipes. Built for the CSCI3100 Software Engineering course, the project features user authentication, image uploads, and search functionality.

## 🧱 Project Structure

```
project-root/
├── client/       # React frontend
├── server/       # Node.js backend
├── README.md     # You're here
└── package.json  # Optional root-level script config
```

## 🔧 Technologies Used

### Frontend:
- React.js
- React Router
- Axios
- Tailwind CSS (optional styling)

### Backend:
- Node.js
- Express.js
- Multer (image uploads)
- bcrypt + JWT (authentication)

### Database:
- PostgreSQL (relational database)
- Knex.js (query builder)

## ✨ Features

- 🔍 **Recipe Search** — Search for recipes by keyword
- 📋 **Recipe Details** — View full instructions, ingredients, and metadata
- 🖼️ **Image Uploads** — Upload and associate images with saved recipes
- 💾 **Favorites** — Save recipes to your personal dashboard
- 🔐 **User Accounts** — Register and log in with secure JWT-based sessions

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/benjmnxu/cis-3100.git
cd cis-3100
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Setup environment variables

Create a `.env` file in the `/server` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://username:password@localhost:5432/kitchen_scout
```

### 4. Run the application

```bash
# In one terminal window
cd server
npm run dev

# In another terminal window
cd client
npm start
```

Frontend will run at `http://localhost:3000`, and backend at `http://localhost:8000`.

## 👥 Team Members

- Benjamin Xu (1155240657)
- Juan Carlos Girón (1155240637)
- Gai Sze Lun (1155214162)

## 📂 Folder Overview

### `/client`

- `src/pages/` — Page views like Home, Login, Dashboard
- `src/components/` — UI components (RecipeCard, SearchBar, ImageUploader)
- `src/context/` — Auth context
- `src/api/` — Axios instance config

### `/server`

- `controllers/` — Logic for users, recipes, images
- `routes/` — RESTful endpoints
- `middleware/` — JWT, error handler, multer
- `models/` — Placeholder for DB logic (can use Knex or raw queries)
- `uploads/` — Stores uploaded image files temporarily

## 🛡 Security Notes

- Passwords are hashed with bcrypt
- Sessions use JWT stored in HTTP-only cookies
- API routes protected with middleware

## 🧠 Future Improvements

- OAuth login (Google, GitHub)
- Search filters (cuisine, cook time, difficulty)
- Favorites sorting and tagging
- Deployment on Heroku (backend) and Vercel/Netlify (frontend)
