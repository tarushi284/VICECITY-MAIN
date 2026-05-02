# Smart City - Frontend

A modern, responsive web interface for the Smart City Management System. Built with React, Vite, and Tailwind CSS, featuring glassmorphism design and interactive particle backgrounds.

## 🚀 Technologies

-   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Maps:** Mapbox GL & React Google Maps
-   **Particles:** tsparticles (Slim)
-   **Routing:** React Router DOM

## 🛠️ Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

## ✨ Key Features

-   **Dynamic Authentication UI**: Login/Register pages with glassmorphism cards and interactive particle backgrounds.
-   **Role-Based Access**: Toggle login for Citizens, Attraction Managers, and Admins.
-   **Dashboard**: Centralized hub for accessing services.
-   **Services Integration**: Interfaces for Traffic, Weather, Bills, identifying attractions, and more.
-   **Theme Support**: Built-in Dark/Light mode toggle.

## 📂 Structure

-   `src/components`: Reusable UI components (Navbar, ParticlesBackground, AuthLayout).
-   `src/pages`: Individual route pages (Login, Dashboard, etc.).
-   `src/context`: React Context providers (AuthContext, ThemeContext).
-   `src/index.css`: Global styles and Tailwind directives.

## 🔧 Scripts

-   `npm run dev`: Start local dev server.
-   `npm run build`: Build for production.
-   `npm run lint`: Run ESLint.
