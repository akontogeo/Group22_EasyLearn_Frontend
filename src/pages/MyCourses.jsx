import React, { useEffect, useState } from 'react';
import { getUserEnrolledCourses, getUserProfile, withdrawFromCourse } from '../api/users';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';

export default function MyCourses(){
  const { userId } = useParams();
  const { setUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!userId) return;
    async function load(){
      try{
        // Set this user as logged-in user
        const profile = await getUserProfile(userId);
        setUser({ ...profile, userId: Number(userId) });
        
        const enrolledCourses = await getUserEnrolledCourses(userId);
        setCourses(enrolledCourses);
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    }
    load();
  },[userId, setUser]);

  const handleWithdraw = async (courseId, courseTitle) => {
    const confirmed = window.confirm(`Are you sure you want to withdraw from "${courseTitle}"? This action cannot be undone.`);
    if(!confirmed) return;

    try{
      await withdrawFromCourse(userId, courseId);
      alert('Successfully withdrawn from the course');
      // Refresh the course list
      const enrolledCourses = await getUserEnrolledCourses(userId);
      setCourses(enrolledCourses);
    }catch(e){
      alert('Failed to withdraw: ' + (e.response?.data?.message || e.message));
    }
  };

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
              <CourseCard 
                key={c.courseId} 
                course={c} 
                actions={
                  <button 
                    onClick={() => handleWithdraw(c.courseId, c.title)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    Withdraw
                  </button>
                } 
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
