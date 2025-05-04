import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { cartService } from '../services/cart.service';
import { AddItemDto, RemoveItemDto } from '../dtos/cart.dto';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware';

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id.toString(); // Convert number to string for service
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const cart = await cartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve cart', error: (error as Error).message });
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id.toString(); // Convert number to string for service
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const addItemDto = plainToClass(AddItemDto, req.body);

      // Validate DTO
      const errors = await validate(addItemDto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      const cart = await cartService.addItem(userId, addItemDto.productId, addItemDto.quantity);
      res.json(cart);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to add item to cart', error: (error as Error).message });
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id.toString(); // Convert number to string for service
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
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
      res
        .status(500)
        .json({ message: 'Failed to remove item from cart', error: (error as Error).message });
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id.toString(); // Convert number to string for service
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const cart = await cartService.clearCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear cart', error: (error as Error).message });
    }
  }
}

export const cartController = new CartController();
