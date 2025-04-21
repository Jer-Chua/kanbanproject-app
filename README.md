# 🗂️ kanbanproject-app

A Kanban-style task management application built with Vue 3 and Vite. This application allows users to manage tasks across different boards with user authentication features.

## 📁 Project Structure

kanbanproject-app/ ├── .firebase/ # Firebase configuration files ├── .vscode/ # VSCode editor settings ├── public/ # Static assets ├── src/ # Source code directory │ ├── assets/ # Static images and styles │ ├── components/ # Vue components (Board, TaskCard, Modals, etc.) │ ├── router/ # Vue Router setup │ ├── views/ # Page-level views (Dashboard, Login, Register, etc.) │ ├── store/ # Global state management (e.g., Pinia or Vuex) │ └── main.js # App entry point ├── .firebaserc # Firebase project aliases ├── .gitignore # Git ignore rules ├── README.md # Project documentation ├── apphosting.yaml # Hosting configuration ├── firebase.json # Firebase configuration ├── firestore.indexes.json # Firestore indexes ├── firestore.rules # Firestore security rules ├── index.html # Main HTML file ├── package-lock.json # Package lock file ├── package.json # Project metadata and dependencies └── vite.config.js # Vite configuration


## 🛠️ Tech Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend Services**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Firebase Auth
  - **Database**: Firestore
  - **Hosting**: Firebase Hosting
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🔐 Capabilities

- ✅ **User Authentication**: Secure login and registration using Firebase Auth.
- ✅ **Kanban Board Feature**: Users can create boards, add/edit/delete tasks, and organize them by columns.
- ❌ **Drag and Drop**: Drag-and-drop functionality is **not implemented** in this version.

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/Jer-Chua/kanbanproject-app.git
   cd kanbanproject-app
