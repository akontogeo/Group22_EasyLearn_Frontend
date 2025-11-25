import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchCourses } from '../api/courses';
import CourseCard from '../components/CourseCard';
import SearchFilters from '../components/SearchFilters';
import { useAuth } from '../context/AuthContext';

export default function Home(){
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
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
  },[searchParams]);

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
      </div>
    </div>
  )
}
