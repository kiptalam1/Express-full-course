export const userValidator = {
    name: {
        notEmpty: {
            errorMessage: 'Name must not be empty',
        },
        isString: {
            errorMessage: 'Name must be a string of characters.',
        },
        isLength: {
            options: {
                min: 3,
                max: 12,
            },
            errorMessage: 'Name must be between 3 to 12 characters.',
        },
    },
    username: {
        notEmpty: {
            errorMessage: 'Username must not be empty',
        },
        isString: {
            errorMessage: 'Username must be a string of characters.',
        },
    },
    password: {
        exists: { errorMessage: 'Password is required' },
        isLength: {
            options: { min: 3 },
            errorMessage: 'Password must be at least 3 characters long',
        },
    },
}
