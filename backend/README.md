
# SkillSphere – Learning & Career Development Platform

**Learn. Grow. Achieve.**

SkillSphere is a full-stack learning and career development platform that helps students explore courses, track their learning progress, manage career roadmaps, and improve their professional skills.

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Bootstrap 5
- React Router DOM
- Axios
- Lucide React

### Backend
- PHP 8.2
- Laravel 12
- MySQL
- Laravel Sanctum
- RESTful APIs

## Features

### Student Features
- User Registration and Login
- Browse and Search Courses
- Course Category Filtering and Sorting
- Course Enrollment
- Course Progress Tracking
- Career Roadmaps
- Roadmap Step Completion
- Course Reviews and Ratings
- Course Wishlist
- Profile Management
- Profile Avatar Upload
- Contact and Support

### Admin Features
- Admin Authentication
- View Contact Messages
- Update Contact Message Status
- Manage Support Requests

## Project Structure

```text
SkillSphere/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── config/
│   └── composer.json
│
├── .gitignore
└── README.md
```

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/shivamsccs2024-java/SkillSphere.git
cd SkillSphere
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

Open another terminal:

```bash
cd backend
composer install
```

Copy `.env.example` to `.env` and configure your MySQL database.

Generate application key:

```bash
php artisan key:generate
```

Run migrations and seeders:

```bash
php artisan migrate
php artisan db:seed
```

Start Laravel server:

```bash
php artisan serve
```

Backend URL: http://127.0.0.1:8000

## Database Demo Data

The database seeders generate:

- 1 Admin account
- 15 Student accounts
- 15 Courses
- Course Enrollments and Progress
- Career Roadmaps and Steps
- Course Reviews
- Wishlists
- Contact Messages

## API Authentication

Laravel Sanctum is used for API token authentication.

Protected endpoints require a Bearer Token.

## Future Enhancements

- Online Course Payments
- Video Learning
- Certificates
- Admin Course Management
- Email Notifications

## Developer

**A. Siva Kumar**

GitHub: https://github.com/shivamsccs2024-java

---

Built with React.js, Laravel and MySQL.
