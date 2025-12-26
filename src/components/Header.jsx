import React, { useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Header - Main navigation bar with search, logo, and user navigation
 */
export default function Header() {
  const { user } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const debounceTimer = useRef(null); // Prevents excessive search API calls

  // Initialize search keyword from URL params
  React.useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      setSearchKeyword(decodeURIComponent(keyword));
    }
  }, [searchParams]);

  // Navigate to courses page with search term or clear filters
  const performSearch = (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/courses?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      // If search is empty, go back to home with no filters
      navigate('/courses');
    }
  };

  // Debounced search - waits 300ms after user stops typing
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchKeyword(newValue);

    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer - search after 300ms of no typing
    debounceTimer.current = setTimeout(() => {
      performSearch(newValue);
    }, 300);
  };

  // Immediate search on form submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Clear any pending debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    performSearch(searchKeyword);
  };

  // Clear search and return to courses page
  const handleSearchClear = () => {
    setSearchKeyword('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    navigate('/courses');
  };

  return (
    <header
      style={{
        background: '#b8e6d5',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: '#2ea67a',
          fontWeight: 700,
          fontSize: '18px',
          whiteSpace: 'nowrap',
        }}
      >
        <img
          src="/Logo.png"
          alt="EasyLearn"
          style={{ width: 40, height: 40, objectFit: 'contain' }}
        />
        EasyLearn
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        data-cy="search-form"
        style={{
          flex: 1,
          maxWidth: '600px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            data-cy="search-input"
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(e);
            }}
            placeholder="What do you want to learn today?"
            data-cy="search-input"
            style={{
              width: '100%',
              padding: '10px 40px 10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              background: 'white',
            }}
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={handleSearchClear}
              style={{
                position: 'absolute',
                right: '40px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#999',
                fontSize: '18px',
                lineHeight: 1,
              }}
              title="Clear search"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </form>

      {/* Right Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginLeft: 'auto',
        }}
      >
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
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            👤
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Hi, {user?.username || 'User'}!
          </span>
        </Link>
      </div>
    </header>
  );
}
