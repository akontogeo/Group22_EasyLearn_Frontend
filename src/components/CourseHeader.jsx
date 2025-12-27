import React from 'react';

/**
 * CourseHeader - Displays course image and title information
 * Renders the top section of course page with image and title
 * Handles both actual course images and placeholder fallbacks
 */
export default function CourseHeader({ course }) {
  return (
    // Main container for course header section
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
  );
}