# Frontend Application

A React-based single-page application (SPA) built with Vite and TypeScript for the WFH attendance system.

## Features

- **Authentication**: Login and strict route protection
- **Staff Interface**:
  - Clock-in/Clock-out with photo and location
  - View personal attendance history
- **Admin Interface**:
  - Dashboard overview
  - Staff management (CRUD)
  - Attendance monitoring (search, filter, sort)

## Installation (Dev)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory (if needed) to configure API endpoints.

## Usage (Dev)

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Build

To build the application for production:
```bash
npm run build
```