import { Router } from "express";
import userRoutes from "./UserRouter";
import attributeRoutes from "./AttributeRouter";
import attributeValuesRoutes from "./AttributeValueRouter";
import productRoutes from "./ProductRouter";
import productVariantAttributeRoutes from "./ProductVariantAttributeRouter";
import protectedRoutes from "./ProtectedRouter";

// import productRoutes from './product.routes';
// import storeRoutes from './store.routes';

const router = Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running!' });
});

// Mount route modules
router.use("/users", userRoutes);
router.use("/attributes", attributeRoutes);
router.use("/attribute-values", attributeValuesRoutes);
router.use("/products", productRoutes);
router.use("/product-variant-attributes", productVariantAttributeRoutes);

// Protected routes
router.use("/", protectedRoutes);

// router.use("/products", productRoutes);
// router.use("/stores", storeRoutes);

export default router;
