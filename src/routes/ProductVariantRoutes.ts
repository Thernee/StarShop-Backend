import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantAttribute } from '../entities/ProductVariantAttribute';
import { ProductVariantAttributeService } from '../services/productVariant.service';
import { ProductVariantAttributeController } from '../controllers/ProductVariantController';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantAttribute])],
  controllers: [ProductVariantAttributeController],
  providers: [ProductVariantAttributeService],
})
export class ProductVariantAttributeModule {}
