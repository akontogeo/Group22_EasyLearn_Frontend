import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Course card component - displays a course with thumbnail, title, and actions
 * Used in search results and course listings
 */
export default function CourseCard({course, actions}){
  return (
    // Main card container with data-cy for E2E testing
    <div className="card" data-cy="course-card" style={{display:'flex',alignItems:'center',gap:12}}>
      {/* Course thumbnail - shows first 2 letters of title */}
      <div style={{width:80,height:80,background:'#eee',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <strong>{course?.title?.slice(0,2) || 'C'}</strong>
      </div>
      
      {/* Course info section */}
      <div style={{flex:1}}>
        <h3 style={{margin:'0 0 6px 0'}}>{course.title}</h3>
        {/* Description truncated to 120 characters */}
        <p style={{margin:0,color:'#666'}}>{course.description?.slice(0,120)}</p>
      </div>
      
      {/* Action buttons - See More link and optional custom actions */}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <Link to={`/courses/${course.courseId}`} className="btn" data-cy="see-more-course">See More</Link>
        {actions}
      </div>
    </div>
  )
}
