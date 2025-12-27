import React, { useEffect, useState } from 'react'; // React hooks for component lifecycle and state management
import { useParams, Link } from 'react-router-dom'; // Router hooks for URL parameters and navigation
import { getCourse, getCourseReviews } from '../api/courses'; // API functions for course and review data fetching
/**
 * CourseReviews 
 * Shows course info, average rating
 */
export default function CourseReviews() {
  const { courseId } = useParams(); // Extract course ID from URL parameters
  const [course, setCourse] = useState(null);  // State for storing course details
  const [reviews, setReviews] = useState([]);  // State for storing all course reviews
  const [loading, setLoading] = useState(true);   // Loading state for API calls
  // Effect hook to load course and review data on component mount
  useEffect(() => {
    // Async function to handle data loading
    async function load() {
      try {
        // Set loading state to show spinner
        setLoading(true);
        // Fetch course data and reviews in parallel for better performance
        const [courseData, reviewsData] = await Promise.all([
          getCourse(courseId), // Get course details
          getCourseReviews(courseId) // Get all reviews for this course
        ]);
        // Update state with fetched data
        setCourse(courseData);
        setReviews(reviewsData);
      } catch (e) {
        // Log any errors during data fetching
        console.error('Failed to load reviews:', e);
      } finally {
        // Always stop loading indicator
        setLoading(false);
      }
    }
    // Execute the load function
    load();
  }, [courseId]); // Re-run effect if courseId changes

  // Show loading indicator while data is being fetched
  if (loading) {
    return <div className="card">Loading...</div>;
  }

  // Show error message if course data couldn't be loaded
  if (!course) {
    return <div className="card">Course not found</div>;
  }

  // Calculate average rating from all reviews
  // Use reduce to sum all star ratings, then divide by count
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
    : 'N/A'; // Show N/A if no reviews exist

  return (
    // Main page container with full height and background styling
    <div style={{
      minHeight: 'calc(100vh - 100px)', // Full viewport height minus header
      background: '#f5f5f5', // Light gray background
      padding: '24px 32px' // Page padding
    }}>
      {/* Centered content container with max width */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Navigation link back to course details */}
        <Link to={`/courses/${courseId}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px', // Space between arrow and text
          color: '#2ea67a', // Brand green color
          textDecoration: 'none', // Remove underline
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          ← Back to Course
        </Link>

        {/* Course Header Section - displays course title and rating summary */}
        <div style={{
          background: 'white',
          borderRadius: '12px', // Rounded corners
          padding: '24px', // Internal spacing
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' // Subtle shadow
        }}>
          {/* Main course title display */}
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#222' }}>
            {course.title}
          </h1>
          {/* Rating summary section with star icon and review count */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px', // Space between rating elements
            fontSize: '16px',
            color: '#666' // Medium gray text
          }}>
            {/* Rating display with star icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Star icon with yellow color */}
              <span style={{ color: '#ffc107', fontSize: '20px' }}>★</span>
              {/* Average rating value with emphasis */}
              <span style={{ fontWeight: 600, color: '#333' }}>{avgRating}</span>
              {/* Review count with proper pluralization */}
              <span>({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
        </div>

        {/* Reviews List Container - main content area */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {/* Section heading for reviews */}
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#222' }}>
            Course Reviews
          </h2>

          {/* Conditional rendering based on reviews availability */}
          {reviews.length === 0 ? (
            // Empty state when no reviews exist
            <div style={{
              textAlign: 'center',
              padding: '40px 20px', // Generous padding for empty state
              color: '#999' // Light gray text
            }}>
              {/* Large emoji icon for visual appeal */}
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              {/* Primary empty state message */}
              <p style={{ margin: 0, fontSize: '16px' }}>No reviews yet</p>
              {/* Encouraging secondary message */}
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Be the first to review this course!</p>
            </div>
          ) : (
            // Reviews list container with vertical stacking
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Map through all reviews to create individual cards */}
              {reviews.map((review, index) => (
                // Individual review card with border and background
                <div key={review.ratingId || index} style={{
                  padding: '16px', // Internal spacing
                  border: '1px solid #e0e0e0', // Light border
                  borderRadius: '8px', // Rounded corners
                  background: '#fafafa' // Very light gray background
                }}>
                  {/* Review Header Section - user info and rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Spread items apart
                    marginBottom: '12px'
                  }}>
                    {/* User information and rating container */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px' // Space between avatar and info
                    }}>
                      {/* User avatar circle with user ID */}
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%', // Perfect circle
                        background: '#2ea67a', // Brand green color
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Center text in circle
                        fontWeight: 600,
                        fontSize: '16px'
                      }}>
                        U{review.userId}
                      </div>
                      {/* User details container */}
                      <div>
                        {/* User name/identifier */}
                        <div style={{ fontWeight: 600, color: '#333', fontSize: '14px' }}>
                          User {review.userId}
                        </div>
                        {/* Star rating display container */}
                        <div style={{
                          display: 'flex',
                          gap: '2px', // Small gap between stars
                          marginTop: '4px'
                        }}>
                          {/* Generate 5 star rating display using array mapping */}
                          {[1, 2, 3, 4, 5].map(star => (
                            // Individual star with conditional coloring
                            <span key={star} style={{
                              color: star <= review.stars ? '#ffc107' : '#ddd', // Yellow if filled, gray if empty
                              fontSize: '16px'
                            }}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Comment Section - only show if comment exists */}
                  {review.comment && (
                    <div style={{
                      fontSize: '14px',
                      color: '#555', // Darker gray for readability
                      lineHeight: '1.5', // Better text spacing
                      paddingLeft: '52px' // Align with user info text
                    }}>
                      {review.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
