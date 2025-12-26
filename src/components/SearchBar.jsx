import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * SearchBar - Search input with debounced search functionality
 */
export default function SearchBar() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const debounceTimer = useRef(null);

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
      navigate('/courses');
    }
  };

  // Debounced search - waits 300ms after user stops typing
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchKeyword(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(newValue);
    }, 300);
  };

  // Immediate search on form submit
  const handleSearch = (e) => {
    e.preventDefault();
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
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <input
          data-cy="search-input"
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(e);
          }}
          placeholder="What do you want to learn today?"
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
  );
}