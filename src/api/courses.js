import client from './client';

// Helper to unwrap backend response format: { success, data, message }
const unwrap = (response) => response.data?.data || response.data;

// --- Mock data for development/fallback ---
const MOCK_COURSES = [
  { 
    courseId: 1, 
    title: 'Introduction to Python Programming', 
    description: 'Learn Python basics including variables, loops, and functions',
    category: 'Programming', 
    difficulty: 'Beginner', 
    premium: false, 
    courseImage: '', 
    totalPoints: 100 
  },
  { 
    courseId: 2, 
    title: 'Advanced React Patterns', 
    description: 'Master hooks, context, performance optimization, and design patterns in React',
    category: 'Programming', 
    difficulty: 'Advanced', 
    premium: true, 
    courseImage: '', 
    totalPoints: 200 
  },
  { 
    courseId: 3, 
    title: 'Digital Marketing 101', 
    description: 'Learn SEO, PPC advertising, and social media marketing fundamentals',
    category: 'Digital Marketing', 
    difficulty: 'Beginner', 
    premium: false, 
    courseImage: '', 
    totalPoints: 80 
  },
  { 
    courseId: 4, 
    title: 'Project Management Essentials', 
    description: 'Master Agile and Scrum methodologies for effective project delivery',
    category: 'Project Management', 
    difficulty: 'Intermediate', 
    premium: false, 
    courseImage: '', 
    totalPoints: 120 
  },
  { 
    courseId: 5, 
    title: 'Data Science with Python', 
    description: 'Learn Pandas, NumPy, scikit-learn, and machine learning basics',
    category: 'Data Science and Machine Learning', 
    difficulty: 'Intermediate', 
    premium: true, 
    courseImage: '', 
    totalPoints: 220 
  },
  { 
    courseId: 6, 
    title: 'Economics Basics', 
    description: 'Understanding microeconomics and macroeconomics principles',
    category: 'Economics and Finance', 
    difficulty: 'Beginner', 
    premium: false, 
    courseImage: '', 
    totalPoints: 70 
  },
  { 
    courseId: 7, 
    title: 'JavaScript Fundamentals', 
    description: 'Core JavaScript concepts for web development',
    category: 'Programming', 
    difficulty: 'Beginner', 
    premium: false, 
    courseImage: '', 
    totalPoints: 110 
  },
  { 
    courseId: 8, 
    title: 'Advanced Financial Analysis', 
    description: 'Deep dive into financial modeling and investment strategies',
    category: 'Economics and Finance', 
    difficulty: 'Advanced', 
    premium: true, 
    courseImage: '', 
    totalPoints: 250 
  },
  { 
    courseId: 9, 
    title: 'Content Marketing Strategy', 
    description: 'Create compelling content that drives engagement and conversions',
    category: 'Digital Marketing', 
    difficulty: 'Intermediate', 
    premium: false, 
    courseImage: '', 
    totalPoints: 130 
  },
  { 
    courseId: 10, 
    title: 'Machine Learning Algorithms', 
    description: 'Deep learning, neural networks, and advanced ML techniques',
    category: 'Data Science and Machine Learning', 
    difficulty: 'Advanced', 
    premium: true, 
    courseImage: '', 
    totalPoints: 280 
  }
];

// Use mock data for development
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || true;

// Filter mock courses based on parameters
const filterMockCourses = (params = {}) => {
  params = params || {};
  
  let results = MOCK_COURSES.slice();
  
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
  
  // Filter by category (exact match)
  if (params.category) {
    results = results.filter(c => String(c.category) === String(params.category));
  }
  
  // Filter by difficulty (exact match)
  if (params.difficulty) {
    results = results.filter(c => String(c.difficulty) === String(params.difficulty));
  }
  
  // Filter by premium status
  if (params.Premium !== undefined && params.Premium !== '') {
    const premiumBool = (params.Premium === true || params.Premium === 'true' || params.Premium === 1);
    results = results.filter(c => Boolean(c.premium) === premiumBool);
  }
  
  return results;
};

// GET /courses
export const searchCourses = (params) => {
  if (USE_MOCK) {
    // Simulate async call with mock data
    return Promise.resolve(filterMockCourses(params));
  }
  
  return client.get('/courses', { params })
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(err => {
      console.error('Search courses error:', err);
      // Fallback to mock on API error
      return filterMockCourses(params);
    });
};

// GET /courses/{courseId}
export const getCourse = (courseId) => {
  if (USE_MOCK) {
    const course = MOCK_COURSES.find(c => Number(c.courseId) === Number(courseId));
    return Promise.resolve(course || null);
  }
  
  return client.get(`/courses/${courseId}`)
    .then(r => unwrap(r))
    .catch(() => {
      // Fallback to mock
      return MOCK_COURSES.find(c => Number(c.courseId) === Number(courseId)) || null;
    });
};

// GET /courses/{courseId}/ratings
export const getCourseRatings = (courseId) => {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }
  
  return client.get(`/courses/${courseId}/ratings`)
    .then(r => {
      const data = unwrap(r);
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);
};

// POST /courses/{courseId}/ratings
export const submitCourseRating = (courseId, payload) => {
  if (USE_MOCK) {
    return Promise.resolve({ success: true });
  }
  
  return client.post(`/courses/${courseId}/ratings`, payload).then(r => unwrap(r));
};
