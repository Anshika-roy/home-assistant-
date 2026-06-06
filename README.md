# 🏠 Home Assistant Dashboard

An AI-inspired productivity and personal management platform built using **React, Vite, Tailwind CSS, Node.js, and Express.js**.

The project provides a modern dashboard experience where users can manage tasks, view analytics, organize schedules, automate workflows, and interact with future AI-powered features through a clean and responsive interface.

---

## 🚀 Overview

The Home Assistant Dashboard is designed as a full-stack productivity platform that combines:

* Task Management
* Calendar Integration
* Analytics Tracking
* Workflow Automation
* AI Assistant Support
* User Profile Management
* Settings & Personalization

The project currently functions as a prototype with a working frontend, backend APIs, and event tracking capabilities.

---

## ✨ Features

### Frontend Features

* Modern Dashboard UI
* Responsive Design
* Sidebar Navigation
* Analytics Panels
* Calendar Interface
* Task Management Interface
* Automation Dashboard
* Chatbot Interface
* User Profile Management
* Settings Panel

### Backend Features

* REST API Architecture
* Event Tracking System
* Data Storage & Retrieval
* Request Processing
* JSON-Based Persistence

### Mobile Ready

* React Mobile Application Scaffold
* Future Mobile Expansion Support

---

## 🏗️ Project Architecture

```text
Home-Assistant-Dashboard
│
├── dashboard-web/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── backend/
│   ├── server.js
│   ├── routes/
│   └── tracks.json
│
├── mobile-app/
│
└── PROJECT_DOCUMENTATION.md
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Data Storage

* JSON File Storage (`tracks.json`)

### Future Technologies

* PostgreSQL / MongoDB
* JWT Authentication
* Google Calendar API
* Gemini AI / OpenAI API

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd home-assistant-dashboard
```

---

## ▶️ Running the Backend

```bash
cd backend
npm install
node server.js
```

Backend Server:

```text
http://localhost:3000
```

---

## ▶️ Running the Frontend

```bash
cd dashboard-web
npm install
npm run dev
```

Frontend Application:

```text
http://localhost:5173
```

---

## 📄 Important Files

### App.jsx

Main routing component responsible for page navigation.

Available routes:

* Dashboard
* Tasks
* Calendar
* Analytics
* Automation
* Chatbot
* Profile
* Settings

---

### Components Folder

Reusable UI components such as:

* Sidebar
* Topbar
* GlassCard
* ModuleCard
* AIOrb

These components ensure design consistency across the application.

---

### server.js

Backend entry point.

Responsibilities:

* API Routing
* Request Handling
* Event Processing
* Data Management

---

### tracks.json

Temporary storage layer used for tracking events and user interactions.

---

## 🔌 API Documentation

### POST /track

Stores event data.

Example:

```json
{
  "deviceType": "phone",
  "payload": {
    "task": "Study"
  }
}
```

Response:

```json
{
  "success": true
}
```

---

### GET /data

Retrieves stored event data.

Example:

```text
/ data?deviceType=phone
```

Returns filtered records matching the specified device type.

---

## 📊 Current Development Status

### Completed

* Dashboard UI
* Navigation System
* Multiple Pages
* Backend API
* Event Tracking
* Mobile Scaffold

### In Progress

* Tasks Module
* Calendar Integration
* Analytics Engine
* Automation Workflows
* AI Chatbot
* User Profiles
* Settings Management

---

## ⚠️ Current Limitations

### Authentication

Currently unavailable:

* User Registration
* User Login
* User Logout

### Database

Using:

```text
tracks.json
```

Planned upgrades:

* PostgreSQL
* MongoDB
* SQLite

### AI Features

The chatbot interface is present but not yet connected to an AI model.

---

## 🔮 Roadmap

### Phase 1

* Authentication System
* Database Integration
* User Management

### Phase 2

* Task CRUD Operations
* Calendar Event Management
* Notifications

### Phase 3

* AI Chatbot Integration
* Natural Language Commands
* Smart Suggestions

### Phase 4

* Advanced Analytics
* Workflow Automation
* Productivity Insights

### Phase 5

* Mobile Application
* Cloud Deployment
* Real-Time Synchronization

---

## 🎯 Future Vision

The goal is to evolve Home Assistant Dashboard into a complete AI-powered productivity ecosystem capable of:

* Managing schedules
* Tracking productivity
* Automating repetitive tasks
* Providing intelligent recommendations
* Serving as a personal digital assistant

---

## 📈 Project Status

**Current Status:** Functional Prototype


---

## 📜 License

This project is intended for educational, portfolio, and hackathon purposes.

---

### ⭐ Built with React, Express, and a vision for AI-powered productivity.

