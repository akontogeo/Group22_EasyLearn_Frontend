import React, { useEffect, useState } from 'react';
import { getUserEnrolledCourses } from '../api/users';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MyCourses(){
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!user) return;
    async function load(){
      try{
        const enrolledCourses = await getUserEnrolledCourses(user.userId);
        setCourses(enrolledCourses);
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    }
    load();
  },[user]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h2>My Courses</h2>
        <Link to="/" className="btn">Browse More Courses</Link>
      </div>
      {loading && <div className="card">Loading...</div>}
      {!loading && (
        <>
          {courses.length === 0 && (
            <div className="card">
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/" className="btn">Explore Courses</Link>
            </div>
          )}
          <div style={{display:'grid',gap:12}}>
            {courses.map(c => (
              <CourseCard key={c.courseId} course={c} actions={<span/>} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
