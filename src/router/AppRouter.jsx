import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import CourseDetails from '../pages/CourseDetails';
import MyCourses from '../pages/MyCourses';
import Profile from '../pages/Profile';
import CourseProgress from '../pages/CourseProgress';
import CourseReviews from '../pages/CourseReviews';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AppRouter(){
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%'}}>
      <Header />
      <div className="container" style={{flex: '1 1 auto', width: '100%', maxWidth: '1600px'}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/courses" element={<Home/>} />
          <Route path="/courses/:id" element={<CourseDetails/>} />
          <Route path="/courses/:courseId/reviews" element={<CourseReviews/>} />
          <Route path="/users/:userId/courses" element={<MyCourses/>} />
          <Route path="/users/:userId/courses/:courseId" element={<CourseProgress/>} />
          <Route path="/users/:userId" element={<Profile/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
