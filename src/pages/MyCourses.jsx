import React, { useEffect, useState } from 'react';
import { getUserEnrolledCourses, getUserProfile, withdrawFromCourse } from '../api/users';
import { getProgress } from '../api/users';
import { useNavigate, useParams } from 'react-router-dom';
import './MyCourses.css';

/**
 * MyCourses Component
 * 
 * Displays a comprehensive dashboard for user's enrolled courses with progress tracking,
 * course management features, and promotional content. This component provides a complete
 * learning management interface for students to track and manage their educational journey.
 * 
 * Features:
 * - Course enrollment display with real-time progress percentages
 * - Course withdrawal functionality with user confirmation
 * - Progress-based sorting (courses with highest progress shown first)
 * - Show more/less functionality for large course lists (initially shows 3)
 * - Premium upgrade promotional content and call-to-action
 * - User points display and leaderboard integration
 * - Responsive card-based layout with course thumbnails
 * - Error handling and loading states
 * 
 * @returns {JSX.Element} The user's personalized courses dashboard page
 */
export default function MyCourses() {
  // Extract userId from URL parameters for API calls
  const { userId } = useParams();
  
  // Navigation hook for programmatic routing to course details
  const navigate = useNavigate();
  
  // State management for component data and UI state
  const [user, setUser] = useState(null);                           // User profile information with points
  const [coursesWithProgress, setCoursesWithProgress] = useState([]); // Enriched course data with progress
  const [loading, setLoading] = useState(true);                     // Loading state for API operations
  const [error, setError] = useState(null);                         // Error state for failed operations
  const [showAll, setShowAll] = useState(false);                    // Toggle for course list expansion

  /**
   * Effect to load user data and enrolled courses when component mounts or userId changes
   * Implements cleanup pattern to prevent memory leaks and race conditions
   */
  useEffect(() => {
    let mounted = true; // Flag to prevent state updates on unmounted component

    /**
     * Async function to load user profile and enrolled courses data
     * Uses Promise.all for parallel API calls to improve performance
     */
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile and enrolled courses simultaneously
        const [userRes, coursesRes] = await Promise.all([
          getUserProfile(userId),
          getUserEnrolledCourses(userId),
        ]);

        // Check if component is still mounted before updating state
        if (!mounted) return;

        setUser(userRes || null);
        // Ensure courses data is always an array to prevent map errors
        const coursesArray = Array.isArray(coursesRes) ? coursesRes : [];
        
        // Load progress data for all courses and update state
        await loadCoursesWithProgress(coursesArray);
        
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        if (mounted) setError('Failed to load dashboard data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [userId]);

  // Load courses with progress data
  async function loadCoursesWithProgress(coursesArray) {
    const coursesWithProgressData = await Promise.all(
      coursesArray.map(async (course) => {
        try {
          const progressData = await getProgress(userId, course.courseId);
          return { ...course, progressPercentage: progressData?.progressPercentage || 0 };
        } catch (e) {
          return { ...course, progressPercentage: 0 };
        }
      })
    );
    coursesWithProgressData.sort((a, b) => b.progressPercentage - a.progressPercentage);
    setCoursesWithProgress(coursesWithProgressData);
  }

  // Simple handlers
  const handleRegisterClick = () => alert('Register / Become Premium clicked (not implemented).');
  const handleSeeLeaderboard = () => alert('See Leaderboard clicked (not implemented).');
  const handleShowMore = () => setShowAll(!showAll);
  const handleOpenCourse = (courseId) => navigate(`/users/${userId}/courses/${courseId}`);

  // Handle course withdrawal
  async function handleWithdraw(courseId, courseTitle) {
    if (!window.confirm(`Are you sure you want to withdraw from "${courseTitle}"? Your progress will be lost.`)) return;
    
    try {
      await withdrawFromCourse(userId, courseId);
      const coursesRes = await getUserEnrolledCourses(userId);
      await loadCoursesWithProgress(Array.isArray(coursesRes) ? coursesRes : []);
    } catch (err) {
      console.error('Failed to withdraw from course', err);
      alert('Failed to withdraw from course.');
    }
  }

  // Early returns for loading and error states
  if (loading) return (
    <div className="mycourses-page"><div className="container">
      <h1 className="page-title" data-cy="dashboard-header">MY COURSES</h1>
      <div className="loading">Loading...</div>
    </div></div>
  );

  if (error) return (
    <div className="mycourses-page"><div className="container">
      <h1 className="page-title" data-cy="dashboard-header">MY COURSES</h1>
      <div className="error">{error}</div>
    </div></div>
  );

  // Determine which courses to display
  const displayedCourses = showAll ? coursesWithProgress : coursesWithProgress.slice(0, 3);
  const hasMoreThanThree = coursesWithProgress.length > 3;

  return (
    <div className="mycourses-page">
      <div className="container">
        <h1 className="page-title" data-cy="dashboard-header">MY COURSES</h1>

        <div className="main-grid">
          <div className="left-column">
            <div className="courses-list" data-cy="my-courses-section">
              {coursesWithProgress.length === 0 && (
                <div className="empty">You have no enrolled courses.</div>
              )}

              {displayedCourses.map((c) => {
                const id = c.id ?? c.courseId;
                return (
                  <div key={id} className="course-card" data-cy="my-course-card">
                    <div className="course-left">
                      <div className="thumb-placeholder">
                        {c.title ? c.title.split(' ').slice(0, 2).map(w => w[0]).join('') : 'C'}
                      </div>
                      <div className="course-info">
                        <div className="course-title">{c.title}</div>
                        <div className="course-desc">{c.description || c.shortDescription}</div>
                        <div className="course-meta">
                          <span className="meta-pill">{c.category}</span>
                          <span className="meta-pill">{c.difficulty}</span>
                          <span className="meta-pill">Progress: {c.progressPercentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="course-actions">
                      <button className="icon-btn delete" title="Withdraw" onClick={() => handleWithdraw(id, c.title)}>🗑️</button>
                      <button className="icon-btn arrow" title="Open course" onClick={() => handleOpenCourse(id)}>➜</button>
                    </div>
                  </div>
                );
              })}

              {hasMoreThanThree && (
                <div className="show-more-wrap">
                  <button className="btn-green small" onClick={handleShowMore} data-cy="dashboard-show-more">
                    {showAll ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="card premium-card">
              <div className="premium-text">
                <p className="big">Do you want access to ...exclusive lessons ?</p>
                <p>Become TODAY a premium user !</p>
              </div>
              <div className="card-actions">
                <button className="btn-green" onClick={handleRegisterClick}>Register</button>
              </div>
            </div>

            <div className="card points-card">
              <div className="points-text">
                <p className="points-title">Total points: {user?.points ?? 0}</p>
                <p className="points-sub">Excellent keep going !</p>
              </div>
              <div className="card-actions">
                <button className="btn-green" onClick={handleSeeLeaderboard}>See Leaderboard</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
