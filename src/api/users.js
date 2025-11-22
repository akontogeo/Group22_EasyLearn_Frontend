import client from './client';

// Helper to unwrap backend response format: { success, data, message }
const unwrap = (response) => response.data?.data || response.data;

export const getUserProfile = (userId) => {
  return client.get(`/users/${userId}`).then(r => unwrap(r));
};

export const updateUser = (userId, payload) => {
  return client.put(`/users/${userId}`, payload).then(r => unwrap(r));
};

export const enrollInCourse = (userId, courseId) => {
  return client.post(`/users/${userId}/courses`, { courseId }).then(r => unwrap(r));
};

export const withdrawFromCourse = (userId, courseId) => {
  return client.delete(`/users/${userId}/courses/${courseId}`);
};

export const getRecommendations = (userId) => {
  return client.get(`/users/${userId}/recommendations`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

export const getProgress = (userId, courseId) => {
  return client.get(`/users/${userId}/courses/${courseId}/progress`).then(r => unwrap(r));
};

export const getUserEnrolledCourses = (userId) => {
  return client.get(`/users/${userId}/courses`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

// Leaderboard endpoint doesn't exist in backend - mock it for now
export const getLeaderboard = () => {
  return client.get('/users')
    .then(r => {
      const users = unwrap(r) || [];
      // Calculate leaderboard from users (mock implementation)
      return users
        .map((u, i) => ({
          username: u.username,
          totalPoints: (u.enrolledCourses?.length || 0) * 50, // mock points
          rank: i + 1
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((u, i) => ({ ...u, rank: i + 1 }));
    })
    .catch(() => []);
};
