import client from './client';

// Helper to unwrap backend response format: { success, data, message }
const unwrap = (response) => response.data?.data || response.data;

// GET /courses
export const searchCourses = (params) => {
  return client.get('/courses', { params })
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(err => {
      console.error('Search courses error:', err);
      return [];
    });
};

// GET /courses/{courseId}
export const getCourse = (courseId) => {
  return client.get(`/courses/${courseId}`).then(r => unwrap(r));
};

// GET /courses/{courseId}/reviews
export const getCourseReviews = (courseId) => {
  return client.get(`/courses/${courseId}/reviews`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

// POST /courses/{courseId}/reviews
export const submitCourseReview = (courseId, payload) => {
  return client.post(`/courses/${courseId}/reviews`, payload).then(r => unwrap(r));
};
