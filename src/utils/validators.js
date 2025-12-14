// Validation utility functions for form inputs and data validation

// Validate email format using regex pattern
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate course rating is between 1 and 5 stars
export const validateRating = (stars) => {
  return stars >= 1 && stars <= 5;
};

// Validate that a value is not empty
export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};
