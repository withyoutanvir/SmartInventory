import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:sku', updateProduct);
router.delete('/:sku', deleteProduct);

export default router;
