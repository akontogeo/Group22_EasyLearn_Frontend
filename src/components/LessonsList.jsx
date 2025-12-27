import React from 'react';

/**
 * LessonsList - Displays course lessons with quiz buttons
 * Shows a list of lessons for enrolled users with interactive quiz buttons
 * @param {Array} lessons - Array of lesson objects with id, number, title, hasQuiz properties
 * @param {Object} course - Course object containing title and other course data
 * @param {boolean} isEnrolled - Whether the current user is enrolled in the course
 */
export default function LessonsList({ lessons, course, isEnrolled }) {
  // Only show lessons if user is enrolled in the course
  if (!isEnrolled) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Display message when no lessons are available */}
      {lessons.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No lessons available for this course yet.
        </div>
      )}
      {/* Render each lesson as a card with title and quiz button */}
      {lessons.map((lesson) => (
        <div key={lesson.id} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          marginBottom: '12px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          background: 'white'
        }}>
          {/* Lesson title with formatted numbering */}
          <span style={{ fontSize: '16px', color: '#333' }}>
            <strong>Lesson {lesson.number}-</strong> {course.title} - Part {lesson.number}
          </span>
          {/* Quiz button appears only if lesson has a quiz */}
          {lesson.hasQuiz && (
            <button style={{
              background: '#2ea67a',
              color: 'white',
              border: 'none',
              padding: '8px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Quiz
            </button>
          )}
        </div>
      ))}
    </div>
  );
}