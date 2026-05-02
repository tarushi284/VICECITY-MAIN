# Smart City - Backend

The robust server-side application powering the Smart City platform. Built with Node.js, Express, and MongoDB, handling authentication, data management, and external API integrations.

## 🚀 Technologies

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Authentication:** JWT (JSON Web Tokens)
-   **AI Integration:** Google Generative AI (Gemini)
-   **Payments:** Razorpay

## 🛠️ Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    GEMINI_API_KEY=your_google_ai_key
    # Add other keys as required (Razorpay, Weatherstack, etc.)
    ```

4.  **Start the server:**
    ```bash
    npm start
    # Or for development with auto-restart:
    npm run dev
    ```

## 📡 API Endpoints

-   **Auth**: `/api/auth` (Login, Register, Role management)
-   **Events**: `/api/events` (CRUD for city events)
-   **Reports**: `/api/reports` (Citizen reporting system)
-   **Attractions**: `/api/attractions` (Tourist spots management)

## 📂 Structure

-   `controllers/`: Logic for handling API requests.
-   `models/`: Mongoose schemas for Database collections.
-   `routes/`: API route definitions.
-   `middleware/`: Authentication and error handling middleware.

## 🔧 Scripts

-   `npm start`: Start the production server.
-   `npm run dev`: Start development server with Nodemon.
