# RPA-API - Robotic Process Automation System

A comprehensive microservices-based RPA (Robotic Process Automation) system built with Node.js, Python, and MongoDB. The system provides task management, user authentication, automation execution, and real-time notifications through message queues.

## 🏗️ Architecture

The system follows a microservices architecture with the following services:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │   User Service  │    │  Task Service   │
│    (Node.js)    │    │    (Node.js)    │    │    (Node.js)    │
│     Port 5000   │    │     Port 5001   │    │     Port 5002   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
         │ Automation Svc  │    │Notification Svc │    │   Log Service   │
         │    (Python)     │    │    (Node.js)    │    │    (Node.js)    │
         │     Port 5003   │    │     Port 5003   │    │                 │
         └─────────────────┘    └─────────────────┘    └─────────────────┘
                                         │                       │
                                 ┌─────────────────┐    ┌─────────────────┐
                                 │    RabbitMQ     │    │    MongoDB      │
                                 │  Message Queue  │    │    Database     │
                                 └─────────────────┘    └─────────────────┘
```

## 🚀 Services Overview

### 1. Auth Service (Port 5000)
- **Purpose**: User authentication and authorization
- **Technology**: Node.js, Express, JWT
- **Features**:
  - User registration and login
  - JWT token generation and validation
  - Role-based access control (Admin, Manager, User)
  - Email verification
  - Password reset functionality

### 2. User Service (Port 5001)
- **Purpose**: User profile management
- **Technology**: Node.js, Express, MongoDB
- **Features**:
  - User profile CRUD operations
  - File upload handling
  - User data validation
  - Profile picture management

### 3. Task Service (Port 5002)
- **Purpose**: Task management and assignment
- **Technology**: Node.js, Express, MongoDB, RabbitMQ
- **Features**:
  - Task creation and assignment
  - Task status tracking
  - Role-based task operations
  - Real-time notifications via message queue
  - User-specific task filtering

### 4. Automation Service (Port 5003)
- **Purpose**: RPA automation execution
- **Technology**: Python, FastAPI
- **Features**:
  - Automation script execution
  - Process automation workflows
  - Integration with task management

### 5. Notification Service
- **Purpose**: Real-time notifications and messaging
- **Technology**: Node.js, RabbitMQ
- **Features**:
  - Message queue consumption
  - Notification processing
  - Retry logic and dead letter queues
  - Multi-channel notification support

### 6. Log Service
- **Purpose**: Centralized logging and monitoring
- **Technology**: Node.js, RabbitMQ, MongoDB
- **Features**:
  - Centralized log collection
  - Structured log processing
  - Log persistence and querying
  - System monitoring and alerts

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v5.0 or higher)
- **RabbitMQ** (v3.8 or higher)
- **Docker** (optional, for containerized deployment)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/iancossa/rpa-api.git
cd rpa-api
```

### 2. Install Dependencies

#### Root Dependencies
```bash
npm install
```

#### Service-specific Dependencies
```bash
# Auth Service
cd auth-service && npm install && cd ..

# User Service
cd user-service && npm install && cd ..

# Task Service
cd task-service && npm install && cd ..

# Notification Service
cd notification-service && npm install && cd ..

# Log Service
cd log-service && npm install && cd ..

# Automation Service (Python)
cd automation-service && pip install -r requirements.txt && cd ..
```

### 3. Environment Configuration

Create `.env` files in each service directory:

#### Auth Service (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### User Service (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your_jwt_secret_key
```

#### Task Service (.env)
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your_jwt_secret_key
RABBITMQ_URL=amqp://localhost
```

#### Notification Service (.env)
```env
PORT=5003
RABBITMQ_URL=amqp://localhost
```

#### Automation Service (.env)
```env
PORT=5003
```

### 4. Database Setup

#### MongoDB
1. Install MongoDB locally or use MongoDB Atlas
2. Update connection strings in `.env` files
3. Databases will be created automatically on first connection

#### RabbitMQ
1. Install RabbitMQ locally
2. Start RabbitMQ service:
   ```bash
   # Windows
   rabbitmq-server
   
   # Linux/Mac
   sudo systemctl start rabbitmq-server
   ```

## 🚀 Running the Services

### Development Mode (Individual Services)

