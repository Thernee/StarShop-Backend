import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { cartService } from '../services/cart.service';
import { AddItemDto, RemoveItemDto } from '../dtos/cart.dto';

// Define AuthenticatedRequest that includes user
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    walletAddress: string;
    name?: string;
    email?: string;
    role: 'buyer' | 'seller' | 'admin';
    createdAt: Date;
    updatedAt: Date;
  };
}

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id; // Assuming user ID is stored in req.user
      const cart = await cartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve cart', error: (error as Error).message });
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const addItemDto = plainToClass(AddItemDto, req.body);
      
      // Validate DTO
      const errors = await validate(addItemDto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }
      
      const cart = await cartService.addItem(
        userId,
        addItemDto.productId,
        addItemDto.quantity
      );
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add item to cart', error: (error as Error).message });
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const removeItemDto = plainToClass(RemoveItemDto, req.body);
      
      // Validate DTO
      const errors = await validate(removeItemDto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }
      
      const cart = await cartService.removeItem(userId, removeItemDto.productId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove item from cart', error: (error as Error).message });
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const cart = await cartService.clearCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear cart', error: (error as Error).message });
    }
  }
}

export const cartController = new CartController();
