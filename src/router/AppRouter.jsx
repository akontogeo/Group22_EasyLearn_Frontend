import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import CourseDetails from '../pages/CourseDetails';
import MyCourses from '../pages/MyCourses';
import Profile from '../pages/Profile';
import Header from '../components/Header';

export default function AppRouter(){
  return (
    <div>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/courses/:id" element={<CourseDetails/>} />
          <Route path="/my-courses" element={<MyCourses/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </div>
  );
}
