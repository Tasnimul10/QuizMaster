# QuizMaster Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application designed for interactive learning. 

## 🚀 Features

- **Role-based Authentication**: Secure JWT-based login supporting `Student`, `Teacher`, and `Admin` roles.
- **Teacher Dashboard**: Create, manage, and monetize quizzes. Track student attempts and average scores.
- **Student Dashboard**: Browse available quizzes, take free quizzes, or perform a mock-purchase of paid quizzes. Review answers and explanations instantly.
- **Admin Dashboard**: High-level platform statistics and directories of all registered students and teachers.
- **Premium Design System**: Fully custom CSS styling featuring responsive layouts, glassmorphism UI elements, and sleek micro-animations.

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router DOM, Axios, Custom CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose.
- **Security**: bcryptjs (password hashing), jsonwebtoken (JWT).

## 🏃‍♂️ How to Run Locally

You will need two separate terminal windows to run both the frontend and the backend.

### 1. Start the Backend Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Ensure you have a `.env` file in the `backend/` folder containing your `MONGO_URI` and `JWT_SECRET`.
4. Start the server:
   ```bash
   node server.js
   ```
   *The backend will run on `http://localhost:5001`.*

### 2. Start the Frontend React App

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The website will automatically open in your browser at `http://localhost:3000`.*

---

## 💡 Testing Guide

To fully test the application flows:

1. **Teacher Flow**: 
   - Register a new account and click "I am a Teacher".
   - From your dashboard, click "+ Create New Quiz". Build a quiz (add a price if you want it to be paid).
2. **Student Flow**: 
   - Log out, and register a new account as a "Student".
   - Browse the dashboard, find the quiz you just created, and either "Take Quiz" (if free) or "Buy Access" (if paid).
   - Complete the quiz to see your final score and the detailed explanations!
3. **Admin Flow**:
   - Register a user directly to the database with the `role` set to `admin`, or login with any pre-configured admin account to view the platform directories.
