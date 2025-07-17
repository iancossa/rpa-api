
# 🚀 90-Day RPA Backend API Challenge (Microservices Edition)

## 🧠 Goal
Rebuild the RPA backend using Node.js microservices to coordinate Python automation tasks. Achieve clean service separation, secure communication, and production readiness in 90 days.

---

## 🔧 System Architecture Summary
- **API Gateway (Node.js + Express)**: Handles routing, auth, and communication.
- **Microservices**: 
  - `auth-service` (Node.js)
  - `user-service` (Node.js)
  - `task-service` (Node.js)
  - `automation-service` (Python)
- **Message Queue (Optional Advanced)**: RabbitMQ or Redis for async task delegation.
- **Database**: MongoDB per service or shared.
- **Docs**: Swagger/OpenAPI.
- **Deployment**: Docker + Docker Compose + GitHub Actions (optional CI/CD).

---

## 📅 90-Day Plan Overview

### 🚀 Phase 1: Microservices Setup & Core Foundations (Days 1–30)

#### Week 1: Plan & Scaffold (Monolith to Micro)
- [ ] Finalize domain & microservices split
- [ ] Set up base project structure (Nx, Lerna, or folders)
- [ ] Dockerize each service

#### Week 2: Auth Service
- [ ] JWT sign-up/login
- [ ] Role-based auth (`admin`, `user`)
- [ ] Password hashing (bcrypt)
- [ ] Email verification
- [ ] Swagger setup

#### Week 3: User Service
- [ ] User profile CRUD
- [ ] Avatar upload (Multer/cloud)
- [ ] Centralized error handling
- [ ] Internal token verification

#### Week 4: Inter-service Communication (Sync)
- [ ] Internal REST communication
- [ ] Use Axios with shared middleware
- [ ] Mock automation-service connection

---

### 🔐 Phase 2: Task Logic, Messaging, Automation Link (Days 31–60)

#### Week 5: Task Service
- [ ] Create Task Schema
- [ ] Assign tasks to users
- [ ] Track status

#### Week 6: Message Queue Setup
- [ ] Install RabbitMQ or Redis
- [ ] Producer/consumer model
- [ ] Log task-service ↔ automation-service

#### Week 7: Automation Service (Python)
- [ ] Flask or FastAPI setup
- [ ] Accept task execution requests
- [ ] Return `output`, `logs`, `status`

#### Week 8: Async Task Handling
- [ ] Trigger async task
- [ ] Save logs/results
- [ ] Retry mechanism (advanced)

---

### 📦 Phase 3: Production Readiness & DevOps (Days 61–90)

#### Week 9: Logging, Monitoring & Testing
- [ ] Central logger (Winston or Pino)
- [ ] Health check endpoints
- [ ] Unit & integration tests

#### Week 10: API Gateway & Service Registry
- [ ] Express API gateway
- [ ] Reverse proxy (Nginx)
- [ ] API versioning

#### Week 11: Documentation & Security
- [ ] Swagger or Redoc docs
- [ ] Secure env vars
- [ ] Rate limiting, helmet, CORS

#### Week 12: CI/CD + Deployment
- [ ] Docker Compose all services
- [ ] GitHub Actions setup
- [ ] Deploy to Render / Railway / Fly.io / EC2

---

## ✅ Final Deliverables
- 🧩 Modular microservices
- 🔐 Secure inter-service auth
- 🤖 Python automation integration
- 📜 Swagger API docs
- 📦 Dockerized, ready to deploy
