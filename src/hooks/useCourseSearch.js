import { useState, useEffect } from 'react';
import { searchCourses } from '../api/courses';

export const useCourseSearch = (initialParams = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (params = initialParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchCourses(params);
      setCourses(data || []);
    } catch (e) {
      setError(e.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return { courses, loading, error, search };
};
