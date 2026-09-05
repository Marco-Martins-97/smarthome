import express from "express";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";
import { validate } from "../middleware/validation.middleware.js";
import { login, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

router.get('/me', authenticate, me);

export default router;