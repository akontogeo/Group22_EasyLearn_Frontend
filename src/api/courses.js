import client from './client';

// Helper to unwrap backend response format: { success, data, message }
const unwrap = (response) => response.data?.data || response.data;

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

export const getCourse = (courseId) => {
  return client.get(`/courses/${courseId}`).then(r => unwrap(r));
};

export const getCourseRatings = (courseId) => {
  return client.get(`/courses/${courseId}/ratings`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

export const submitCourseRating = (courseId, payload) => {
  return client.post(`/courses/${courseId}/ratings`, payload).then(r => unwrap(r));
};

export const getQuiz = (courseId, quizId) => {
  return client.get(`/courses/${courseId}/quizzes/${quizId}`).then(r => r.data);
};

export const submitQuiz = (courseId, quizId, payload) => {
  return client.post(`/courses/${courseId}/quizzes/${quizId}/submit`, payload).then(r => r.data);
};
