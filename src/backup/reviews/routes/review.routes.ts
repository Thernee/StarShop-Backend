import { Router } from 'express';
import { ReviewController } from '../../../modules/reviews/controllers/review.controller';
import { canReviewProduct, validateReviewData } from '../../../modules/reviews/middlewares/review.middleware';
import { jwtAuthMiddleware } from '../../../modules/auth/middleware/jwt-auth.middleware';
import { AuthenticatedRequest } from '../../../modules/shared/types/auth-request.type';

const router = Router();
const reviewController = new ReviewController();

/**
 * @route POST /api/v1/reviews/:productId
 * @desc Create a new review for a product
 * @access Private (Authenticated Users Only)
 */
router.post(
  '/:productId',
  jwtAuthMiddleware,
  (req, res, next) => canReviewProduct(req as AuthenticatedRequest, res, next),
  (req, res, next) => validateReviewData(req as AuthenticatedRequest, res, next),
  (req, res, next) => reviewController.createReview(req as AuthenticatedRequest, res, next)
);

/**
 * @route GET /api/v1/reviews/:productId
 * @desc Get all reviews for a product
 * @access Public
 */
router.get('/:productId', (req, res, next) =>
  reviewController.getProductReviews(req as AuthenticatedRequest, res, next)
);

/**
 * @route DELETE /api/v1/reviews/:reviewId
 * @desc Delete a review (only by the user who created it)
 * @access Private (Authenticated Users Only)
 */
router.delete('/:reviewId', jwtAuthMiddleware, (req, res, next) =>
  reviewController.deleteReview(req as AuthenticatedRequest, res, next)
);

export default router;
