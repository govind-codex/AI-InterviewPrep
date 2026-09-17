const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function validateLogin({ email, password }) {
    const errors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        errors.email = 'Email is required.';
    } else if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
        errors.email = 'Enter a valid email address.';
    }

    if (!password) {
        errors.password = 'Password is required.';
    }

    return errors;
}

export function validateRegister({ username, email, password, confirmPassword }) {
    const errors = validateLogin({ email, password });
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
        errors.username = 'Username is required.';
    } else if (normalizedUsername.length < 3) {
        errors.username = 'Username must be at least 3 characters.';
    } else if (normalizedUsername.length > 30) {
        errors.username = 'Username must be 30 characters or fewer.';
    } else if (!USERNAME_PATTERN.test(normalizedUsername)) {
        errors.username = 'Use only letters, numbers, underscores, or hyphens.';
    }

    if (password && password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    } else if (password.length > 72) {
        errors.password = 'Password must be 72 characters or fewer.';
    } else if (password && !/[a-z]/.test(password)) {
        errors.password = 'Password must include a lowercase letter.';
    } else if (password && !/[A-Z]/.test(password)) {
        errors.password = 'Password must include an uppercase letter.';
    } else if (password && !/[0-9]/.test(password)) {
        errors.password = 'Password must include a number.';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
}
