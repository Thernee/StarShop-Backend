import { ProductVariantService } from '../../services/productVariant.service';
import { ProductVariant } from '../../entities/ProductVariant';
import { Repository } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { ProductType } from '../../entities/ProductType';
import { Product } from '../../entities/Product';

jest.mock('../../config/ormconfig', () => ({
    getRepository: jest.fn(),
}));

describe('ProductVariantService', () => {
    let service: ProductVariantService;
    let mockRepo: jest.Mocked<Repository<ProductVariant>>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            findAndCount: jest.fn(),
            manager: {
                transaction: jest.fn(),
            } as any,
        } as unknown as jest.Mocked<Repository<ProductVariant>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

        service = new ProductVariantService();
        (service as any).repository = mockRepo;
    });

    it('should create a ProductVariant with Product', async () => {
        const productTypeData = { id: 1, name: 'Electronics', description: 'Category for electronics', createdAt: new Date(), products: [] };
        const productData = { id: 1, name: 'Laptop', description: 'A high-end gaming laptop', productType: productTypeData, variants: [], createdAt: new Date() }; // Product data
        const variantData = { sku: 'LAP123', price: 999.99, stock: 10 };

        const savedVariant = { id: 1, ...variantData, product: productData, createdAt: new Date() };

        const productRepo = { findOne: jest.fn().mockResolvedValue(productData) };
        (AppDataSource.getRepository as jest.Mock)
            .mockReturnValueOnce(productRepo)
            .mockReturnValueOnce(mockRepo);

        mockRepo.create.mockReturnValue(savedVariant);
        mockRepo.save.mockResolvedValue(savedVariant);

        const result = await service.create(variantData, 1);

        expect(productRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockRepo.create).toHaveBeenCalledWith({ ...variantData, product: productData });
        expect(mockRepo.save).toHaveBeenCalledWith(savedVariant);
        expect(result).toEqual(savedVariant);
    });

    // Test: Missing Required Fields (sku, price, or stock missing)
    it('should throw an error when required fields are missing (e.g., sku or price)', async () => {
        const variantData = { stock: 10 };  // Missing sku and price
        await expect(service.create(variantData, 1)).rejects.toThrow('SKU, price, and stock are required');
    });

    // Test: Invalid Product Relationship (Product does not exist)
    it('should throw an error when the Product does not exist', async () => {
        const variantData = { sku: 'LAP123', price: 999.99, stock: 10 };
        const nonExistentProductId = 999;

        const productRepo = { findOne: jest.fn().mockResolvedValue(null) }; // Simulate no product found
        (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(productRepo);

        await expect(service.create(variantData, nonExistentProductId)).rejects.toThrow('Product not found');
    });

    // Test: Invalid Price (price is not a number)
    it('should throw an error when price is not a number', async () => {
        const variantData = { sku: 'LAP123', price: 'invalid', stock: 10 }; // Invalid price type (string instead of number)
        await expect(service.create(variantData, 1)).rejects.toThrow('Price must be a number');
    });

    // Test: Invalid Stock (negative stock value)
    it('should throw an error when stock is negative', async () => {
        const variantData = { sku: 'LAP123', price: 999.99, stock: -5 }; // Invalid stock (negative value)
        await expect(service.create(variantData, 1)).rejects.toThrow('Stock cannot be negative');
    });

    // Test: Attempt to delete a non-existent ProductVariant
    it('should throw an error when deleting a non-existent ProductVariant', async () => {
        mockRepo.delete.mockResolvedValue({ affected: 0 } as any);  // Simulate no rows affected (variant not found)
        await expect(service.delete(999)).rejects.toThrow('ProductVariant not found');
    });

    // Test: Valid Product Variant creation
    it('should successfully create a product variant with valid data', async () => {
        const productTypeData = { id: 1, name: 'Electronics', description: 'Category for electronics', createdAt: new Date() };
        const productData = { id: 1, name: 'Laptop', description: 'Gaming Laptop', productType: productTypeData, variants: [], createdAt: new Date() };
        const variantData = { sku: 'LAP123', price: 999.99, stock: 10 };

        const savedVariant = { id: 1, ...variantData, product: productData, createdAt: new Date() };
        const productRepo = { findOne: jest.fn().mockResolvedValue(productData) };
        (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(productRepo).mockReturnValueOnce(mockRepo);

        mockRepo.create.mockReturnValue(savedVariant);
        mockRepo.save.mockResolvedValue(savedVariant);

        const result = await service.create(variantData, 1);

        expect(result).toEqual(savedVariant);
    });
});
