# MentorSync: Intelligent Mentorship Scheduler

MentorSync is a comprehensive, full-stack mentorship scheduling platform designed to seamlessly connect students with industry experts. Built with a premium, glassmorphic "Silent Coder" aesthetic, it handles the heavy lifting of scheduling, including availability management, booking confirmations, and automatic email notifications.

## 🚀 Features

### For Mentors
* **Availability Management**: Create one-time or recurring availability slots with configurable buffers and session durations.
* **Booking Dashboard**: View pending mentorship requests and easily confirm or reject them.
* **Automated Notifications**: Mentors receive system updates and students are notified of their decisions.

### For Students
* **Discover Mentors**: Browse available mentors, filter by expertise, and view their profiles.
* **Frictionless Booking**: Book sessions directly from a mentor's available slots.
* **Student Dashboard**: Keep track of upcoming confirmed sessions and easily cancel if plans change.

### Platform & Security
* **Role-Based Authentication**: Secure JWT-based authentication separating Mentor and Student access.
* **Global Authentication Recovery**: If a session expires, a global login modal seamlessly intercepts the request, allowing the user to re-authenticate without losing their current page state or form data.
* **Email Integration**: Integrated SMTP service for sending booking confirmations and updates.
* **Premium UI/UX**: Dark mode by default, fluid animations (Framer Motion), and a responsive Tailwind CSS design.

## 💻 Tech Stack

**Frontend:**
* React 18 + Vite
* Tailwind CSS (Custom Dark/Glassmorphic Design)
* Framer Motion (Micro-animations and layout transitions)
* Axios (API calls & interceptors)
* React Router DOM

**Backend:**
* Java 17 + Spring Boot 3
* Spring Security & JWT Token Authentication
* Spring Data JPA + MySQL
* JavaMailSender (Email notifications)

## 🛠️ Getting Started

### Prerequisites
* Java 17+
* Node.js 18+
* MySQL Server
* SMTP Credentials (for email notifications)

### Backend Setup
1. Navigate to the `backend` directory.
2. Configure your MySQL database and SMTP details in `src/main/resources/application.properties`.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
