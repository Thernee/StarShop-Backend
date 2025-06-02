import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entitities/wishlist.entity';
import { User } from '../../../entities/User';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async addToWishlist(userId: string, productId: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id: Number(productId) } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const exists = await this.wishlistRepository.findOne({
      where: { user: { id: Number(userId) }, product: { id: Number(productId) } },
    });

    if (exists) {
      throw new ConflictException('Product already in wishlist');
    }

    const wishlistItem = this.wishlistRepository.create({
      user: await this.wishlistRepository.manager.findOneOrFail(User, {
        where: { id: Number(userId) },
      }),
      product: product,
    });

    await this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const result = await this.wishlistRepository.delete({
      user: { id: Number(userId) },
      product: { id: Number(productId) },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist item not found');
    }
  }

  async getWishlist(userId: string): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { user: { id: Number(userId) } },
      relations: ['product'],
      order: { addedAt: 'DESC' },
    });
  }
}
