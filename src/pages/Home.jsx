import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchCourses } from '../api/courses';
import HomeBanner from '../components/HomeBanner';
import FiltersPanel from '../components/FiltersPanel';
import CourseCard from '../components/CourseCard';

export default function Home(){
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [hasFilters, setHasFilters] = useState(false);

  const load = async (params = {}) => {
    setLoading(true);
    try{
      // Check for keyword in URL params
      const keyword = searchParams.get('keyword');
      if(keyword) params.keyword = keyword;
      
      const data = await searchCourses(params);
      setCourses(Array.isArray(data) ? data : []);
      
      // Check if any filters are applied
      setHasFilters(Object.keys(params).length > 0);
    }catch(e){
      console.error('Search error:', e);
      setCourses([]);
    }finally{
      setLoading(false);
    }
  }

  // Load courses on mount and when search params change
  useEffect(()=>{
    load();
  },[searchParams]);

  // Handle filter changes from sidebar
  const handleFilterApply = (filterParams) => {
    load(filterParams);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      background: '#f5f5f5',
      padding: '24px 32px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left Sidebar - Filters */}
        <div>
          <FiltersPanel onApply={handleFilterApply} />
        </div>

        {/* Main Content Area */}
        <div>
          {/* Show banner only when no filters/search are applied */}
          {!hasFilters && <HomeBanner />}
          
          {/* Show course results when filters are applied */}
          {hasFilters && (
            <div>
              <h2 style={{
                marginBottom: '20px',
                fontSize: '24px',
                fontWeight: 600,
                color: '#222'
              }}>
                {searchParams.get('keyword') ? `Search Results for "${searchParams.get('keyword')}"` : 'Filtered Courses'}
              </h2>
              
              {loading && (
                <div style={{
                  background: 'white',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  Loading courses...
                </div>
              )}
              
              {!loading && courses.length === 0 && (
                <div style={{
                  background: 'white',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#666', margin: 0 }}>
                    No courses found. Try adjusting your filters.
                  </p>
                </div>
              )}
              
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {courses.map(c => (
                  <CourseCard 
                    key={c.courseId} 
                    course={c} 
                    actions={<span/>} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
