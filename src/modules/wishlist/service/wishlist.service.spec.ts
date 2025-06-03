import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wishlist } from '../entitities/wishlist.entity';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let wishlistRepository: Repository<Wishlist>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getRepositoryToken(Wishlist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    wishlistRepository = module.get<Repository<Wishlist>>(getRepositoryToken(Wishlist));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToWishlist', () => {
    it('should add product to wishlist', async () => {
      const userId = 'user-id';
      const productId = 123; // Example numeric ID
      const product = new Product();
      product.id = Number(productId);

      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(product);
      jest.spyOn(wishlistRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(wishlistRepository, 'save').mockResolvedValueOnce(null);

      await service.addToWishlist(userId, product.id.toString());
    });

    it('should throw error if product already in wishlist', async () => {
      const userId = 'user-id';
      const productId = 'product-id';
      const product = new Product();
      product.id = Number(productId);

      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(product);
      jest.spyOn(wishlistRepository, 'findOne').mockResolvedValueOnce(new Wishlist());

      await expect(service.addToWishlist(userId, productId)).rejects.toThrow(ConflictException);
    });

    it('should throw error if product not found', async () => {
      const userId = 'user-id';
      const productId = 'product-id';

      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.addToWishlist(userId, productId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove product from wishlist', async () => {
      const userId = 'user-id';
      const productId = 'product-id';

      jest.spyOn(wishlistRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as any);

      await service.removeFromWishlist(userId, productId);
    });

    it('should throw error if wishlist item not found', async () => {
      const userId = 'user-id';
      const productId = 'product-id';

      jest.spyOn(wishlistRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as any);

      await expect(service.removeFromWishlist(userId, productId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getWishlist', () => {
    it('should return wishlist items', async () => {
      const userId = 'user-id';
      const wishlistItems = [new Wishlist()];

      jest.spyOn(wishlistRepository, 'find').mockResolvedValueOnce(wishlistItems);

      const result = await service.getWishlist(userId);
      expect(result).toEqual(wishlistItems);
    });
  });
});
