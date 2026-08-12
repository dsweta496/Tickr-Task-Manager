# TICKR — Task Management Platform

> A full-stack task management application designed to help users organize, prioritize, track, and complete their work through a responsive and secure web interface.

## Overview

TICKR is a full-stack task management platform built with a React-based frontend, Node.js/Express backend, and MongoDB database.

The application provides authenticated users with a centralized workspace for creating and managing tasks, organizing work through labels and priorities, tracking completed tasks, and navigating between active and completed work.

The project was developed with a focus on clean application architecture, responsive UI design, authentication, RESTful API integration, data persistence, and deployment.

Rather than treating the application as a simple CRUD project, TICKR was structured as a complete client-server application with separate frontend and backend responsibilities.

---

## Key Features

### Authentication & Authorization

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes through authentication middleware
- Persistent client-side authentication state
- Secure handling of environment variables and application secrets

### Task Management

- Create new tasks
- View and manage existing tasks
- Update task information
- Delete tasks
- Mark tasks as completed
- Dedicated completed-task view
- Empty states for sections with no available tasks

### Organization & Filtering

- Task priority management
- Label-based organization
- Interactive label filtering
- Separation of active and completed tasks
- Pagination for task collections

### Responsive Interface

- Dedicated desktop and mobile layouts
- Responsive sidebar/navigation
- Mobile task cards
- Responsive authentication screens
- Mobile-friendly task interactions
- Adaptive spacing, typography, and component layouts

### User Experience

- Clean and consistent visual language
- Custom TICKR branding
- Responsive authentication experience
- Scroll-to-top functionality
- Confirmation flows for destructive/completion actions
- Meaningful empty and error states
- Consistent action controls and feedback

---

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- CSS
- REST API integration

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- CORS
- dotenv

### Development & Deployment

- Git
- GitHub
- Render
- MongoDB Atlas
- Postman

---

## Application Architecture

TICKR follows a client-server architecture with a clear separation between presentation, business logic, data access, and persistence.

```text
                    ┌──────────────────────┐
                    │       TICKR UI       │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               │ JWT Authentication
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
             Authentication          Task / Label
               Middleware             Routes
                    │                      │
                    └──────────┬───────────┘
                               ▼
                         Controllers
                               │
                               ▼
                           Mongoose
                               │
                               ▼
                    ┌──────────────────────┐
                    │     MongoDB Atlas    │
                    └──────────────────────┘
```

### Frontend

The frontend is responsible for:

- Rendering the application interface
- Managing UI state
- Handling user interactions
- Managing authentication state
- Communicating with backend REST APIs
- Presenting loading, error, and empty states
- Providing responsive layouts for desktop and mobile devices

### Backend

The backend handles:

- API routing
- Authentication
- Authorization
- Request validation
- Business logic
- Database interaction
- Password verification
- JWT generation
- Protected resource access

### Database

MongoDB Atlas provides persistent storage for application data, with Mongoose used for schema definition and database interaction.

---

## Project Structure

```text
Tickr-Task-Manager/
│
├── client/
│   ├── public/
│   │   ├── login-bg-desktop.png
│   │   ├── login-bg-mobile.png
│   │   └── foliage.png
│   │
│   └── src/
│       ├── component/
│       │   ├── CompletedTasks.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Navbar.jsx
│       │   ├── ScrollToTop.jsx
│       │   ├── Sidebar.jsx
│       │   └── Signup.jsx
│       │
│       └── ...
│
├── server/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── database.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Authentication Flow

TICKR uses JWT-based authentication to protect user-specific resources.

### Login Flow

```text
User
 │
 │ Email + Password
 ▼
React Login Form
 │
 │ POST request
 ▼
Express API
 │
 ▼
User lookup in MongoDB
 │
 ▼
bcrypt password comparison
 │
 ├── Invalid → Error response
 │
 └── Valid
       │
       ▼
   JWT generated
       │
       ▼
Token returned to client
       │
       ▼
Stored in client authentication state
       │
       ▼
