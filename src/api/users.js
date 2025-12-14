import client from './client';

// Extract user data from API response wrapper
const unwrap = (response) => response.data?.data || response.data;

// Fetch user profile by ID
export const getUserProfile = (userId) => {
  return client.get(`/users/${userId}`).then(r => unwrap(r));
};

// Update user profile data
export const updateUser = (userId, payload) => {
  return client.put(`/users/${userId}`, payload).then(r => unwrap(r));
};

// Get list of courses user is enrolled in
export const getUserEnrolledCourses = (userId) => {
  return client.get(`/users/${userId}/courses`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

// Enroll user in a course
export const enrollInCourse = (userId, courseId) => {
  return client.post(`/users/${userId}/courses`, { courseId }).then(r => unwrap(r));
};

// Withdraw user from an enrolled course
export const withdrawFromCourse = (userId, courseId) => {
  return client.delete(`/users/${userId}/courses/${courseId}`);
};

// Fetch user's progress in a specific course
export const getProgress = (userId, courseId) => {
  return client.get(`/users/${userId}/courses/${courseId}/progress`).then(r => unwrap(r));
};
