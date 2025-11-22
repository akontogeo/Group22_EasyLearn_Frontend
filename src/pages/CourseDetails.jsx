import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, getCourseRatings, submitCourseRating } from '../api/courses';
import { enrollInCourse, getProgress, withdrawFromCourse } from '../api/users';
import { useAuth } from '../context/AuthContext';

export default function CourseDetails(){
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [progress, setProgress] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const { user, refreshUser } = useAuth();

  useEffect(()=>{
    async function load(){
      try{
        const c = await getCourse(id);
        setCourse(c);
        const r = await getCourseRatings(id);
        setRatings(r || []);
        if(user){
          const p = await getProgress(user.userId, id);
          setProgress(p);
        }
      }catch(e){console.error(e)}
    }
    load();
  },[id, user]);

  const handleEnroll = async () => {
    if(!user) return alert('Please sign in');
    try{
      await enrollInCourse(user.userId, Number(id));
      alert('Enrolled successfully!');
      // Reload course and refresh user to update enrolled courses
      const c = await getCourse(id);
      setCourse(c);
      if (refreshUser) refreshUser();
    }catch(e){
      console.error('Enroll error:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message;
      alert(`Enroll failed: ${errorMsg}`);
    }
  }

  const handleWithdraw = async () => {
    if(!user) return;
    try{
      await withdrawFromCourse(user.userId, Number(id));
      alert('Withdrawn successfully');
      if (refreshUser) refreshUser();
    }catch(e){alert('Withdraw failed')}
  }

  const handleRatingSubmit = async () => {
    if(!user) return alert('Please sign in');
    try{
      await submitCourseRating(Number(id), { userId: user.userId, stars: newRating });
      alert('Rating submitted!');
      const r = await getCourseRatings(id);
      setRatings(r || []);
    }catch(e){
      alert('Failed to submit rating');
    }
  }

  const avgRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(1)
    : 'N/A';

  return (
    <div>
      {!course && <div className="card">Loading course...</div>}
      {course && (
        <>
          <div className="card" style={{marginBottom:16}}>
            <div style={{display:'flex',alignItems:'start',gap:16}}>
              <div style={{width:120,height:120,background:'#eee',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:'bold'}}>
                {course.title?.slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <h1 style={{margin:'0 0 8px 0'}}>{course.title}</h1>
                <p style={{color:'#666',margin:'0 0 12px 0'}}>{course.description}</p>
                <div style={{display:'flex',gap:12,alignItems:'center',fontSize:14}}>
                  <span><strong>Category:</strong> {course.category}</span>
                  <span><strong>Difficulty:</strong> {course.difficulty}</span>
                  <span><strong>Rating:</strong> ⭐ {avgRating}</span>
                  {course.premium && <span style={{background:'var(--accent)',color:'white',padding:'2px 8px',borderRadius:4}}>Premium</span>}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:16}}>
              <button className="btn" onClick={handleEnroll}>Enroll</button>
              <button onClick={handleWithdraw} style={{padding:'8px 12px',borderRadius:6,border:'1px solid #ccc',background:'white',cursor:'pointer'}}>Withdraw</button>
            </div>
            {progress && (
              <div style={{marginTop:12,padding:12,background:'#f9f9f9',borderRadius:6}}>
                <strong>Your Progress:</strong> {progress.progressPercentage}%
              </div>
            )}
          </div>

          <div className="card">
            <h3>Ratings ({ratings.length})</h3>
            {ratings.length===0 && <p>No ratings yet. Be the first!</p>}
            <div style={{display:'grid',gap:8,marginBottom:16}}>
              {ratings.slice(0,10).map(r=>(
                <div key={r.ratingId} style={{padding:8,background:'#f9f9f9',borderRadius:4}}>
                  {'⭐'.repeat(r.stars)} ({r.stars}/5)
                </div>
              ))}
            </div>
            <div style={{borderTop:'1px solid #eee',paddingTop:16}}>
              <h4>Submit your rating</h4>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <select value={newRating} onChange={(e)=>setNewRating(Number(e.target.value))} style={{padding:8}}>
                  <option value={1}>1 star</option>
                  <option value={2}>2 stars</option>
                  <option value={3}>3 stars</option>
                  <option value={4}>4 stars</option>
                  <option value={5}>5 stars</option>
                </select>
                <button className="btn" onClick={handleRatingSubmit}>Submit Rating</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
