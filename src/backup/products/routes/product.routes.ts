import { Router } from 'express';
import { jwtAuthMiddleware } from '../../auth/middleware/jwt-auth.middleware';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

// Public routes
router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));

// Protected routes
router.use(jwtAuthMiddleware);
router.post('/', (req, res) => productController.createProduct(req, res));
router.put('/:id', (req, res) => productController.updateProduct(req, res));
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

export default router;
