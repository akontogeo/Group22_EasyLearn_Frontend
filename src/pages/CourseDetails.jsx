import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, getCourseReviews } from '../api/courses';
import { getUserEnrolledCourses, enrollInCourse } from '../api/users';
import { useAuth } from '../context/AuthContext';

export default function CourseDetails(){
  const { id, courseId, userId } = useParams();
  // Use courseId if available (from /users/:userId/courses/:courseId), otherwise use id (from /courses/:id)
  const actualCourseId = courseId || id;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(()=>{
    async function load(){
      try{
        setLoading(true);
        const c = await getCourse(actualCourseId);
        setCourse(c);
        
        // Fetch reviews and calculate average
        const r = await getCourseReviews(actualCourseId);
        if(r && r.length > 0){
          const avg = (r.reduce((sum, rating) => sum + rating.stars, 0) / r.length).toFixed(1);
          setAvgRating(avg);
        } else {
          setAvgRating('N/A');
        }

        // Check if user is enrolled (if we have userId from URL or context)
        const currentUserId = userId || user?.userId;
        if(currentUserId){
          const enrolledCourses = await getUserEnrolledCourses(currentUserId);
          const enrolled = enrolledCourses.some(ec => ec.courseId === Number(actualCourseId));
          setIsEnrolled(enrolled);
        }
      }catch(e){
        console.error('Failed to load course:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[actualCourseId, userId, user]);

  const handleEnroll = async () => {
    const currentUserId = userId || user?.userId;
    if(!currentUserId){
      alert('Please log in to enroll');
      return;
    }
    
    try{
      setEnrolling(true);
      await enrollInCourse(currentUserId, actualCourseId);
      alert('Successfully enrolled!');
      setIsEnrolled(true);
    }catch(e){
      alert('Failed to enroll: ' + (e.response?.data?.message || e.message));
    }finally{
      setEnrolling(false);
    }
  };

  if(loading){
    return <div className="card">Loading course...</div>;
  }

  if(!course){
    return <div className="card">Course not found</div>;
  }

  return (
    <div style={{maxWidth: '1100px', margin: '0 auto', width: '100%'}}>
      {/* Main Course Card - matches mockup layout */}
      <div className="card" style={{marginBottom: 24, position: 'relative'}}>
        {/* Title with Image on the right */}
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, marginTop: 32}}>
          <h1 style={{
            margin: 0, 
            fontSize: 32, 
            fontWeight: 600,
            color: '#222',
            flex: 1,
            paddingRight: 20,
            paddingTop: 24
          }}>
            {course.title}
          </h1>
          
          {/* Course Image - positioned on the right like mockup */}
          <div style={{
            width: 140, 
            height: 140, 
            background: '#f0f0f0', 
            borderRadius: 12, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            border: '2px solid #e0e0e0'
          }}>
            {course.courseImage ? (
              <img src={course.courseImage} alt={course.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <div style={{fontSize: 56, fontWeight: 'bold', color: '#999'}}>
                {course.title?.slice(0,2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div style={{marginBottom: 20}}>
          <h3 style={{margin: '0 0 12px 0', fontSize: 16, fontWeight: 600}}>Description</h3>
          <p style={{
            margin: 0, 
            lineHeight: 1.7, 
            color: '#333',
            fontSize: 14
          }}>
            {course.description}
          </p>
        </div>

        {/* Metadata Grid - Category, Difficulty, Free/Premium, Rating */}
        <div style={{
          display: 'flex', 
          alignItems: 'center',
          gap: 40,
          marginBottom: 20,
          paddingTop: 16,
          borderTop: '1px solid #e5e5e5'
        }}>
          <div>
            <div style={{fontSize: 13, color: '#666', marginBottom: 6, fontWeight: 500}}>Category</div>
            <div style={{fontSize: 15, color: '#222', fontWeight: 500}}>{course.category}</div>
          </div>
          
          <div>
            <div style={{fontSize: 13, color: '#666', marginBottom: 6, fontWeight: 500}}>Difficulty</div>
            <div style={{fontSize: 15, color: '#222', fontWeight: 500}}>{course.difficulty}</div>
          </div>

          <div style={{display: 'flex', alignItems: 'center'}}>
            {course.premium ? (
              <span style={{
                background: '#764ba2',
                color: 'white',
                padding: '4px 14px',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500
              }}>
                Premium course
              </span>
            ) : (
              <span style={{
                color: '#222',
                fontSize: 14,
                fontWeight: 500
              }}>
                Free course
              </span>
            )}
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{fontSize: 28, lineHeight: 1}}>⭐</span>
            <span style={{fontSize: 24, fontWeight: 600, color: '#222'}}>{avgRating}</span>
          </div>
        </div>

        {/* Enroll Button Row */}
        {!isEnrolled && (
          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16}}>
            <button 
              onClick={handleEnroll}
              disabled={enrolling}
              style={{
                background: enrolling ? '#ccc' : 'var(--accent)',
                color: 'white',
                padding: '12px 48px',
                fontSize: 16,
                fontWeight: 600,
                border: 'none',
                borderRadius: 6,
                cursor: enrolling ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(46, 166, 122, 0.3)'
              }}
            >
              {enrolling ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        )}
        
        {isEnrolled && (
          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16}}>
            <span style={{
              color: 'var(--accent)',
              fontSize: 16,
              fontWeight: 600,
              padding: '12px 24px'
            }}>
              ✓ Already Enrolled
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
