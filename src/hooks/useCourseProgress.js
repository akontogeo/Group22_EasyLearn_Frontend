import { useState, useEffect } from 'react';
import { getCourse} from '../api/courses';
import { getProgress, getUserEnrolledCourses, enrollInCourse, withdrawFromCourse } from '../api/users';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for managing course progress data and operations
 * Handles data loading, enrollment status, and course actions
 * Provides centralized state management for course progress functionality
 */
export function useCourseProgress(userId, courseId, navigate) {
  // Get auth context for user management
  const { setUser } = useAuth();
  
  // State for course data and loading states
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  // State for enrollment management
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    // Async function to load all course data
    async function load(){
      try{
        // Set loading state during data fetch
        setLoading(true);
        // Dynamic import for user profile API
        const { getUserProfile } = await import('../api/users');
        // Load and set user profile data
        const profile = await getUserProfile(userId);
        setUser({ ...profile, userId: Number(userId) });
        
        // Fetch course details
        const courseData = await getCourse(courseId);
        setCourse(courseData);
        
        // Check enrollment status
        const enrolledCourses = await getUserEnrolledCourses(userId);
        // Determine if user is enrolled in this course
        const enrolled = enrolledCourses.some(c => Number(c.id) === Number(courseId));
        setIsEnrolled(enrolled);
        
        // Load progress data if enrolled
        if (enrolled) {
          try {
            // Get user's progress for this course
            const progressData = await getProgress(userId, courseId);
            setProgress(progressData);
          } catch (e) {
            // Set default progress if fetch fails
            setProgress({ progressPercentage: 0 });
          }
        }
      }catch(e){
        // Log any loading errors
        console.error('Failed to load course progress:', e);
      }finally{
        // Always stop loading indicator
        setLoading(false);
      }
    }
    // Execute load function
    load();
  }, [userId, courseId, setUser]);

  // Handle course enrollment process
  async function handleEnroll() {
    // Prevent duplicate enrollment requests
    if (enrolling) return;
    try {
      // Set enrolling state for UI feedback
      setEnrolling(true);
      // API call to enroll user in course
      await enrollInCourse(userId, courseId);
      // Update enrollment status
      setIsEnrolled(true);
      // Load initial progress after enrollment
      const progressData = await getProgress(userId, courseId);
      setProgress(progressData);
    } catch (e) {
      // Log enrollment errors
      console.error('Failed to enroll:', e);
    } finally {
      // Always reset enrolling state
      setEnrolling(false);
    }
  }

  // Handle course withdrawal with confirmation
  async function handleWithdraw() {
    // Show confirmation dialog before withdrawal
    if (!window.confirm(`Are you sure you want to withdraw from "${course.title}"? Your progress will be lost.`)) {
      return;
    }
    try {
      // API call to withdraw from course
      await withdrawFromCourse(userId, courseId);
      // Navigate back to course details page
      navigate(`/courses/${courseId}`);
    } catch (e) {
      // Log withdrawal errors
      console.error('Failed to withdraw:', e);
    }
  }

  // Return all state and handlers for component use
  return {
    course,
    progress,
    loading,
    isEnrolled,
    enrolling,
    handleEnroll,
    handleWithdraw
  };
}