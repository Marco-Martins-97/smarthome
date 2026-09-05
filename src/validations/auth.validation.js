import { body } from "express-validator";

export const registerValidation = [
    body('username').trim()
        .notEmpty().withMessage('Please enter a username')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),
    body('password').trim()
        .notEmpty().withMessage('Please enter a password')
        .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters long'),
];

export const loginValidation = [
    body('username').trim().notEmpty().withMessage('Please enter a username'),
    body('password').trim().notEmpty().withMessage('Please enter a password')
];