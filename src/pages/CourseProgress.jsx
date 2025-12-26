import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, submitCourseReview } from '../api/courses';
import { getProgress, getUserEnrolledCourses, enrollInCourse, withdrawFromCourse } from '../api/users';
import { useAuth } from '../context/AuthContext';
import RatingDialog from '../components/RatingDialog';
import LessonsList from '../components/LessonsList';

/**
 * CourseProgress - Main course learning interface with lessons, progress tracking, and rating
 */
export default function CourseProgress(){
  const { userId, courseId } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  // Shared styles
  const cardStyle = { background: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' };
  const buttonStyle = { border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };
  
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function load(){
      try{
        setLoading(true);
        const { getUserProfile } = await import('../api/users');
        const profile = await getUserProfile(userId);
        setUser({ ...profile, userId: Number(userId) });
        
        const courseData = await getCourse(courseId);
        setCourse(courseData);
        
        const enrolledCourses = await getUserEnrolledCourses(userId);
        const enrolled = enrolledCourses.some(c => Number(c.id) === Number(courseId));
        setIsEnrolled(enrolled);
        
        if (enrolled) {
          try {
            const progressData = await getProgress(userId, courseId);
            setProgress(progressData);
          } catch (e) {
            setProgress({ progressPercentage: 0 });
          }
        }
      }catch(e){
        console.error('Failed to load course progress:', e);
      }finally{
        setLoading(false);
      }
    }
    load();
  }, [userId, courseId, setUser]);

  if(loading) return <div className="card">Loading...</div>;
  if(!course) return <div className="card">Course not found</div>;

  // Generate lessons and calculate progress
  const lessons = course.quizList?.map((quizId, index) => ({ id: quizId, number: index + 1, title: `Lesson ${index + 1}`, hasQuiz: true, quizId })) || [];
  const progressPercentage = progress?.progressPercentage || 0;

  // Handle course enrollment
  async function handleEnroll() {
    if (enrolling) return;
    try {
      setEnrolling(true);
      await enrollInCourse(userId, courseId);
      setIsEnrolled(true);
      // Load initial progress after enrollment
      const progressData = await getProgress(userId, courseId);
      setProgress(progressData);
    } catch (e) {
      console.error('Failed to enroll:', e);
    } finally {
      setEnrolling(false);
    }
  }

  // Handle course withdrawal with confirmation
  async function handleWithdraw() {
    if (!window.confirm(`Are you sure you want to withdraw from "${course.title}"? Your progress will be lost.`)) {
      return;
    }
    try {
      await withdrawFromCourse(userId, courseId);
      navigate(`/courses/${courseId}`);
    } catch (e) {
      console.error('Failed to withdraw:', e);
    }
  }

  // Submit course rating and review
  async function handleSubmitRating() {
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setSubmittingRating(true);
    
    try {
      await submitCourseReview(courseId, {
        userId: Number(userId),
        stars: selectedRating,
        comment: ratingComment
      });
      
      console.log('Review submitted successfully');
      
      // Show success message
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      
      // Close dialog and reset form
      setShowRatingDialog(false);
      setSelectedRating(0);
      setRatingComment('');
      setSubmittingRating(false);
    } catch (e) {
      console.error('Failed to submit rating:', e);
      alert('Failed to submit review. Please try again.');
      setSubmittingRating(false);
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      background: '#f5f5f5',
      padding: '24px 32px'
    }}>
      <RatingDialog
        show={showRatingDialog}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        ratingComment={ratingComment}
        setRatingComment={setRatingComment}
        submittingRating={submittingRating}
        onSubmit={handleSubmitRating}
        onCancel={() => {
          setShowRatingDialog(false);
          setSelectedRating(0);
          setRatingComment('');
        }}
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={cardStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div style={{width: 200, height: 200, background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid #e0e0e0'}}>
              {course.courseImage ? (
                <img src={course.courseImage} alt={course.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <div style={{fontSize: 72, fontWeight: 'bold', color: '#999'}}>
                  {course.title?.slice(0,2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Course Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                margin: '0 0 16px 0',
                fontSize: '32px',
                fontWeight: 600,
                color: '#222'
              }}>
                {course.title} <span style={{ color: '#999', fontSize: '24px' }}>Part I</span>
              </h1>
            </div>
          </div>

          <LessonsList lessons={lessons} course={course} isEnrolled={isEnrolled} />

          {/* Action Buttons Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            {/* Left side: Enroll or Download Material */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  style={{
                    background: enrolling ? '#ccc' : '#2ea67a',
                    color: 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: enrolling ? 'not-allowed' : 'pointer'
                  }}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                </button>
              ) : (
                <>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#2ea67a',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px'
                  }}>
                    <span style={{ fontSize: '24px' }}>⬇</span>
                    Download material
                  </button>
                  <button onClick={handleWithdraw} style={{...buttonStyle, background: '#dc3545', color: 'white'}}>
                    Withdraw
                  </button>
                </>
              )}
            </div>

            {/* Right side: Progress Bar */}
            {isEnrolled && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ textAlign: 'right' }}>
                  <div data-cy="progress-indicator" style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    My Progress: {progressPercentage}% completed
                  </div>
                  <div style={{
                    width: '200px',
                    height: '24px',
                    background: '#e0e0e0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${progressPercentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #2ea67a 0%, #1e7a56 100%)',
                      transition: 'width 0.3s'
                    }}></div>
                    <span style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: progressPercentage > 50 ? 'white' : '#333'
                    }}>
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons - Only show if enrolled */}
          {isEnrolled && (
          <div style={{
            display: 'flex',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <button
              data-cy="rate-button"
              onClick={() => setShowRatingDialog(true)}
              style={{
                background: '#2ea67a',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⭐</span>
              Rate
            </button>

            <div style={{
              flex: 1,
              background: '#f0f0f0',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                You got stucked?<br/>
                Don't worry! Chat with others!
              </span>
              <button style={{
                background: '#2ea67a',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                FORUM
              </button>
            </div>
          </div>
          )}

          {/* Review Success Message */}
          {reviewSuccess && (
            <div data-cy="review-success" style={{ 
              marginTop: 16, 
              padding: 12, 
              background: '#d4edda', 
              color: '#155724', 
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500
            }}>
              Review submitted successfully!
            </div>
          )}

          {/* Review List - placeholder για testing */}
          <div data-cy="review-list" style={{ marginTop: 16, display: 'none' }}>
            {/* Reviews would be listed here */}
          </div>
        </div>
      </div>
    </div>
  );
}
