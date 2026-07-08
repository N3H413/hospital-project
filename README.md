# HopeCare Client Portal

HopeCare is a full-stack hospital information and patient utility application. It provides an interactive web interface for patients to explore medical departments, search for specialized practitioners, verify real-time campus metrics (like parking vacancy, live cafeteria menu options, and pharmacy stock status), and safely request clinical consultations.

The platform utilizes a decoupled architecture featuring a robust Django REST Framework backend API paired with a high-performance, responsive React (Vite) frontend.

## Key Features

- Dynamic Medical Services Directory: Seamlessly loads available medical departments right from the database. Clicking a department instantly navigates to the staff roster pre-filtered for that specialty.

- Intelligent Appointment Booking:

- Anti-Double-Booking Protection: Custom backend validation flags and blocks overlapping consultation times for individual practitioners.

- Operational Boundary Enforcement: Automatically prevents reservations on non-operational clinic days (weekends).

- Live Facility & Campus Amenities Tracker: An interactive, single-pane utility hub featuring tabbed views for:

  🍔 Cafeteria Menu: Live schedules, price indexing, and dietary tagging.

  💊 Pharmacy Inventory: Instantly reflects critical or available stock levels via UI status badges.

  🚗 Live Parking Allocation: Tracks occupancy across multiple parking zones using dynamic progress bars.

- Staff Directory Search Engine: Live client-side lookup that parses rows by doctor names or professional specializations simultaneously.

### Tech Stack
#### Backend (API Engine)

- Framework: Django & Django REST Framework (DRF)

- Architecture: RESTful Class-Based and Functional API Views, Serializer Relationships (Nested/Hyperlinked fields)

- Database: SQLite (Development) / PostgreSQL (Production)

#### Frontend (User Interface)

- Build Tool & Framework: Vite + React (SPA architecture)

- Styling: Tailwind CSS (Fluid responsive design layouts)

- Routing: React Router DOM (Dynamic browser history injection and navigation state tracking)

- Icons: Lucide React

#### Repository Structure

    ├── backend/                  # Django Python Application Root
    │   ├── backend/              # Core configuration directory (settings, urls)
    │   ├── core_apps/            # Primary application layer (models, views, serializers)
    │   └── manage.py             # Django CLI manager
    │
    └── 25b4506-frontend/         # Vite React Project Root
        ├── src/
        │   ├── components/       # Global modular widgets (ContactWidget, etc.)
        │   ├── pages/            # Core views (Home, Doctors, Booking)
        │   ├── App.jsx           # Application entry template and Router tree
        │   └── main.jsx          # React structural DOM mounting script
        ├── package.json
        └── vite.config.js
