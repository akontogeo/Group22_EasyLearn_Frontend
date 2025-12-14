import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Home page - search & filter courses
import { searchCourses } from '../api/courses';
import HomeBanner from '../components/HomeBanner';
import FiltersPanel from '../components/FiltersPanel';
import CourseCard from '../components/CourseCard';

export default function Home(){
  // State for courses, loading, search params, and filters
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [hasSearchOrFilters, setHasSearchOrFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  // Fetch courses with applied filters
  const load = async (filterParams = {}) => {
    setLoading(true);
    try{
      // Merge filter params with URL search params
      const params = { ...filterParams };
      
      // Check for keyword in URL params
      const keyword = searchParams.get('keyword');
      if(keyword) {
        params.keyword = keyword;
      }
      
      // Store current filters for reset
      setCurrentFilters(filterParams);
      
      const data = await searchCourses(params);
      setCourses(Array.isArray(data) ? data : []);
      
      // Check if any search or filters are applied
      setHasSearchOrFilters(Object.keys(params).length > 0);
    }catch(e){
      console.error('Search error:', e);
      setCourses([]);
    }finally{
      setLoading(false);
    }
  }

  // Load courses on mount and when search params or filters change
  useEffect(()=>{
    load(currentFilters);
  },[searchParams]);

  // Handle filter changes from sidebar
  const handleFilterApply = (filterParams) => {
    load(filterParams);
  };

  // Get display title
  const getDisplayTitle = () => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      return `Search Results for "${decodeURIComponent(keyword)}"`;
    }
    return 'Filtered Courses';
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
          {/* Show banner only when no search or filters are applied */}
          {!hasSearchOrFilters && <HomeBanner />}
          
          {/* Show course results when search or filters are applied */}
          {hasSearchOrFilters && (
            <div>
              <h2 style={{
                marginBottom: '20px',
                fontSize: '24px',
                fontWeight: 600,
                color: '#222'
              }}>
                {getDisplayTitle()}
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
                    No courses found. Try adjusting your filters or search terms.
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
