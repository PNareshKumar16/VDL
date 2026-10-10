# 🛠️ Virtual Debugging Lab

> **Interactive Educational Sandbox with Socratic AI Mentor**

Virtual Debugging Lab is a full-stack educational platform built with **Spring Boot 3.2+** and **React 18 (Vite)**. The platform enables computer science students to debug broken codebases across multiple fault categories (Logical, Concurrency, Memory Leaks, Null References, Off-by-One errors) and receive 3-tier Socratic debugging hints powered by AI.

---

## 🌟 Key Features

- ⚡ **Interactive IDE Sandbox**: Monaco Code Editor (`@monaco-editor/react`) integration with language detection, dark theme, and keyboard shortcuts.
- 🤖 **3-Tier Socratic AI Debugging Mentor**:
  - **Level 1 (Nudge)**: Points to the line or general logic section without technical solution (Free / 0 PTS).
  - **Level 2 (Diagnostic)**: Explains *why* the failure or exception occurs conceptually (-5 PTS).
  - **Level 3 (Actionable)**: Suggests a code pattern or conditional guard syntax to fix the issue (-10 PTS).
- ⚙️ **Automated Sandbox Execution Engine**: Runs test cases, computes execution metrics (ms), generates colored stack traces, and validates fixes.
- 🎯 **Gamified Learning**: Earn points for solving challenges, track streaks, and view submission history.
- 🛡️ **Role-Based Access Control**: Stateless JWT Authentication for Students and Admins. Admin users can author and publish custom challenges directly from the UI.
- ☁️ **Cloud Database & DevOps Ready**: Configured for Cloud MySQL (Aiven MySQL compatible), Docker, Docker Compose, and Vercel SPA deployment.

---

## 🏗️ Tech Stack & Architecture

### Backend (Spring Boot):
- **Framework**: Spring Boot 3.2.4 (Java 17+)
- **Security**: Spring Security + Stateless JWT Authentication & BCrypt Password Encoder
- **Persistence**: Spring Data JPA with Cloud MySQL / H2 fallback
- **DTO Validation**: Bean Validation (`@Valid`)
- **Package Structure**: `com.virtualdebugginglab.*`

### Frontend (React + Vite):
- **Core**: React 18, Vite SPA Architecture
- **Styling**: Tailwind CSS + Glassmorphism Cyber Theme
- **Icons**: Lucide React (`lucide-react`)
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **HTTP Client**: Axios with JWT Bearer Interceptors

---

## 🚀 Quick Start Guide

### Prerequisites:
- **Java 17+**
- **Node.js 18+** & `npm`

---

### 1. Running the Backend (Spring Boot)

Navigate to the `backend` folder and run the Maven wrapper:

```bash
cd backend
mvnw.cmd spring-boot:run
```

> **Note**: The backend uses an in-memory H2 database by default if `DB_URL` is omitted. Set `JWT_SECRET` in your environment before starting the backend. To connect to Cloud MySQL (Aiven MySQL), also set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.

---

### 2. Running the Frontend (React Vite)

Navigate to the `frontend` folder and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The frontend web app will open at `http://localhost:5173`.

---

## 🔐 Seed User Credentials

Upon startup, `DataInitializer.java` automatically seeds sample accounts:

| Username | Password | Role | Purpose |
| :--- | :--- | :--- | :--- |
| `student` | `password123` | `STUDENT` | General student account for solving challenges |
| `admin` | `admin123` | `ADMIN` | Administrator account with challenge authoring capabilities |

*You can also click **"Quick Demo Login"** on the Sign In page for one-click login!*

---

## 📡 API Reference

### Auth Endpoints:
- `POST /api/auth/register` — Register a new student or admin account
- `POST /api/auth/login` — Login & issue JWT token
- `GET /api/auth/me` — Fetch currently authenticated user profile

### Challenge Endpoints:
- `GET /api/challenges` — List challenges (optional filters: `language`, `difficulty`, `bugType`)
- `GET /api/challenges/{id}` — Get challenge details (*excludes solution code for regular students*)
- `POST /api/challenges` — Create new challenge (Admin only)

### Execution & Submission Endpoints:
- `POST /api/submissions/run` — Run tests without saving score
- `POST /api/submissions/submit` — Final evaluation & score recording
- `GET /api/submissions/user` — Get user submission history
- `GET /api/submissions/challenge/{challengeId}` — Get challenge submission history

### AI Debugger Endpoints:
- `POST /api/ai/hint` — Generate Socratic hint (Level 1, 2, or 3)

---

## 🐳 Docker Deployment

Set `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, and `JWT_SECRET` in your local `.env` file before starting the stack. Do not commit `.env`.

```bash
docker-compose up --build
```

---

## 📄 License
MIT License. Built for educational and interactive software engineering labs.
