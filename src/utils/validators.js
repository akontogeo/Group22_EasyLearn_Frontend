export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRating = (stars) => {
  return stars >= 1 && stars <= 5;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};
