// Main router component - defines all application routes
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Lazy load page components for better performance
const Home = React.lazy(() => import('../pages/Home'));
const CourseDetails = React.lazy(() => import('../pages/CourseDetails'));
const MyCourses = React.lazy(() => import('../pages/MyCourses'));
const Profile = React.lazy(() => import('../pages/Profile'));
const CourseProgress = React.lazy(() => import('../pages/CourseProgress'));
const CourseReviews = React.lazy(() => import('../pages/CourseReviews'));

// Application routing layout with header, routes, and footer
export default function AppRouter(){
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%'}}>
      <Header />
      <div className="container" style={{flex: '1 1 auto', width: '100%', maxWidth: '1600px'}}>
        {/* Define all application routes with suspense for lazy loading */}
        <Suspense fallback={<div style={{padding: '40px', textAlign: 'center', fontSize: '16px', color: '#666'}}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/courses" element={<Home/>} />
            <Route path="/courses/:id" element={<CourseDetails/>} />
            <Route path="/courses/:courseId/reviews" element={<CourseReviews/>} />
            <Route path="/users/:userId/courses" element={<MyCourses/>} />
            <Route path="/users/:userId/courses/:courseId" element={<CourseProgress/>} />
            <Route path="/users/:userId" element={<Profile/>} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
