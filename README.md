# Student Management API — Automated Testing & CI/CD Pipeline

A RESTful Student Management API built with Node.js, Express, and MySQL — wrapped in a fully automated testing and deployment pipeline using Postman, Newman, Docker, and GitHub Actions.

> The "student management" part is intentionally simple. The actual focus of this project is the DevOps pipeline around it — automated testing, containerization, and CI/CD — which generalizes to any backend application, not just this one.

## What this project demonstrates

- A working REST API with full CRUD operations and authentication
- Automated API testing (Postman + Newman) instead of manual, click-through testing
- Containerization with Docker and Docker Compose
- A CI/CD pipeline (GitHub Actions) that automatically builds, tests, and blocks deployment on failure
- A verified break/fix cycle proving the pipeline actually catches bad code

## Architecture

```
Developer
   |  git push
   v
GitHub
   |
   v
GitHub Actions (CI)
   |
   +--> Checkout code
   +--> Install dependencies
   +--> Start MySQL service container
   +--> Create table + seed data
   +--> Start Express server
   +--> Run Postman collection via Newman
   |
   v
   PASS -> pipeline succeeds (safe to deploy)
   FAIL -> pipeline stops here (nothing broken ships)
```

**Request flow (application layer):**

```
Client (Postman / curl)
   -> Express route
   -> Controller logic (validation)
   -> MySQL (parameterized query)
   -> JSON response
```

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MySQL |
| API Testing | Postman, Newman (CLI) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Version Control | Git, GitHub |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Authenticate with username/password |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get a single student |
| POST | `/api/students` | Create a new student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## Project structure

```
student-api-devops/
├── src/
│   ├── server.js              # Express app entry point
│   ├── db.js                  # MySQL connection
│   └── routes/
│       ├── studentRoutes.js   # CRUD endpoints
│       └── authRoutes.js      # Login endpoint
├── postman/
│   └── Student_API_Collection.json   # Postman collection with automated tests
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Running locally

**1. Clone and install:**
```bash
git clone https://github.com/Shravani-jinjore/student-api-devops.git
cd student-api-devops
npm install
```

**2. Set up environment variables:**
```bash
cp .env.example .env
# then edit .env with your MySQL credentials
```

**3. Create the database:**
```sql
CREATE DATABASE student_management;
USE student_management;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    branch VARCHAR(50),
    year INT
);
```

**4. Start the server:**
```bash
cd src
node server.js
```

The API will be running at `http://localhost:3000`.

## Running with Docker

```bash
docker compose up
```

This starts both the API and a MySQL container together, with health checks ensuring the API only starts once the database is ready.

## Running the automated tests

**Via Postman:** Import `postman/Student_API_Collection.json` and run the collection.

**Via terminal (Newman):**
```bash
npm install -g newman
newman run postman/Student_API_Collection.json
```

Example output:
```
Student Management API

→ Get Students
  ✓ Status code is 200
  ✓ Response is an array
  ✓ Each student has required fields

→ Create Student
  ✓ Status code is 201
  ✓ Response contains new student with id

...

┌─────────────────────────┬──────────┬──────────┐
│              assertions │       13 │        0 │
└─────────────────────────┴──────────┴──────────┘
```

## CI/CD Pipeline

Every push to `main` automatically triggers a GitHub Actions workflow that:

1. Spins up a fresh Ubuntu runner
2. Installs Node.js and project dependencies
3. Starts a MySQL service container with a health check
4. Seeds the database with the schema and sample data
5. Starts the Express server
6. Runs the full Postman test suite via Newman
7. **Fails the pipeline if any test fails** — preventing broken code from being considered deployable

### Proof it actually works

This pipeline was deliberately tested against failure: a bug was introduced (an incorrect HTTP status code on student creation), which caused the pipeline to fail as expected. After reverting the bug, the pipeline passed again — confirming the tests genuinely catch regressions rather than always passing by default.

## Key design decisions

- **Parameterized SQL queries** are used throughout to prevent SQL injection.
- **Environment variables** (`.env`) keep database credentials out of source control; `.gitignore` explicitly excludes `.env`.
- **Dynamic test data** (`{{$randomInt}}`, collection variables) is used in the Postman tests so the suite is repeatable — it doesn't rely on hardcoded IDs or emails that would collide on repeated runs.
- **Docker health checks** solve a real container startup-ordering problem: the API container waits for MySQL to report healthy before attempting to connect, rather than assuming a fixed delay.

## Possible future improvements

- Deploy the API to a live cloud host (e.g., Render/Railway) for a public demo URL
- Add a related resource (e.g., `Courses`) to demonstrate relational data handling
- Replace hardcoded login credentials with a proper users table and hashed passwords
- Add more granular error messages for common failure cases (e.g., duplicate email)

## Author

Shravani Jinjore
