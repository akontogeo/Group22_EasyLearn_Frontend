import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * UserNavigation - User navigation links and profile display
 */
export default function UserNavigation() {
  const { user } = useAuth();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginLeft: 'auto',
    }}>
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