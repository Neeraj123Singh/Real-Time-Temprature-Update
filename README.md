# Real-Time Temperature Monitoring System

## 📌 Project Overview
This project is a **real-time temperature monitoring system** with a frontend and backend, containerized using Docker. It uses **Express.js** for the backend and **React** for the frontend, communicating via **WebSockets**.

## 🏗️ Project Structure
```
real-time-temp-monitor/
│── frontend/         # React frontend
│── backend/          # Express.js backend
│── docker-compose.yml # Orchestrates frontend & backend services
│── .gitignore        # Files to exclude from version control
│── README.md         # Project documentation
```

## 🚀 Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## 📦 Setup Instructions
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/real-time-temp-monitor.git
cd real-time-temp-monitor
```

### 2️⃣ Configure Environment Variables
Create a `.env` file in both `frontend/` and `backend/` directories.

#### **Example `.env` (Backend)**
```sh
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://------------.mongodb.net/yourdbname?retryWrites=true&w=majority
```

#### **Example `.env` (Frontend)**
```sh
REACT_APP_API_URL=http://localhost:****/api
```

### 3️⃣ Start Services with Docker
Run the following command from the root project directory:
```sh
docker-compose up --build
```
This will start both frontend (`http://localhost:3000`) and backend (`http://localhost:5001`).

### 4️⃣ Run Test Cases
To execute the test cases for frontend and backend, use the following commands:

#### **Frontend Tests**
```sh
cd frontend
npm run test
```

#### **Backend Tests**
```sh
cd backend
npm test
```

### 5️⃣ Stop the Containers
To stop all services, run:
```sh
docker-compose down
```

## 🔥 Troubleshooting
- **Port conflicts** → Change port mappings in `docker-compose.yml`.
- **CORS issues** → Ensure backend allows frontend requests.
- **Database errors** → Check MongoDB connection in `.env`.

## 📜 License
This project is open-source.

## 👨‍💻 Contributors
- Neeraj Singh

# Real-Time-Temprature-Update
