import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RatingDialog from '../components/RatingDialog';
import LessonsList from '../components/LessonsList';
import CourseHeader from '../components/CourseHeader';
import CourseActions from '../components/CourseActions';
import ProgressBar from '../components/ProgressBar';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useCourseRating } from '../hooks/useCourseRating';
import './CourseProgress.css';

/**
 * CourseProgress - Main course learning interface with lessons, progress tracking, and rating
 */
export default function CourseProgress(){
  const { userId, courseId } = useParams();
  const navigate = useNavigate();
  
  const {
    course,
    progress,
    loading,
    isEnrolled,
    enrolling,
    handleEnroll,
    handleWithdraw
  } = useCourseProgress(userId, courseId, navigate);

  const {
    showRatingDialog,
    setShowRatingDialog,
    selectedRating,
    setSelectedRating,
    ratingComment,
    setRatingComment,
    submittingRating,
    reviewSuccess,
    handleSubmitRating,
    handleCancelRating
  } = useCourseRating(courseId, userId);

  if(loading) return <div className="loading-card">Loading...</div>;
  if(!course) return <div className="error-card">Course not found</div>;

  // Generate lessons and calculate progress
  const lessons = course.quizList?.map((quizId, index) => ({ 
    id: quizId, 
    number: index + 1, 
    title: `Lesson ${index + 1}`, 
    hasQuiz: true, 
    quizId 
  })) || [];
  const progressPercentage = progress?.progressPercentage || 0;

  return (
    <div className="course-progress">
      <RatingDialog
        show={showRatingDialog}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        ratingComment={ratingComment}
        setRatingComment={setRatingComment}
        submittingRating={submittingRating}
        onSubmit={handleSubmitRating}
        onCancel={handleCancelRating}
      />

      <div className="course-progress-container">
        <div className="course-progress-card">
          <CourseHeader course={course} />

          <LessonsList lessons={lessons} course={course} isEnrolled={isEnrolled} />

          <div className="action-buttons-row">
            <CourseActions
              isEnrolled={isEnrolled}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              onWithdraw={handleWithdraw}
            />

            {isEnrolled && <ProgressBar progressPercentage={progressPercentage} />}
          </div>

          {isEnrolled && (
            <div className="bottom-actions">
              <button
                data-cy="rate-button"
                onClick={() => setShowRatingDialog(true)}
                className="rate-button"
              >
                <span>⭐</span>
                Rate
              </button>

              <div className="forum-section">
                <span className="forum-text">
                  You got stucked?<br/>
                  Don't worry! Chat with others!
                </span>
                <button className="forum-button">
                  FORUM
                </button>
              </div>
            </div>
          )}

          {reviewSuccess && (
            <div data-cy="review-success" className="success-message">
              Review submitted successfully!
            </div>
          )}

          {/* Review List - placeholder for testing */}
          <div data-cy="review-list" style={{ marginTop: 16, display: 'none' }}>
            {/* Reviews would be listed here */}
          </div>
        </div>
      </div>
    </div>
  );
}
