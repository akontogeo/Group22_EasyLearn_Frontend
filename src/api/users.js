// API functions for user-related operations
import client from './client';

// Helper to unwrap backend response format: { success, data, message }
const unwrap = (response) => response.data?.data || response.data;

// Fetch user profile information
export const getUserProfile = (userId) => {
  return client.get(`/users/${userId}`).then(r => unwrap(r));
};

// Update user profile
export const updateUser = (userId, payload) => {
  return client.put(`/users/${userId}`, payload).then(r => unwrap(r));
};

// Get all courses enrolled by a user
export const getUserEnrolledCourses = (userId) => {
  return client.get(`/users/${userId}/courses`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

// POST /users/{userId}/courses
export const enrollInCourse = (userId, courseId) => {
  return client.post(`/users/${userId}/courses`, { courseId }).then(r => unwrap(r));
};

// DELETE /users/{userId}/courses/{courseId}
export const withdrawFromCourse = (userId, courseId) => {
  return client.delete(`/users/${userId}/courses/${courseId}`);
};

// GET /users/{userId}/courses/{courseId}/progress
export const getProgress = (userId, courseId) => {
  return client.get(`/users/${userId}/courses/${courseId}/progress`).then(r => unwrap(r));
};
