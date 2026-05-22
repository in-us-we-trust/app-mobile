export interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

export const isPasswordValid = (validation: PasswordValidation): boolean => {
  return (
    validation.hasMinLength &&
    validation.hasUppercase &&
    validation.hasLowercase &&
    validation.hasSpecialChar
  );
};
