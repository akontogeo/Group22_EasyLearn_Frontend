import client from './client';

// Helper to unwrap backend response format: { success, data, message }
const unwrap = (response) => response.data?.data || response.data;

// Client-side filtering of courses
const filterCourses = (courses, params = {}) => {
  params = params || {};
  
  let results = Array.isArray(courses) ? courses.slice() : [];
  
  // Search by keyword in title, description, or category (case-insensitive)
  if (params.keyword || params.q) {
    const searchTerm = (params.keyword || params.q || '').toString().trim().toLowerCase();
    if (searchTerm) {
      results = results.filter(course => {
        const titleMatch = (course.title || '').toLowerCase().includes(searchTerm);
        const descMatch = (course.description || '').toLowerCase().includes(searchTerm);
        const catMatch = (course.category || '').toLowerCase().includes(searchTerm);
        return titleMatch || descMatch || catMatch;
      });
    }
  }
  
  // Filter by category (case-insensitive match)
  if (params.category) {
    const categoryFilter = String(params.category).toLowerCase();
    results = results.filter(c => 
      String(c.category || '').toLowerCase() === categoryFilter
    );
  }
  
  // Filter by difficulty (case-insensitive match)
  if (params.difficulty) {
    const difficultyFilter = String(params.difficulty).toLowerCase();
    results = results.filter(c => 
      String(c.difficulty || '').toLowerCase() === difficultyFilter
    );
  }
  
  // Filter by premium status
  if (params.Premium !== undefined && params.Premium !== '') {
    const premiumBool = params.Premium === true || params.Premium === 'true' || params.Premium === 1;
    results = results.filter(c => Boolean(c.premium) === premiumBool);
  }
  
  return results;
};

// GET /courses - Fetch from backend and apply client-side filtering
export const searchCourses = (params) => {
  return client.get('/courses')
    .then(r => {
      const data = unwrap(r);
      const courses = Array.isArray(data) ? data : [];
      // Apply client-side filtering with params
      return filterCourses(courses, params);
    })
    .catch(err => {
      console.error('Search courses error:', err);
      return [];
    });
};

// GET /courses/{courseId}
export const getCourse = (courseId) => {
  return client.get(`/courses/${courseId}`)
    .then(r => unwrap(r))
    .catch(err => {
      console.error('Get course error:', err);
      return null;
    });
};

// GET /courses/{courseId}/ratings
export const getCourseRatings = (courseId) => {
  return client.get(`/courses/${courseId}/ratings`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(err => {
      console.error('Get ratings error:', err);
      return [];
    });
};

// POST /courses/{courseId}/ratings
export const submitCourseRating = (courseId, payload) => {
  return client.post(`/courses/${courseId}/ratings`, payload)
    .then(r => unwrap(r))
    .catch(err => {
      console.error('Submit rating error:', err);
      throw err;
    });
};
