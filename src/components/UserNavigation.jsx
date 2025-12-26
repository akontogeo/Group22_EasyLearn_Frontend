import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * UserNavigation - User navigation links and profile display
 * Displays navigation links for user courses and profile with avatar icon
 * Automatically uses current user ID from auth context or defaults to user ID 1
 * @returns {JSX.Element} Navigation section with My Courses link and user profile
 */
export default function UserNavigation() {
  // Get current user data from authentication context
  const { user } = useAuth();

  return (
    /* Right-aligned navigation container with flex layout */
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginLeft: 'auto',
    }}>
      {/* My Courses navigation link */}
      <Link
        to={user ? `/users/${user.userId}/courses` : '/users/1/courses'}
        style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        My Courses
      </Link>
      {/* User profile link with avatar icon */}
      <Link
        to={user ? `/users/${user.userId}` : '/users/1'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: '#333',
        }}
      >
        {/* Circular avatar container with user icon */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}>
          👤
        </div>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          Hi, {user?.username || 'User'}!
        </span>
      </Link>
    </div>
  );
}