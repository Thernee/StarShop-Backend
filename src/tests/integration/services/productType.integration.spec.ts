import AppDataSource from "../../../config/ormconfig";
import { Product } from "../../../entities/Product";
import { ProductType } from "../../../entities/ProductType";
import { ProductService } from "../../../services/product.service";

describe("ProductService Integration Tests", () => {
  let service: ProductService;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    service = new ProductService();
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

  it("should create a Product with ProductType", async () => {
    const productTypeRepo = AppDataSource.getRepository(ProductType);

    const productType = productTypeRepo.create({
      name: "Electronics",
      description: "Category for electronics",
    });
    await productTypeRepo.save(productType);

    const productData = { name: "Laptop", description: "Gaming Laptop" };
    const product = await service.create(productData, productType.id);

    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(product.productType).toEqual(
      expect.objectContaining({
        id: productType.id,
        name: "Electronics",
      })
    );
  });

  it("should fetch Products associated with a ProductType", async () => {
    const productTypeRepo = AppDataSource.getRepository(ProductType);
    const productRepo = AppDataSource.getRepository(Product);

    const productType = productTypeRepo.create({ name: "Electronics" });
    const savedProductType = await productTypeRepo.save(productType);

    const product1 = productRepo.create({ name: "Laptop", productType: savedProductType });
    const product2 = productRepo.create({ name: "Phone", productType: savedProductType });

    await productRepo.save([product1, product2]);

    const fetchedProductType = await productTypeRepo.findOne({
      where: { id: savedProductType.id },
      relations: ["products"],
    });

    expect(fetchedProductType).toBeDefined();
    expect(fetchedProductType.products).toHaveLength(2);
    expect(fetchedProductType.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Laptop" }),
        expect.objectContaining({ name: "Phone" }),
      ])
    );
  });
});
