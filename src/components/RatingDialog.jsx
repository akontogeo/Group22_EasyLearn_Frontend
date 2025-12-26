import React from 'react';

/**
 * RatingDialog - Course rating submission dialog
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
  if (!show) return null;

  return (
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
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px' }}>Rate this Course</h2>
        
        {/* Star Rating */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Your Rating:</div>
          <div data-cy="review-stars" style={{ display: 'flex', gap: '8px' }}>
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

        {/* Comment */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Comment (optional):</div>
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

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
            {submittingRating ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}