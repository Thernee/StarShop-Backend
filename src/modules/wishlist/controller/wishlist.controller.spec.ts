import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from '../service/wishlist.service';
import { AuthGuard } from '../common/guard/auth-guard';
import { ConflictException } from '@nestjs/common';
import { Wishlist } from '../entitities/wishlist.entity';
import { mockRequest } from '../common/mock/mock-request';
import { AuthRequest } from '../common/types/auth-request.type';

describe('WishlistController', () => {
  let controller: WishlistController;
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        WishlistService,
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get<WishlistService>(WishlistService);
  });

  describe('addToWishlist', () => {
    it('should call the service method to add product', async () => {
      const userId = 'user-id';
      const productId = 'product-id';
      const req = mockRequest({ user: { id: userId } }) as unknown as AuthRequest;

      jest.spyOn(service, 'addToWishlist').mockResolvedValueOnce(undefined);

      await controller.addToWishlist(productId, req);
      expect(service.addToWishlist).toHaveBeenCalledWith(userId, productId);
    });

    it('should throw ConflictException when product is already in wishlist', async () => {
      const userId = 'user-id';
      const productId = 'product-id';
      const req = mockRequest({ user: { id: userId } }) as unknown as AuthRequest;

      jest
        .spyOn(service, 'addToWishlist')
        .mockRejectedValueOnce(new ConflictException('Product already in wishlist'));

      await expect(controller.addToWishlist(productId, req)).rejects.toThrow(ConflictException);
    });
  });

  describe('removeFromWishlist', () => {
    it('should call service method to remove product from wishlist', async () => {
      const userId = 'user-id';
      const productId = 'product-id';
      const req = mockRequest({ user: { id: userId } }) as unknown as AuthRequest;

      jest.spyOn(service, 'removeFromWishlist').mockResolvedValueOnce(undefined);

      await controller.removeFromWishlist(productId, req);
      expect(service.removeFromWishlist).toHaveBeenCalledWith(userId, productId);
    });
  });

  describe('getWishlist', () => {
    it('should return the user wishlist', async () => {
      const userId = 'user-id';
      const req = mockRequest({ user: { id: userId } }) as unknown as AuthRequest;
      const wishlistItems = [new Wishlist()];

      jest.spyOn(service, 'getWishlist').mockResolvedValueOnce(wishlistItems);

      const result = await controller.getWishlist(req);
      expect(result.wishlist).toEqual(wishlistItems);
    });
  });
});
