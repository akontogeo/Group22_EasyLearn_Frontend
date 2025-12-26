import React from 'react';

/**
 * RatingDialog - Course rating submission dialog
 * Modal dialog that allows users to rate courses with 1-5 stars and leave comments
 * @param {boolean} show - Controls dialog visibility
 * @param {number} selectedRating - Currently selected star rating (1-5)
 * @param {function} setSelectedRating - Function to update selected rating
 * @param {string} ratingComment - User's review comment text
 * @param {function} setRatingComment - Function to update comment text
 * @param {boolean} submittingRating - Loading state during submission
 * @param {function} onSubmit - Callback function when form is submitted
 * @param {function} onCancel - Callback function when dialog is cancelled
 */
export default function RatingDialog({
  show,
  selectedRating,
  setSelectedRating,
  ratingComment,
  setRatingComment,
  submittingRating,
  onSubmit,
  onCancel
}) {
  // Hide dialog when show prop is false
  if (!show) return null;

  return (
    /* Full-screen modal overlay with semi-transparent background */
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      {/* Main dialog container with rounded corners and shadow */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Dialog title */}
        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px' }}>Rate this Course</h2>
        
        {/* Star Rating Section */}
        <div style={{ marginBottom: '24px' }}>
          {/* Rating section label */}
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Your Rating:</div>
          {/* Interactive star buttons for rating selection */}
          <div data-cy="review-stars" style={{ display: 'flex', gap: '8px' }}>
            {/* Generate 5 star buttons with click handlers */}
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '36px',
                  cursor: 'pointer',
                  color: star <= selectedRating ? '#ffc107' : '#ddd',
                  padding: 0
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div style={{ marginBottom: '24px' }}>
          {/* Comment input label */}
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Comment (optional):</div>
          {/* Multi-line text input for user review comments */}
          <textarea
            data-cy="review-input"
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Share your thoughts about this course..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Action Buttons Section */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {/* Cancel button to close dialog without saving */}
          <button
            onClick={onCancel}
            disabled={submittingRating}
            style={{
              background: '#f0f0f0',
              color: '#333',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: submittingRating ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          {/* Submit button to save rating and comment */}
          <button
            data-cy="review-submit-button"
            onClick={onSubmit}
            disabled={submittingRating || selectedRating === 0}
            style={{
              background: (submittingRating || selectedRating === 0) ? '#ccc' : '#2ea67a',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (submittingRating || selectedRating === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            {/* Dynamic button text based on submission state */}
            {submittingRating ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}