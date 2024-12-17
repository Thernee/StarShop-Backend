import { Repository } from 'typeorm';
import { ProductVariant } from '../entities/ProductVariant';
import { Product } from '../entities/Product';
import AppDataSource from '../config/ormconfig';

export class ProductVariantService {
  private repository: Repository<ProductVariant>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductVariant);
  }

  async create(data: Partial<ProductVariant>, productId: number): Promise<ProductVariant | null> {
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({ where: { id: productId } });

    if (!product) return null;

    const productVariant = this.repository.create({ ...data, product });
    return await this.repository.save(productVariant);
  }

  async getAll(): Promise<ProductVariant[]> {
    return await this.repository.find({ relations: ['product'] });
  }

  async getById(id: number): Promise<ProductVariant | null> {
    return await this.repository.findOne({ where: { id }, relations: ['product'] });
  }

  async update(id: number, data: Partial<ProductVariant>): Promise<ProductVariant | null> {
    const variant = await this.getById(id);
    if (!variant) return null;

    Object.assign(variant, data);
    return await this.repository.save(variant);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected === 1;
  }
}
