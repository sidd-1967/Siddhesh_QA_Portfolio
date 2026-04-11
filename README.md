# Siddhesh Govalkar | QA Engineer Portfolio

A fully dynamic, full-stack portfolio website designed specifically for a Quality Assurance (QA) Engineer. 

This project goes beyond a simple static site by featuring a complete custom **Admin Portal**. It allows the owner to log in and manage their entire portfolio (Skills, Projects, Experience, Certifications, Contact details) visually, without ever touching a line of code again.

## 🚀 Key Features

*   **Dynamic Data Engine:** Everything you see—hero text, about me, skills, projects, and certifications—is fed from a database and can be updated instantly from the Admin Dashboard.
*   **Skill Showcase & Filtering:** Beautifully categorized skills (Testing, Automation, Tools, Cloud, etc.) natively grouped for easy scanning by recruiters.
*   **Projects & Experiences:** Chronological display of QA-specific projects, including testing frameworks used (Selenium, Cypress, etc.) and verification links.
*   **Secure Admin Portal:** A hidden `/admin` route protected by JWT authentication ensures only the portfolio owner can edit the content.
*   **Seamless AJAX Operations:** Adding, editing, and deleting items in the admin portal happens silently in the background, offering a fluid desktop-app-like experience without full page reloads.
*   **Optimized Performance:** Built with Next.js App Router for top-tier SEO and blistering fast load times.

## 🛠 Tech Stack

*   **Frontend:** Next.js (App Router), React, Vanilla CSS (Custom Design System)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Mongoose)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Image Storage:** Cloudinary (for project images and certification badges)
*   **Hosting:** Vercel (Frontend) & Render (Backend)

## 📁 Repository Structure

*   **/frontend:** The Next.js web application. Contains all UI components, public portfolio pages, and the protected Admin dashboard routes.
*   **/backend:** The Express.js REST API. Manages the database models, handles image uploads to Cloudinary, and verifies JWT tokens.

