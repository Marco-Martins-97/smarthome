import express from "express";
import authRoutes from "./auth.routes.js";
import shoppingRoutes from "./shopping.routes.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shopping', shoppingRoutes);

export default router;