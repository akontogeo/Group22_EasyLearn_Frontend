import React from 'react';

/**
 * ProgressBar - Displays course completion progress
 * Shows visual progress bar with percentage indicator
 * Adapts text color based on progress level
 */
export default function ProgressBar({ progressPercentage }) {
  return (
    // Main container for progress section
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
  );
}