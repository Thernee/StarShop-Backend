import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from '../entitities/wishlist.entity';
import { WishlistService } from '../service/wishlist.service';
import { WishlistController } from '../controller/wishlist.controller';
import { Product } from '../../products/entities/product.entity';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Product]), SharedModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
