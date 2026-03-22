# Movie Review Application

A full-stack web application that allows users to browse movies, view details, search for specific titles, and write reviews. The project features a robust authentication system with role-based access control.

## 🚀 Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling UI**: React Bootstrap, FontAwesome
- **Data Fetching**: Axios
- **Components**: React Multi Carousel

### Backend (Server)
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Middleware**: CORS, Custom Auth Middleware

## ✨ Features
- **User Authentication**: Secure Login and Registration with JWT.
- **Role-based Access**: Differentiates between regular `User` and `Admin`.
- **Movie Catalog**: Display a list of movies fetching from the backend database.
- **Movie Details**: View detailed information including posters, trailers, backdrop, and cast/crew members.
- **Reviews & Ratings**: Logged-in users can write reviews for movies. 
- **Search Functionality**: Search movies by title.

## 🛠️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie-review
   ```

2. Setup the Server:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. Setup the Client:
   ```bash
   cd ../client
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure
- `/client`: React application (Frontend)
- `/server`: Node/Express application (Backend)
  - `/models`: Database schemas (Movie, Review, User)
  - `/routes`: API endpoints (movies, reviews, auth)
  - `/controllers`: Request handling logic
  - `/middleware`: Custom middleware (e.g., authentication)
