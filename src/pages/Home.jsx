import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchCourses } from '../api/courses';
import { getRecommendations } from '../api/users';
import CourseCard from '../components/CourseCard';
import SearchFilters from '../components/SearchFilters';
import { useAuth } from '../context/AuthContext';

export default function Home(){
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const load = async (params = {}) =>{
    setLoading(true);
    try{
      const keyword = searchParams.get('keyword');
      if(keyword) params.keyword = keyword;
      const data = await searchCourses(params);
      // Ensure data is always an array
      setCourses(Array.isArray(data) ? data : []);
    }catch(e){
      console.error('Search error:', e);
      setCourses([]);
    }finally{setLoading(false)}
  }

  useEffect(()=>{
    load();
    if(user){
      getRecommendations(user.userId).then(r => setRecommendations(Array.isArray(r) ? r : [])).catch(() => {});
    }
  },[user, searchParams]);

  return (
    <div className="grid">
      <div>
        <h2>Results</h2>
        {loading && <p>Loading...</p>}
        {!loading && courses.length===0 && <div className="card">No results. Try searching.</div>}
        <div style={{display:'grid',gap:12,marginTop:12}}>
          {Array.isArray(courses) && courses.map(c=> <CourseCard key={c.courseId} course={c} actions={<span/>} />)}
        </div>
      </div>
      <div>
        <SearchFilters onApply={(params)=>load(params)} />
        <div style={{height:12}} />
        <div className="card">
          <h4>We recommend</h4>
          {recommendations.length === 0 && <p>Personalized content will appear here.</p>}
          {Array.isArray(recommendations) && recommendations.slice(0,3).map(c => (
            <div key={c.courseId} style={{padding:'8px 0',borderBottom:'1px solid #eee'}}>
              {c.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
