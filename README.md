# HealWise

HealWise is a comprehensive full-stack medical application designed to streamline healthcare operations. It serves as an integrated platform connecting hospitals, doctors, and patients, providing a seamless digital experience for medical management.

## Project Description

The HealWise platform is built with a robust backend using Java and Spring Boot, and a modern, responsive frontend using React and Vite. The application is tailored with a calm, clinical color palette (hospital theme) to provide a visually pleasing and trusted environment for users.

It features comprehensive CRUD operations, role-based access control, and dynamic dashboards that cater to different user endpoints. Users can register, authenticate securely, and access personalized features based on their roles. 

### Key Features
- **Role-Based Dashboards**: Customized views and functionalities for Doctors, Patients, and Hospital Administrators.
- **Secure Authentication**: End-to-end full-stack authentication using robust security practices.
- **RESTful API**: A fully functional Spring Boot backend delivering reliable API endpoints, documented with Swagger.
- **Modern Medical UI**: A clean, glassmorphic UI with a medical-themed color palette for an enhanced user experience.
- **Live Data Integration**: Real-time fetching of statistics, activity logs, and appointment details.

## Technology Stack
- **Backend**: Java, Spring Boot 3.3.4, Hibernate, PostgreSQL (or relational DB of choice)
- **Frontend**: React, Vite, Vanilla CSS / CSS Modules
- **Build Tools**: Maven (Backend), npm (Frontend)

## Getting Started

### Prerequisites
- JDK 17 or higher
- Maven
- Node.js (v18 or higher)
- npm

### Running the Backend
1. Navigate to the `BackendApi` directory:
   ```bash
   cd BackendApi
   ```
2. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will be available at `http://localhost:8080`. You can test the endpoints using Swagger UI (if configured, typically at `http://localhost:8080/swagger-ui.html`).

### Running the Frontend
1. Navigate to the `FrontEnd` directory:
   ```bash
   cd FrontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be served at `http://localhost:5173` (or depending on Vite's console output). All API requests are proxied to the backend seamlessly.

## License
This project is licensed under the MIT License.
