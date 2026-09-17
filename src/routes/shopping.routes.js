import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createValidation, idValidation, updateValidation, searchValidation } from "../validations/product.validation.js";
import * as productController from '../controllers/product.controller.js'

const router = express.Router();

router.post('/products/', authenticate, createValidation, validate, productController.create);
router.get('/products/', authenticate, searchValidation, validate, productController.search);
router.get('/products/:id', authenticate, idValidation, validate, productController.get);
router.patch('/products/:id', authenticate, idValidation, updateValidation, validate, productController.update);
router.post('/products/:id/enable', authenticate, idValidation, validate, productController.enable);
router.post('/products/:id/disable', authenticate, idValidation, validate, productController.disable);
router.delete('/products/:id', authenticate, idValidation, validate, productController.remove);



// CRUD
// router.post('/category/', addCategory); 
// router.post('/store/', addStore); 
// router.post('/cart/', addToCart); 
// router.get('/orders/', getOrders); 

export default router;