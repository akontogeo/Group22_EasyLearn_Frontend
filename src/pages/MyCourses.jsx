import React, { useEffect, useState } from 'react';
import { getUserEnrolledCourses, getUserProfile, withdrawFromCourse } from '../api/users';
import { getProgress } from '../api/users';
import CourseCard from '../components/CourseCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './MyCourses.css';

export default function MyCourses() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, coursesRes] = await Promise.all([
          getUserProfile(userId),
          getUserEnrolledCourses(userId),
        ]);

        if (!mounted) return;

        setUser(userRes || null);
        const coursesArray = Array.isArray(coursesRes) ? coursesRes : [];
        setCourses(coursesArray);
        
        // Load progress for each course
        const coursesWithProgressData = await Promise.all(
          coursesArray.map(async (course) => {
            try {
              const progressData = await getProgress(userId, course.courseId);
              return {
                ...course,
                progressPercentage: progressData?.progressPercentage || 0
              };
            } catch (e) {
              return {
                ...course,
                progressPercentage: 0
              };
            }
          })
        );
        
        // Sort by progress descending
        coursesWithProgressData.sort((a, b) => b.progressPercentage - a.progressPercentage);
        setCoursesWithProgress(coursesWithProgressData);
        
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

  function handleRegisterClick() {
    // stub for "Register" / Become premium
    // Will call updateUser in a later change
    alert('Register / Become Premium clicked (not implemented).');
  }

  function handleSeeLeaderboard() {
    // stub for See Leaderboard
    alert('See Leaderboard clicked (not implemented).');
  }

  function handleShowMore() {
    setShowAll(!showAll);
  }

  async function handleWithdraw(courseId, courseTitle) {
    if (!window.confirm(`Are you sure you want to withdraw from "${courseTitle}"? Your progress will be lost.`)) {
      return;
    }
    
    try {
      await withdrawFromCourse(userId, courseId);
      // Reload courses after withdrawal
      const coursesRes = await getUserEnrolledCourses(userId);
      const coursesArray = Array.isArray(coursesRes) ? coursesRes : [];
      setCourses(coursesArray);
      
      // Reload progress for remaining courses
      const coursesWithProgressData = await Promise.all(
        coursesArray.map(async (course) => {
          try {
            const progressData = await getProgress(userId, course.courseId);
            return {
              ...course,
              progressPercentage: progressData?.progressPercentage || 0
            };
          } catch (e) {
            return {
              ...course,
              progressPercentage: 0
            };
          }
        })
      );
      
      coursesWithProgressData.sort((a, b) => b.progressPercentage - a.progressPercentage);
      setCoursesWithProgress(coursesWithProgressData);
    } catch (err) {
      console.error('Failed to withdraw from course', err);
      alert('Failed to withdraw from course.');
    }
  }

  function handleOpenCourse(courseId) {
    navigate(`/users/${userId}/courses/${courseId}`);
  }

  if (loading) {
    return (
      <div className="mycourses-page">
        <div className="container">
          <h1 className="page-title">MY COURSES</h1>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mycourses-page">
        <div className="container">
          <h1 className="page-title">MY COURSES</h1>
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  // Determine which courses to display
  const displayedCourses = showAll ? coursesWithProgress : coursesWithProgress.slice(0, 3);
  const hasMoreThanThree = coursesWithProgress.length > 3;

  return (
    <div className="mycourses-page">
      <div className="container">
        <h1 className="page-title">MY COURSES</h1>

        <div className="main-grid">
          <div className="left-column">
            <div className="courses-list">
              {coursesWithProgress.length === 0 && (
                <div className="empty">You have no enrolled courses.</div>
              )}

              {displayedCourses.map((c) => {
                const id = c.id ?? c.courseId;
                return (
                  <div key={id} className="course-card">
                    <div className="course-left">
                      <div className="thumb-placeholder">
                        {/* simple placeholder icon from first letters */}
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
                      <button
                        className="icon-btn delete"
                        title="Withdraw"
                        onClick={() => handleWithdraw(id, c.title)}
                      >
                        🗑️
                      </button>
                      <button
                        className="icon-btn arrow"
                        title="Open course"
                        onClick={() => handleOpenCourse(id)}
                      >
                        ➜
                      </button>
                    </div>
                  </div>
                );
              })}

              {hasMoreThanThree && (
                <div className="show-more-wrap">
                  <button className="btn-green small" onClick={handleShowMore}>
                    {showAll ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="card premium-card">
              <div className="premium-text">
                <p className="big">
                  Do you want access to ...exclusive lessons ?
                </p>
                <p>Become TODAY a premium user !</p>
              </div>
              <div className="card-actions">
                <button className="btn-green" onClick={handleRegisterClick}>
                  Register
                </button>
              </div>
            </div>

            <div className="card points-card">
              <div className="points-text">
                <p className="points-title">Total points: {user?.points ?? 0}</p>
                <p className="points-sub">Excellent keep going !</p>
              </div>
              <div className="card-actions">
                <button className="btn-green" onClick={handleSeeLeaderboard}>
                  See Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
