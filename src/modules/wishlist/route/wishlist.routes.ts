import { Router, Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../common/types/auth-request.type';
import AppDataSource from '../../../config/ormconfig';
import { Wishlist } from '../entitities/wishlist.entity';
import { Product } from '../../../entities/Product';
import { WishlistService } from '../service/wishlist.service';
import { WishlistController } from '../controller/wishlist.controller';

const router = Router();

// Create wishlist service and controller instances
const wishlistService = new WishlistService(
  AppDataSource.getRepository(Wishlist),
  AppDataSource.getRepository(Product)
);

const wishlistController = new WishlistController(wishlistService);

// Add to wishlist
router.post(
  '/:productId',

  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await wishlistController.addToWishlist(
        req.params.productId,
        req as AuthRequest
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// Remove from wishlist
router.delete(
  '/:productId',

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await wishlistController.removeFromWishlist(req.params.productId, req as AuthRequest);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Get wishlist
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await wishlistController.getWishlist(req as AuthRequest);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
