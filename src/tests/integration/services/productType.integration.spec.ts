import AppDataSource from "../../../config/ormconfig";
import { ProductVariant } from "../../../entities/ProductVariant";
import { Product } from "../../../entities/Product";
import { ProductVariantService } from "../../../services/productVariant.service";

describe("ProductVariantService Integration Tests", () => {
  let service: ProductVariantService;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    service = new ProductVariantService();
  });

  afterEach(async () => {
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("should create a ProductVariant with Product", async () => {
    const productRepo = AppDataSource.getRepository(Product);

    const product = productRepo.create({
      name: "Laptop",
      description: "High-end gaming laptop",
    });
    await productRepo.save(product);

    const variantData = { sku: "LAP123", price: 999.99, stock: 10 };
    const variant = await service.create({ ...variantData, product });

    expect(variant).toBeDefined();
    expect(variant.id).toBeDefined();
    expect(variant.sku).toBe("LAP123");
    expect(variant.product).toEqual(
      expect.objectContaining({
        id: product.id,
        name: "Laptop",
      })
    );
  });

  it("should fetch all ProductVariants with their Products", async () => {
    const productRepo = AppDataSource.getRepository(Product);
    const product = productRepo.create({ name: "Laptop" });
    await productRepo.save(product);

    const variantRepo = AppDataSource.getRepository(ProductVariant);
    const variant1 = variantRepo.create({ sku: "LAP123", price: 999.99, stock: 10, product });
    const variant2 = variantRepo.create({ sku: "LAP456", price: 899.99, stock: 5, product });

    await variantRepo.save([variant1, variant2]);

    const variants = await service.getAll();

    expect(variants).toBeDefined();
    expect(variants).toHaveLength(2);
    expect(variants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sku: "LAP123" }),
        expect.objectContaining({ sku: "LAP456" }),
      ])
    );
  });

  it("should delete a ProductVariant", async () => {
    const productRepo = AppDataSource.getRepository(Product);
    const product = productRepo.create({ name: "Laptop" });
    await productRepo.save(product);

    const variantRepo = AppDataSource.getRepository(ProductVariant);
    const variant = variantRepo.create({ sku: "LAP123", price: 999.99, stock: 10, product });
    await variantRepo.save(variant);

    const deleted = await service.delete(variant.id);

    expect(deleted).toBe(true);

    const foundVariant = await variantRepo.findOne({ where: { id: variant.id } });
    expect(foundVariant).toBeNull();
  });
});