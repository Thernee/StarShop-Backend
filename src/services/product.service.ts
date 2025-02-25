import { Repository } from 'typeorm';
import { Product } from '../entities/Product';
import { ProductType } from '../entities/ProductType';
import AppDataSource from '../config/ormconfig';

export interface ProductFilters {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
}

export type SortBy = 'price_asc' | 'price_desc' | 'newest' | 'popular';

export class ProductService {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async create(data: Partial<Product>, productTypeId: number): Promise<Product | null> {
    const productTypeRepo = AppDataSource.getRepository(ProductType);
    const productType = await productTypeRepo.findOne({ where: { id: productTypeId } });

    if (!productType) return null;

    const product = this.repository.create({ ...data, productType });
    return await this.repository.save(product);
  }

  async getAll(filters?: {
    category?: number;
    minPrice?: number;
    maxPrice?: number;
    availability?: boolean;
    minRating?: number;
    sortBy?: 'price' | 'createdAt' | 'popularity';
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<Product[]> {
    const query = this.repository.createQueryBuilder('product')
      .leftJoinAndSelect('product.productType', 'productType');

    if (filters?.category !== undefined) {
      query.andWhere('productType.id = :category', { category: filters.category });
    }

    if (filters?.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters?.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters?.availability !== undefined) {
      if (filters.availability) {
        query.andWhere('product.stockCount > 0');
      } else {
        query.andWhere('product.stockCount <= 0');
      }
    }

    if (filters?.minRating !== undefined) {
      query.andWhere('product.averageRating >= :minRating', { minRating: filters.minRating });
    }

    if (filters?.sortBy) {
      const order = filters.sortOrder || 'ASC';
      switch (filters.sortBy) {
        case 'price':
          query.orderBy('product.price', order);
          break;
        case 'createdAt':
          query.orderBy('product.createdAt', 'DESC');
          break;
        case 'popularity':
          query.orderBy('product.salesCount', 'DESC');
          break;
        default:
          query.orderBy('product.createdAt', 'DESC');
      }
    } else {
    query.orderBy('product.createdAt', 'DESC');
    }

    return await query.getMany();
  }

  async getById(id: number): Promise<Product | null> {
    return await this.repository.findOne({ where: { id }, relations: ['productType'] });
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;

    Object.assign(product, data);
    return await this.repository.save(product);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected === 1;
  }
}
