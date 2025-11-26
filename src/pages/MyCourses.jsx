import React, { useEffect, useState } from 'react';
import { getUserEnrolledCourses, getUserProfile, withdrawFromCourse } from '../api/users';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import './MyCourses.css';


export default function MyCourses() {
  const userId = 1; // hardcoded for now
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setCourses(Array.isArray(coursesRes) ? coursesRes : []);
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
    alert('Show more clicked (not implemented).');
  }

  function handleDelete(courseId) {
    // stub for deleting / unenroll
    alert(`Delete course ${courseId} (not implemented).`);
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

  return (
    <div className="mycourses-page">
      <div className="container">
        <h1 className="page-title">MY COURSES</h1>

        <div className="main-grid">
          <div className="left-column">
            <div className="courses-list">
              {courses.length === 0 && (
                <div className="empty">You have no enrolled courses.</div>
              )}

              {courses.map((c) => {
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
                        <div className="course-desc">{c.shortDescription}</div>
                        <div className="course-meta">
                          <span className="meta-pill">{c.category}</span>
                          <span className="meta-pill">{c.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="course-actions">
                      <button
                        className="icon-btn delete"
                        title="Remove"
                        onClick={() => handleDelete(id)}
                      >
                        🗑️
                      </button>
                      <button
                        className="icon-btn arrow"
                        title="Open course"
                        onClick={() => alert(`Open course ${id} (not implemented).`)}
                      >
                        ➜
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="show-more-wrap">
                <button className="btn-green small" onClick={handleShowMore}>
                  Show More
                </button>
              </div>
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

        <h2 className="recommend-title">We recommend:</h2>

        <div className="recommend-list">
          <div className="recommend-card">
            <div className="rec-left">
              <div className="rec-badge">JS</div>
            </div>
            <div className="rec-body">
              <div className="rec-title">JavaScript Part I</div>
              <div className="rec-desc">Learn the fundamentals of JavaScript, the language of the web!</div>
            </div>
            <div className="rec-actions">
              <button className="btn-green small">See More</button>
            </div>
          </div>

          <div className="recommend-card">
            <div className="rec-left">
              <div className="rec-badge">C</div>
            </div>
            <div className="rec-body">
              <div className="rec-title">C Part I</div>
              <div className="rec-desc">Learn the fundamentals of C and low-level programming concepts.</div>
            </div>
            <div className="rec-actions">
              <button className="btn-green small">See More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}