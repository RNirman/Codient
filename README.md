# Codient - Online Code Judge Platform

Codient is a robust, multi-language competitive programming environment that allows users to write, submit, and execute code safely in isolated containers while featuring real-time feedback and leaderboards.

## Features

- **Multi-language Support:** Execute code in C++, Java, and JavaScript.
- **Secure Code Execution:** Isolated Docker-based execution engine using `dockerode` to safely run untrusted code.
- **Real-time Leaderboards & Updates:** Live updates on submissions and leaderboards via WebSockets (`Socket.io`).
- **Asynchronous Processing:** Background job management for efficient code evaluation using `BullMQ` and Redis.
- **Rich User Interface:** Modern, responsive frontend built with React, Vite, and Tailwind CSS, featuring an integrated Monaco Code Editor for a seamless coding experience.
- **Markdown Support:** Problem descriptions rendered using Markdown.

## Tech Stack

### Frontend
- **Framework:** React, Vite
- **Styling:** Tailwind CSS
- **Code Editor:** Monaco Editor
- **Real-time:** Socket.io-client
- **Routing:** React Router DOM
- **Markdown:** React Markdown, EasyMDE

### Backend
- **Server:** Node.js, Express
- **Database:** PostgreSQL with Prisma ORM
- **Queue & Background Jobs:** Redis, BullMQ
- **Containerization Engine:** Docker (managed via Dockerode)
- **Real-time Communication:** Socket.io
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher)
- **PostgreSQL**
- **Redis**
- **Docker** (must be running for the code execution engine to work)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Codient
   ```

2. **Setup Backend:**
   ```bash
   cd codient-backend
   npm install
   ```
   - Create a `.env` file in the `codient-backend` directory based on your setup:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/codient?schema=public"
     REDIS_URL="redis://localhost:6379"
     JWT_SECRET="your_jwt_secret"
     PORT=5000
     ```
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup Frontend:**
   ```bash
   cd ../codient-frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## Architecture Overview

- When a user submits code via the frontend, the backend creates a job and places it onto a Redis queue managed by BullMQ.
- Worker processes pick up the jobs, spin up isolated Docker containers for the respective language (C++, Java, or JS), execute the user's code against hidden test cases, and return the output.
- The results are saved to the PostgreSQL database via Prisma and broadcasted back to the frontend in real-time via Socket.io.

## License

This project is licensed under the ISC License.
