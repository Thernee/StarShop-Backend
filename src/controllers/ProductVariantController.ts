import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductVariantAttributeService } from '../services/productVariant.service';
import { ProductVariantAttribute } from '../entities/ProductVariantAttribute';

@Controller('product-variant-attributes')
export class ProductVariantAttributeController {
  constructor(
    private readonly productVariantAttributeService: ProductVariantAttributeService,
  ) {}

  @Post()
  create(@Body() data: Partial<ProductVariantAttribute>) {
    return this.productVariantAttributeService.create(data);
  }

  @Get()
  findAll() {
    return this.productVariantAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productVariantAttributeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<ProductVariantAttribute>) {
    return this.productVariantAttributeService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productVariantAttributeService.delete(id);
  }
}
