import React from 'react';

/**
 * LessonsList - Displays course lessons with quiz buttons
 */
export default function LessonsList({ lessons, course, isEnrolled }) {
  if (!isEnrolled) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      {lessons.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No lessons available for this course yet.
        </div>
      )}
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
          <span style={{ fontSize: '16px', color: '#333' }}>
            <strong>Lesson {lesson.number}-</strong> {course.title} - Part {lesson.number}
          </span>
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