import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantAttribute } from '../entities/ProductVariantAttribute';

@Injectable()
export class ProductVariantAttributeService {
  constructor(
    @InjectRepository(ProductVariantAttribute)
    private productVariantAttributeRepository: Repository<ProductVariantAttribute>,
  ) {}

  create(data: Partial<ProductVariantAttribute>) {
    return this.productVariantAttributeRepository.save(data);
  }

  findAll() {
    return this.productVariantAttributeRepository.find();
  }

  findOne(id: number) {
    return this.productVariantAttributeRepository.findOne({ where: { id } });
  }

  update(id: number, updatedData: Partial<ProductVariantAttribute>) {
    return this.productVariantAttributeRepository.update(id, updatedData);
  }

  delete(id: number) {
    return this.productVariantAttributeRepository.delete(id);
  }
}
