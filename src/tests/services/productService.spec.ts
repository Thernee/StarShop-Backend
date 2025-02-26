import { ProductService } from '../../services/product.service';
import { Product } from '../../entities/Product';
import { Repository } from 'typeorm';
import { ProductType } from '../../entities/ProductType';
import AppDataSource from '../../config/ormconfig';

jest.mock('../../config/ormconfig', () => ({
  getRepository: jest.fn(),
}));

describe('ProductService', () => {
  let service: ProductService;
  let mockRepo: jest.Mocked<Repository<Product>>;

  beforeEach(() => {
    mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<Repository<Product>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

    service = new ProductService();
  });

  it('should create a Product with ProductType', async () => {
    const productData = { name: 'Laptop', description: 'Gaming Laptop' };
    const productType = { id: 1, name: 'Electronics', description: 'Category for electronics', createdAt: new Date(), products: [] };
    const savedProduct = {
      id: 1,
      ...productData,
      productType,
      variants: [],
      createdAt: new Date(),
    };

    const productTypeRepo = { findOne: jest.fn().mockResolvedValue(productType) };
    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce(productTypeRepo)
      .mockReturnValueOnce(mockRepo);

    mockRepo.create.mockReturnValue(savedProduct);
    mockRepo.save.mockResolvedValue(savedProduct);

    const result = await service.create(productData, 1);

    expect(productTypeRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepo.create).toHaveBeenCalledWith({ ...productData, productType });
    expect(result).toEqual(savedProduct);
  });

  // Test: Missing required fields (e.g., name and price)
  it('should throw an error when required fields are missing', async () => {
    const productData = { description: 'A product without a name or price' }; // Missing name and price
    const productType = { id: 1, name: 'Electronics', description: 'Category for electronics', createdAt: new Date() };

    const productTypeRepo = { findOne: jest.fn().mockResolvedValue(productType) };
    (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(productTypeRepo).mockReturnValueOnce(mockRepo);

    await expect(service.create(productData, 1)).rejects.toThrow('Name and price are required');
  });

  // Test: Invalid price type (should be a number)
  it('should throw an error when price is invalid', async () => {
    const productData = { name: 'Laptop', description: 'A gaming laptop', price: 'invalid' }; // Invalid price type (string instead of number)
    const productType = { id: 1, name: 'Electronics', description: 'Category for electronics', createdAt: new Date() };

    const productTypeRepo = { findOne: jest.fn().mockResolvedValue(productType) };
    (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(productTypeRepo).mockReturnValueOnce(mockRepo);

    await expect(service.create(productData, 1)).rejects.toThrow('Price must be a number');
  });

  // Test: Missing ProductType (ProductType not found in database)
  it('should throw an error when the ProductType does not exist', async () => {
    const productData = { name: 'Laptop', description: 'A gaming laptop', price: 100 };
    const invalidProductTypeId = 9999; // Invalid ProductType ID
    const productTypeRepo = { findOne: jest.fn().mockResolvedValue(null) };  // No product type found

    (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(productTypeRepo).mockReturnValueOnce(mockRepo);

    await expect(service.create(productData, invalidProductTypeId)).rejects.toThrow('ProductType not found');
  });

  // Test: Invalid ProductType ID (non-numeric value)
  it('should throw an error when productTypeId is invalid (non-numeric)', async () => {
    const productData = { name: 'Laptop', description: 'A gaming laptop', price: 100 };
    const invalidProductTypeId = 'invalid-id'; // Invalid productTypeId (string instead of a number)

    await expect(service.create(productData, invalidProductTypeId as any)).rejects.toThrow('ProductType ID must be a valid number');
  });

  // Test: Valid Product creation (happy path)
  it('should successfully create a product with valid data', async () => {
    const productData = { name: 'Laptop', description: 'Gaming Laptop', price: 100 };
    const productType = { id: 1, name: 'Electronics', description: 'Category for electronics', createdAt: new Date() };
    const savedProduct = {
      id: 1,
      ...productData,
      productType,
      variants: [],
      createdAt: new Date(),
    };

    const productTypeRepo = { findOne: jest.fn().mockResolvedValue(productType) };
    (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(productTypeRepo).mockReturnValueOnce(mockRepo);

    mockRepo.create.mockReturnValue(savedProduct);
    mockRepo.save.mockResolvedValue(savedProduct);

    const result = await service.create(productData, 1);

    expect(productTypeRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepo.create).toHaveBeenCalledWith({ ...productData, productType });
    expect(result).toEqual(savedProduct);
  });
});
