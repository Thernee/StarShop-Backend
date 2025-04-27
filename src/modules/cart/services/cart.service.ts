import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CartResponseDto } from '../dtos/cart.dto';
import AppDataSource from '../../../config/ormconfig';

export class CartService {
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;

  constructor() {
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.cartItemRepository = AppDataSource.getRepository(CartItem);
  }

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);
    }

    const now = new Date();
    if (cart && cart.expiresAt && cart.expiresAt < now) {
        // Cart has expired, clear it
        await this.cartItemRepository.delete({ cartId: cart.id });
        cart.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await this.cartRepository.save(cart);
      } else if (cart) {
        // Cart exists but hasn't expired, just update expiration
        cart.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await this.cartRepository.save(cart);
      } else {
        // Create new cart
        cart = this.cartRepository.create({ 
          userId,
          expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        await this.cartRepository.save(cart);
      }
    return cart;
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      items: (cart.items || []).map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
      })),
    };
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    await this.cartItemRepository.delete({
      cartId: cart.id,
      productId: productId,
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    await this.cartItemRepository.delete({ cartId: cart.id });

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      items: [],
    };
  }
}

export const cartService = new CartService();
