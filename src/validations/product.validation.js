import { body, param, query } from "express-validator";

const units = ['g', 'ml', 'pack', 'unit'];

export const createValidation = [
    body('name')
        .isString().withMessage('Name must be a string')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 32 }).withMessage('Name must not exceed 32 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid number with at most 2 decimal places')
        .custom(value => Number(value) >= 0).withMessage('Price must be a non-negative number'),
    body('category_id').optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
    body('store_id').optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('store_id must be a positive integer'),
    body('unit')
        .notEmpty().withMessage('Unit is required')
        .isIn(units).withMessage('Unit must be one of: g, ml, pack, unit'),
    body('size').optional()
        .isInt({ min: 1 }).withMessage('Size must be a positive integer'),
    body('brand').optional({ nullable: true })
        .isString().withMessage('Brand must be a string')
        .trim()
        .isLength({ max: 32 }).withMessage('Brand must not exceed 32 characters'),
    body('image').optional({ nullable: true })
        .isString().withMessage('Image URL must be a string')
        .trim(),
    body('barcode').optional({ nullable: true })
        .isString().withMessage('Barcode must be a string')
        .trim()
        .isLength({ max: 32 }).withMessage('Barcode must not exceed 32 characters'),
    body('description').optional({ nullable: true })
        .isString().withMessage('Description must be a string')
        .trim()
        .isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
];

export const searchValidation = [
    query('name').optional()
        .trim()
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ max: 32 }).withMessage('Name must not exceed 32 characters'),
    query('min_price').optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Min price must be a valid number with at most 2 decimal places')
        .custom(value => Number(value) >= 0).withMessage('Min price must be a non-negative number'),
    query('max_price').optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Max price must be a valid number with at most 2 decimal places')
        .custom(value => Number(value) >= 0).withMessage('Max price must be a non-negative number')
        .custom((value, { req }) => {
            if (req.query.min_price === undefined) return true;
            if (!isFinite(Number(req.query.min_price))) return true;
            return Number(value) >= Number(req.query.min_price);
        }).withMessage('Max price must be greater or equal to min price'),
    query('category_id').optional()
        .isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
    query('store_id').optional()
        .isInt({ min: 1 }).withMessage('store_id must be a positive integer'),
    query('brand').optional()
        .trim()
        .notEmpty().withMessage('Brand cannot be empty')
        .isLength({ max: 32 }).withMessage('Brand must not exceed 32 characters'),
    query('barcode').optional()
        .trim()
        .notEmpty().withMessage('Barcode cannot be empty')
        .isLength({ max: 32 }).withMessage('Barcode must not exceed 32 characters'),
    query('page').optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const updateValidation = [
    body('name').optional()
        .isString().withMessage('Name must be a string')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 32 }).withMessage('Name must not exceed 32 characters'),
    body('price').optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid number with at most 2 decimal places')
        .custom(value => Number(value) >= 0).withMessage('Price must be a non-negative number'),
    body('category_id').optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
    body('store_id').optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('store_id must be a positive integer'),
    body('unit').optional()
        .isIn(units).withMessage('Unit must be one of: g, ml, pack, unit'),
    body('size').optional()
        .isInt({ min: 1 }).withMessage('Size must be a positive integer'),
    body('brand').optional({ nullable: true }).trim()
        .isString().withMessage('Brand must be a string')
        .isLength({ max: 32 }).withMessage('Brand must not exceed 32 characters'),
    body('image').optional({ nullable: true })
        .isString().withMessage('Image URL must be a string')
        .trim(),
    body('barcode').optional({ nullable: true })
        .isString().withMessage('Barcode must be a string')
        .trim()
        .isLength({ max: 32 }).withMessage('Barcode must not exceed 32 characters'),
    body('description').optional({ nullable: true })
        .isString().withMessage('Description must be a string')
        .trim()
        .isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
];

export const idValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive Integer')
];