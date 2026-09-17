const { z } = require('zod');

const emailSchema = z
    .string({ error: 'Email is required.' })
    .trim()
    .min(1, 'Email is required.')
    .max(254, 'Email must be 254 characters or fewer.')
    .email('Enter a valid email address.')
    .transform((email) => email.toLowerCase());

const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string({ error: 'Password is required.' })
        .min(1, 'Password is required.')
        .max(200, 'Password is too long.'),
});

const registerSchema = z.object({
    username: z
        .string({ error: 'Username is required.' })
        .trim()
        .min(3, 'Username must be at least 3 characters.')
        .max(30, 'Username must be 30 characters or fewer.')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'Use only letters, numbers, underscores, or hyphens.'
        ),
    email: emailSchema,
    password: z
        .string({ error: 'Password is required.' })
        .min(8, 'Password must be at least 8 characters.')
        .max(72, 'Password must be 72 characters or fewer.')
        .regex(/[a-z]/, 'Password must include a lowercase letter.')
        .regex(/[A-Z]/, 'Password must include an uppercase letter.')
        .regex(/[0-9]/, 'Password must include a number.'),
});

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body ?? {});

        if (result.success) {
            req.body = result.data;
            return next();
        }

        const errors = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0];
            if (typeof field === 'string' && !errors[field]) {
                errors[field] = issue.message;
            }
        }

        return res.status(422).json({
            message: 'Please correct the highlighted fields.',
            errors,
        });
    };
}

module.exports = {
    validateLogin: validate(loginSchema),
    validateRegister: validate(registerSchema),
};
