# Smart City Management System 🏙️

A comprehensive web-based platform designed to digitize and streamline city management operations. This project serves citizens, tourists, and administrators by integrating essential services into a unified interface.

## 🌟 Overview

The Smart City system is divided into two main components:
1.  **[Frontend](./frontend)**: A React-based user interface focusing on modern design (Glassmorphism), interactivity, and ease of use.
2.  **[Backend](./backend)**: A Node.js/Express server managing data, authentication, and integration with AI and external APIs.

## 🚀 Quick Start

### Prerequisites
-   Node.js installed on your machine.
-   MongoDB database (local or Atlas).

### Running the Project

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ayush-Gupta-0212/Software-for-Smart-City.git
    cd Software-for-Smart-City
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Setup your .env file
    npm run dev
    ```

3.  **Setup Frontend:**
    Open a new terminal:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## ✨ Key Features

-   **User Roles**: Distinct flows for Citizens, Attraction Managers, and Admins.
-   **Authentication**: Secure JWT-based auth with special secret keys for elevated roles.
-   **Interactive Maps**: Traffic and attraction visualization.
-   **AI Integration**: Chatbot assistance powered by Google Gemini.
-   **Modern UI**: Beautiful particle backgrounds and glassmorphism cards.

## 📄 License

This project is licensed under the ISC License.

---
## 🛠️ My Contributions

- Designed and implemented the authentication system including user login, registration, and secure route handling using middleware.
- Developed backend APIs using a structured MVC architecture (controllers, routes, models).
- Built the chat/communication module enabling users to send and retrieve messages from the database.
- Worked on integrating frontend with backend APIs to ensure smooth data flow.
- Handled debugging and optimization of API responses for better performance.