Used for protected API requests
```

Passwords are never stored in plain text. Password verification is performed using bcrypt before authentication tokens are issued.

---

## Security Considerations

The application incorporates several basic security practices appropriate for a full-stack web application:

- Password hashing using bcrypt
- JWT-based authentication
- Protected backend routes
- Authentication middleware
- Environment variables for sensitive configuration
- `.env` excluded from version control
- MongoDB Atlas network access configuration
- CORS configuration for client-server communication
- Secrets such as database credentials and JWT keys kept outside source code

Sensitive configuration is provided through environment variables.

### Backend Environment Variables

```env
MONGO_URI=
SECRET_KEY=
```

### Frontend Environment Variables

```env
VITE_API_URL=
```

> Never commit actual environment variable values or credentials to the repository.

---

## API Responsibilities

The backend exposes RESTful endpoints for the application's core functionality.

### Authentication

```text
POST   /user/signup
POST   /user/signin
```

### Tasks

```text
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

### Labels

```text
GET    /labels
POST   /labels
...
```

> Endpoint names should be kept synchronized with the current route implementation.

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd Tickr-Task-Manager
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Configure the frontend environment

Create a `.env` file inside `client/`:

```env
VITE_API_URL=<backend-api-url>
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 6. Configure backend environment variables

Create a `.env` file inside `server/`:

```env
MONGO_URI=<mongodb-connection-string>
SECRET_KEY=<jwt-secret>
```

### 7. Start the backend

```bash
npm start
```

---

## Deployment

The application is deployed using separate frontend and backend services.

```text
GitHub Repository
       │
       ├──────────────► Frontend Service
       │                  │
       │                  └── React / Vite
       │
       └──────────────► Backend Service
                          │
                          └── Node / Express
                                  │
                                  ▼
                           MongoDB Atlas
```

The frontend communicates with the deployed backend through the `VITE_API_URL` environment variable.

The backend connects to MongoDB Atlas through `MONGO_URI`.

This separation allows the frontend and backend to be deployed and maintained independently.

---

## Testing & Validation

Before deployment, the application was tested across both frontend and backend functionality.

Validation included:

- User registration
- User login
- Password verification
- JWT authentication
- Protected routes
- Task creation
- Task updates
- Task deletion
- Task completion
- Label interactions
- Priority filtering
- Pagination
- Empty states
- Responsive layouts
- Mobile authentication
- API communication after deployment
- MongoDB connectivity
- Production environment configuration

The application was also tested after deployment to identify environment-specific issues such as API configuration, database network access, and authentication behavior.

---

## Engineering Decisions

### Separation of Frontend and Backend

The application separates UI concerns from server-side business logic, making the system easier to maintain and deploy independently.

### Middleware-Based Authentication

Authentication is handled through reusable middleware rather than duplicating authentication logic across individual controllers.

### Environment-Based Configuration

Deployment-specific values such as API URLs, database connection strings, and JWT secrets are supplied through environment variables rather than being hardcoded.

### Responsive UI Design

The interface was designed to accommodate both desktop and mobile users, including different navigation patterns and authentication layouts.

### Component-Based Frontend

The React application is divided into reusable components to keep individual UI responsibilities isolated and maintainable.

---

## Challenges & Implementation Experience

One of the major aspects of developing TICKR was moving the application from a locally working full-stack project to a publicly accessible deployment.

This required resolving several practical full-stack concerns:

- Connecting a deployed frontend to a separately deployed backend
- Managing production environment variables
- Configuring MongoDB Atlas network access for the deployed backend
- Handling CORS between frontend and backend domains
- Debugging differences between local and production API behavior
- Validating authentication after deployment
- Maintaining responsive behavior across desktop and mobile viewports
- Handling edge cases such as empty task collections and pagination boundaries

These deployment and debugging steps provided practical experience beyond implementing individual application features.

---

## Future Improvements

Potential future enhancements include:

- Refresh-token based authentication
- Role-based access control
- Advanced task search
- Due-date notifications
- Task analytics and productivity dashboards
- Drag-and-drop task organization
- Automated testing
- Improved observability and logging
- Progressive Web App support

---

## Author

**Sweta Dash**

B.Tech Computer Science & Engineering  
Full-Stack Developer | Java | React | Node.js | MongoDB

---

## License

This project was developed as part of an internship project and is intended primarily for educational and portfolio purposes.
