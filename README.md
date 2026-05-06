# SpaceSpot - Commercial Lease Management System

## 🚀 Project Overview

SpaceSpot is a full-stack commercial lease management platform designed to streamline the operations of property owners, property managers, and tenants. It manages key lifecycle aspects of commercial real estate, including unit leasing, booking reservations, payment tracking, and document management within a cohesive digital system.

The system adheres to best practices for separation of concerns, dividing logic into a modern **React/TypeScript Frontend** and a robust **Node.js/Express Backend**, all connected to a centralized **PostgreSQL** database.

---

## 🧱 Technology Stack

### Frontend (Client-Side)
The frontend is built with modern web technologies for a responsive and dynamic user experience.
*   **Framework:** React (using functional components and Hooks)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management/Routing:** React Router DOM
*   **Key Dependencies:** `axios` for API calls, `recharts` for data visualization, `sonner` for notifications.
*   **Build Tool:** Vite

### Backend (Server-Side)
The backend is a RESTful API responsible for all business logic, data validation, and database interaction.
*   **Framework:** Express.js
*   **Language:** JavaScript (Node.js)
*   **Database ORM:** Sequelize (with PostgreSQL dialect)
*   **Security:** JWT for authentication, bcryptjs for password hashing.
*   **Middleware:** Implements comprehensive validation (using `express-validator`), request logging (`morgan`), rate-limiting, and CORS handling.
*   **Scripts:** Includes dedicated scripts for starting the server (`npm run dev`) and database migrations (`npm run migrate`).

### Database
*   **Database:** PostgreSQL
*   **Model:** The entire schema is defined in `model/pg_model_ddl.sql`, utilizing features like custom ENUM types, JSONB fields for flexibility, and transactional integrity via triggers.

---

## 🧩 Core Features & Modules

1.  **Customer Management:** Full CRUD for customer profiles, including contact details and preference tracking.
2.  **Property/Space Management:** Management of entire properties, including location coordinates and property type categorization.
3.  **Floor & Unit Management:** Hierarchical structure to map spaces into floors, and units within those floors, tracking availability status (`available`, `occupied`, etc.).
4.  **Lease Management:** Core functionality for creating, tracking, and updating lease agreements, defining start/end dates and associated rent details.
5.  **Booking System:** Handles time-based reservations for units, tracking status from `pending` to `checked_out`.
6.  **Payment Gateway:** Manages transaction records linked to both leases and bookings, tracking payment status and due dates.
7.  **Document Generation:** System for creating, storing, and managing key documents (Leases, Invoices) with version control and approval workflows.
8.  **Reporting & Notifications:** Automated notification system to alert users about key events (e.g., lease expiry, pending payment).

---

## 🗄️ Data Model Schema (Extracted from `model/pg_model_ddl.sql`)

The database uses PostgreSQL with the following primary entities and relationships:

**Key Tables:**
*   `customers`: Stores tenant/client information.
*   `spaces`: Represents the large property or venue.
*   `floors`: Divides a space into vertical sections.
*   `units`: Represents a specific rentable area within a floor/space.
*   `pricing`: Defines rates for units based on time intervals.
*   `leases`: The core contractual record binding a customer to a unit.
*   `bookings`: Records temporary reservations for units.
*   `payments`: Tracks all financial transactions related to leases or bookings.
*   `documents`: Stores metadata and content for legal and operational documents.
*   `notifications`: Manages user alerts.

**Schema Highlights:**
*   **Status Tracking:** Uses multiple custom ENUM types (e.g., `customer_status`, `unit_status`, `lease_status`) to enforce valid state transitions.
*   **Soft Deletes:** Most major entities use `deleted_at` columns and provide `active_...` views for safe querying.
*   **Relationships:** Strong foreign key constraints ensure data integrity (e.g., `leases.customer_id` must reference an existing `customers.id`).

---

## ⚙️ Setup & Running the Project

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL Database Instance

### Step 1: Database Setup
1.  **Run Migrations:** Execute the migration script to set up the schema and sequences.