```bash
# Auth Service
cd auth-service && npm start

# User Service
cd user-service && npm start

# Task Service
cd task-service && npm start

# Notification Service
cd notification-service && npm start

# Log Service
cd log-service && npm start

# Automation Service
cd automation-service && python main.py
```

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

## 📚 API Documentation

### Auth Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | User registration | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/verify-email` | Email verification | No |
| POST | `/auth/forgot-password` | Password reset | No |
| GET | `/admin/users` | Get all users | Admin |

### Task Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tasks` | Create task | Admin/Manager |
| GET | `/tasks` | Get all tasks | Any |
| GET | `/tasks/:id` | Get task by ID | Any |
| GET | `/tasks/my-tasks` | Get user's tasks | JWT |
| PUT | `/tasks/:id/status` | Update task status | JWT (own tasks) |

### User Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | JWT |
| PUT | `/users/profile` | Update profile | JWT |
| POST | `/users/upload` | Upload profile picture | JWT |

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "admin|manager|user",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control

- **Admin**: Full system access
- **Manager**: Task creation and assignment
- **User**: View and update own tasks

### Request Headers
```
Authorization: Bearer <jwt_token>
user-role: admin|manager|user
user-id: <user_id>
```

## 📨 Message Queue System

### Queue Structure

#### Task Notification Queue
```json
{
  "service": "task-service",
  "action": "assign-task",
  "level": "info",
  "message": "Task assigned to user",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "taskId": "...",
    "title": "Task title",
    "assignedTo": "username"
  }
}
```

#### Log Queue
```json
{
  "service": "task-service",
  "action": "log",
  "level": "info|error|warn",
  "message": "Log message",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {}
}
```

### Queue Features
- **Retry Logic**: 3 attempts with exponential backoff
- **Dead Letter Queue**: Failed messages handling
- **Message Persistence**: Durable queues
- **Error Handling**: Graceful failure management

## 🗄️ Database Schema

### User Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String (admin|manager|user),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (pending|in-progress|completed),
  assignedTo: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### API Testing with Postman

#### 1. User Registration
```bash
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```

#### 2. User Login
```bash
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 3. Create Task
```bash
POST http://localhost:5002/tasks
Content-Type: application/json
user-role: admin

{
  "title": "Test Task",
  "description": "Task description",
  "assignedTo": "testuser"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Service port | 5000-5003 |
| `MONGODB_URI` | MongoDB connection | localhost:27017 |
| `JWT_SECRET` | JWT signing key | Required |
| `RABBITMQ_URL` | RabbitMQ connection | amqp://localhost |
| `EMAIL_USER` | SMTP email | Required |
| `EMAIL_PASS` | SMTP password | Required |

### Docker Configuration

The system includes Docker support with:
- Individual Dockerfiles for each service
- Docker Compose for orchestration
- Volume mounting for development
- Environment variable injection

## 🚨 Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 📊 Monitoring & Logging

### Log Levels
- `info` - General information
- `warn` - Warning messages
- `error` - Error conditions
- `debug` - Debug information

### Monitoring Features
- Centralized logging via Log Service
- Message queue monitoring
- Service health checks
- Error tracking and alerting

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes in relevant service
   - Update API documentation
   - Test endpoints

2. **Testing**
   - Unit tests for individual services
   - Integration tests for service communication
   - End-to-end API testing

3. **Deployment**
   - Build Docker images
   - Deploy via Docker Compose
   - Monitor service health
   - Check logs for issues

## 🤝 Contributing

1. Fork the Repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ian Cossa**
- GitHub: [@iancossa](https://github.com/iancossa)
- Email: [Contact via GitHub](https://github.com/iancossa)

## 🆘 Support

For support and questions:
1. Check the [Issues](https://github.com/iancossa/rpa-api/issues) page
2. Create a new issue with detailed description
3. Include logs and error messages
4. Specify your environment details

---

## 📈 Roadmap

### Upcoming Features
- [ ] Web dashboard for task management
- [ ] Advanced automation workflows
- [ ] Real-time WebSocket notifications
- [ ] API rate limiting
- [ ] Comprehensive test suite
- [ ] Performance monitoring
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline integration

### Version History
- **v1.0.0** - Initial release with core microservices
- **v1.1.0** - Added message queue system
- **v1.2.0** - Implemented centralized logging
- **v1.3.0** - Enhanced authentication and authorization