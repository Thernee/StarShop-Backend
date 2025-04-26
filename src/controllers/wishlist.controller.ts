import { Controller, Post, Delete, Get, Param, UseGuards, Req, HttpCode } from '@nestjs/common';
import { WishlistService } from '../services/wishlist.service';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import 'express';

declare module 'express' {
  interface Request {
    user?: { id: string };
  }
}

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  static addToWishlist: RequestHandler<
    { productId: string },
    any,
    any,
    ParsedQs,
    Record<string, any>
  >;
  static removeFromWishlist: RequestHandler<
    { productId: string },
    any,
    any,
    ParsedQs,
    Record<string, any>
  >;
  static getWishlist: RequestHandler<{}, any, any, ParsedQs, Record<string, any>>;
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  async addToWishlist(
    @Param('productId') productId: string,
    @Req() req: Request
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.wishlistService.addToWishlist(userId, productId);
    return { message: 'Product added to wishlist' };
  }

  @Delete(':productId')
  @HttpCode(204)
  async removeFromWishlist(
    @Param('productId') productId: string,
    @Req() req: Request
  ): Promise<void> {
    const userId = req.user.id;
    await this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get()
  async getWishlist(@Req() req: Request): Promise<{ wishlist: any[] }> {
    const userId = req.user.id;
    const wishlist = await this.wishlistService.getWishlist(userId);
    return { wishlist };
  }
}
