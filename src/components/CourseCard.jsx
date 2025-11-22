import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({course, actions}){
  return (
    <div className="card" style={{display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:80,height:80,background:'#eee',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <strong>{course?.title?.slice(0,2) || 'C'}</strong>
      </div>
      <div style={{flex:1}}>
        <h3 style={{margin:'0 0 6px 0'}}>{course.title}</h3>
        <p style={{margin:0,color:'#666'}}>{course.description?.slice(0,120)}</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <Link to={`/courses/${course.courseId}`} className="btn">See More</Link>
        {actions}
      </div>
    </div>
  )
}
