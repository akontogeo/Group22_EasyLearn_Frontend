import React from 'react';

/**
 * CourseActions - Action buttons for course enrollment, withdrawal, and material download
 * Renders different action sets based on enrollment status
 * Handles enrollment flow and provides course management options
 */
export default function CourseActions({ 
  isEnrolled, 
  enrolling, 
  onEnroll, 
  onWithdraw 
}) {
  // Show enrollment button for non-enrolled users
  if (!isEnrolled) {
    return (
      // Container for enrollment actions
      <div className="left-actions">
        {/* Primary enrollment button with loading state */}
        <button
          onClick={onEnroll}
          disabled={enrolling}
          className="btn-primary"
        >
          {/* Dynamic text based on enrollment status */}
          {enrolling ? 'Enrolling...' : 'Enroll in Course'}
        </button>
      </div>
    );
  }

  // Show course management options for enrolled users
  return (
    // Container for enrolled user actions
    <div className="left-actions">
      {/* Material download button */}
      <button className="btn-secondary">
        {/* Download icon */}
        <span style={{ fontSize: '24px' }}>⬇</span>
        Download material
      </button>
      {/* Course withdrawal button */}
      <button onClick={onWithdraw} className="btn-danger">
        Withdraw
      </button>
    </div>
  );
}