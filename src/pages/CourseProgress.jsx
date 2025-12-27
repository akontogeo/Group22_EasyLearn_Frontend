// Core React imports
import React from 'react';
// Router hooks for navigation and URL parameters
import { useParams, useNavigate } from 'react-router-dom';
// Component imports for UI elements
import RatingDialog from '../components/RatingDialog';
import LessonsList from '../components/LessonsList';
import CourseActions from '../components/CourseActions';
// Custom hooks for data and state management
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useCourseRating } from '../hooks/useCourseRating';
// Component-specific styling
import './CourseProgress.css';

/**
 * CourseProgress - Main course learning interface with lessons, progress tracking, and rating
 * Provides complete course learning experience with enrollment, progress tracking, and rating
 * Handles both enrolled and non-enrolled user states
 */
export default function CourseProgress(){
  // Extract URL parameters for user and course identification
  const { userId, courseId } = useParams();
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Custom hook for course data management and enrollment operations
  const {
    course, // Course details object
    progress, // User's progress data
    loading, // Loading state for initial data fetch
    isEnrolled, // Boolean indicating enrollment status
    enrolling, // Boolean indicating enrollment process
    handleEnroll, // Function to enroll in course
    handleWithdraw // Function to withdraw from course
  } = useCourseProgress(userId, courseId, navigate);

  // Custom hook for rating and review functionality
  const {
    showRatingDialog, // Boolean to show/hide rating modal
    setShowRatingDialog, // Function to control rating dialog visibility
    selectedRating, // Currently selected star rating (1-5)
    setSelectedRating, // Function to update selected rating
    ratingComment, // Text comment for the review
    setRatingComment, // Function to update comment text
    submittingRating, // Boolean indicating rating submission in progress
    reviewSuccess, // Boolean indicating successful review submission
    handleSubmitRating, // Function to submit rating and review
    handleCancelRating // Function to cancel rating process
  } = useCourseRating(courseId, userId);

  // Early returns for loading and error states
  if(loading) return <div className="loading-card">Loading...</div>;
  if(!course) return <div className="error-card">Course not found</div>;

  // Generate lessons and calculate progress
  // Transform quiz IDs into lesson objects with metadata
  const lessons = course.quizList?.map((quizId, index) => ({ 
    id: quizId, // Unique quiz identifier
    number: index + 1, // Sequential lesson number
    title: `Lesson ${index + 1}`, // Display title
    hasQuiz: true, // Indicates quiz availability
    quizId // Reference to quiz
  })) || []; // Fallback to empty array if no quizzes
  // Extract progress percentage, default to 0 if no progress data
  const progressPercentage = progress?.progressPercentage || 0;

  return (
    // Main page container with background styling
    <div className="course-progress">
      {/* Rating Dialog Modal - conditionally rendered */}
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
          {/* Course Header - image and title section */}
          <div className="course-header">
            {/* Course image container with fallback support */}
            <div className="course-image">
              {/* Display actual course image if available */}
              {course.courseImage ? (
                <img src={course.courseImage} alt={course.title} />
              ) : (
                /* Fallback placeholder showing course initials */
                <div className="course-image-placeholder">
                  {/* Extract first 2 characters as placeholder */}
                  {course.title?.slice(0,2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Course information section */}
            <div className="course-info">
              {/* Main course title with subtitle */}
              <h1 className="course-title">
                {/* Course name with "Part I" indicator */}
                {course.title} <span className="course-title-subtitle">Part I</span>
              </h1>
            </div>
          </div>

          {/* Lessons List Component - displays all course lessons */}
          <LessonsList lessons={lessons} course={course} isEnrolled={isEnrolled} />

          {/* Action buttons row - enrollment controls and progress display */}
          <div className="action-buttons-row">
            {/* Course action buttons (enroll/withdraw/download) */}
            <CourseActions
              isEnrolled={isEnrolled}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              onWithdraw={handleWithdraw}
            />

            {/* Right side: Progress Bar for enrolled users */}
            {isEnrolled && (
              <div className="progress-section">
                {/* Progress information wrapper */}
                <div className="progress-info">
                  {/* Progress label with percentage text */}
                  <div className="progress-label" data-cy="progress-indicator">
                    {/* Display current progress percentage */}
                    My Progress: {progressPercentage}% completed
                  </div>
                  {/* Visual progress bar container */}
                  <div className="progress-bar">
                    {/* Filled portion of progress bar */}
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                    {/* Percentage text overlay with adaptive styling */}
                    <span className={`progress-text ${progressPercentage > 50 ? 'light' : 'dark'}`}>
                      {/* Show percentage number */}
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action section - only visible for enrolled users */}
          {isEnrolled && (
            <div className="bottom-actions">
              {/* Rate course button with star icon */}
              <button
                data-cy="rate-button"
                onClick={() => setShowRatingDialog(true)}
                className="rate-button"
              >
                <span>⭐</span>
                Rate
              </button>

              {/* Forum section for community interaction */}
              <div className="forum-section">
                {/* Help text for stuck users */}
                <span className="forum-text">
                  You got stucked?<br/>
                  Don't worry! Chat with others!
                </span>
                {/* Forum access button */}
                <button className="forum-button">
                  FORUM
                </button>
              </div>
            </div>
          )}

          {/* Success message display after review submission */}
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
