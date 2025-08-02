# Civic Tracker

A modern web application for reporting and tracking civic issues in your community. Citizens can report problems like potholes, broken streetlights, graffiti, and other infrastructure issues, while administrators can manage and track the resolution of these reports.

## Features

### For Citizens
- **Report Issues**: Submit detailed reports with descriptions, categories, and location
- **Interactive Map**: View and add reports using an interactive map interface
- **Photo Upload**: Attach images to reports for better documentation
- **Vote on Issues**: Support reports to show community priority
- **Track Status**: Monitor the progress of reported issues
- **User Authentication**: Secure login and account management

### For Administrators
- **Dashboard Overview**: View statistics and manage all reports from a central dashboard
- **Report Management**: Update status, assign reports, and add administrative notes
- **User Management**: Ban/unban users and monitor community activity
- **Spam Detection**: Mark reports as spam or invalid
- **Real-time Updates**: All changes are reflected instantly across the platform

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **State Management**: Zustand
- **Authentication**: Role-based access control
- **HTTP Client**: Fetch API with fallback mock data

## Project Structure

```
FRONTEND/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── screens/           # Main application pages
│   │   ├── Home.tsx       # Main issue listing page
│   │   ├── AddReport.tsx  # Report submission form
│   │   ├── ViewReport.tsx # Individual report details
│   │   ├── Login.tsx      # User authentication
│   │   ├── AdminLogin.tsx # Admin authentication
│   │   └── AdminDashboard.tsx # Admin management panel
│   ├── store/             # State management
│   │   ├── useAuthStore.ts
│   │   ├── useCardStore.ts
│   │   └── useCardContext.tsx
│   ├── types/             # TypeScript type definitions
│   │   ├── issue.ts
│   │   └── admin.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useCardDetails.ts
│   └── App.tsx            # Main application component
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd civic-tracker/FRONTEND
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

### Regular Users
- Can view all public reports
- Can submit new reports
- Can vote on existing reports
- Can view report details and status updates

### Administrators
- All regular user permissions
- Can access admin dashboard
- Can update report status and assignment
- Can mark reports as spam or invalid
- Can ban/unban users
- Can view user management interface

## API Integration

The application is designed to work with a backend API. Currently, it includes mock data for development and testing. The following endpoints are expected:

### Reports
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/reports` - All reports for admin
- `PATCH /api/admin/reports/:id/status` - Update report status
- `PATCH /api/admin/reports/:id/spam` - Mark as spam
- `PATCH /api/admin/reports/:id/invalid` - Mark as invalid

### Users
- `GET /api/admin/users` - All users for admin
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/users/:id/unban` - Unban user

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_MAP_API_KEY=your_map_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
