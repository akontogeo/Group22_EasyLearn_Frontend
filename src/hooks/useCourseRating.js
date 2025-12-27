import { useState } from 'react';
import { submitCourseReview } from '../api/courses';

/**
 * Custom hook for managing course rating functionality
 * Handles rating dialog state, form data, and submission
 * Provides centralized rating and review management
 */
export function useCourseRating(courseId, userId) {
  // State for rating dialog visibility
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  // State for selected star rating (1-5)
  const [selectedRating, setSelectedRating] = useState(0);
  // State for optional text comment
  const [ratingComment, setRatingComment] = useState('');
  // State for submission loading indicator
  const [submittingRating, setSubmittingRating] = useState(false);
  // State for success message display
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Submit course rating and review to API
  async function handleSubmitRating() {
    // Validate that user selected a rating
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // Set submission state for UI feedback
    setSubmittingRating(true);
    
    try {
      // API call to submit review
      await submitCourseReview(courseId, {
        userId: Number(userId),
        stars: selectedRating,
        comment: ratingComment
      });
      
      // Log successful submission
      console.log('Review submitted successfully');
      
      // Show success message temporarily
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      
      // Close dialog and reset all form data
      setShowRatingDialog(false);
      setSelectedRating(0);
      setRatingComment('');
      setSubmittingRating(false);
    } catch (e) {
      // Handle submission errors
      console.error('Failed to submit rating:', e);
      alert('Failed to submit review. Please try again.');
      setSubmittingRating(false);
    }
  }

  // Cancel rating process and reset form
  function handleCancelRating() {
    // Hide dialog
    setShowRatingDialog(false);
    // Reset rating selection
    setSelectedRating(0);
    // Clear comment text
    setRatingComment('');
  }

  // Return all state and handlers for component use
  return {
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
  };
}