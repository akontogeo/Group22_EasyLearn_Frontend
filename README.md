# EasyLearn Frontend

Production-ready React frontend for the EasyLearn educational platform. Built with Create React App and connects to the backend API running on port 5000.

## Features

✅ **4+ Pages**: Home (search), Course Details, My Courses, Profile  
✅ **5+ API Endpoints**: Uses courses search, enroll, withdraw, ratings, user profile, recommendations, leaderboard, and progress tracking  
✅ **Responsive Design**: Mobile-friendly layout with CSS Grid  
✅ **Basic Authentication**: Token-based auth with localStorage  
✅ **Search & Filters**: Category, difficulty, premium status filters  
✅ **Interactive Components**: Rating submission, enrollment, progress tracking  

## Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Edit `.env` if your backend runs on a different port:

```
REACT_APP_API_BASE=http://localhost:5000
REACT_APP_DEFAULT_USER_ID=101
```

### 3. Start Development Server

```powershell
npm start
```

The app will open at `http://localhost:3000`.

## Project Structure

```
src/
├── api/              # API client & endpoint wrappers
│   ├── client.js     # Axios instance with auth interceptor
│   ├── courses.js    # Course-related endpoints
│   └── users.js      # User-related endpoints
├── components/       # Reusable UI components
│   ├── Header.jsx
│   ├── CourseCard.jsx
│   └── SearchFilters.jsx
├── pages/            # Page components
│   ├── Home.jsx
│   ├── CourseDetails.jsx
│   ├── MyCourses.jsx
│   └── Profile.jsx
├── context/          # React Context providers
│   └── AuthContext.jsx
├── router/           # Route definitions
│   └── AppRouter.jsx
├── hooks/            # Custom React hooks
│   └── useCourseSearch.js
├── utils/            # Utilities
│   ├── validators.js
│   ├── constants.js
│   └── formatters.js
├── App.js            # Root component
├── index.js          # Entry point
└── index.css         # Global styles
```

## API Endpoints Used

1. `GET /courses` - Search courses with filters
2. `GET /courses/{courseId}` - Get course details
3. `POST /users/{userId}/courses` - Enroll in course
4. `DELETE /users/{userId}/courses/{courseId}` - Withdraw from course
5. `GET /users/{userId}` - Get user profile
6. `PUT /users/{userId}` - Update user (premium status)
7. `GET /users/{userId}/recommendations` - Get personalized recommendations
8. `GET /leaderboard` - Get leaderboard rankings
9. `GET /courses/{courseId}/ratings` - Get course ratings
10. `POST /courses/{courseId}/ratings` - Submit rating
11. `GET /users/{userId}/courses/{courseId}/progress` - Get progress

## Build for Production

```powershell
npm run build
```

Creates optimized production build in the `build/` folder.

## Notes

- Backend must be running on port 5000 (or configured port in .env)
- Default user ID is 101 (for demo purposes)
- Basic auth token is stored in localStorage

