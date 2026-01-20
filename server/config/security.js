export const securityConfig = {
  passwordMinLength: 8,
  saltRounds: process.env.NODE_ENV === 'production' ? 12 : 10,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  rateLimits: {
    general: {
      windowMs: 15 * 60 * 1000,
      max: 500 // Increased for normal app usage
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 20
    }
  }
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < securityConfig.passwordMinLength) {
    errors.push(`Password must be at least ${securityConfig.passwordMinLength} characters`);
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors;
};
