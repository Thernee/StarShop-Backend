import testDataSource from "../../../config/ormconfig.test";
import { Product } from "../../../entities/Product";
import { ProductType } from "../../../entities/ProductType";
import { ProductVariant } from "../../../entities/ProductVariant";
import { ProductVariantService } from "../../../services/productVariant.service";

describe("ProductVariantService Integration Tests", () => {
  let service: ProductVariantService;

  beforeAll(async () => {
    if (!testDataSource.isInitialized) {
      await testDataSource.initialize();
    }
    await testDataSource.synchronize(true);

    service = new ProductVariantService();
  });

  afterAll(async () => {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  });

  afterEach(async () => {
    const entities = testDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = testDataSource.getRepository(entity.name);
      await repository.clear();
    }
  });
  
  it("should create a Product with a ProductType", async () => {
    const productTypeRepo = testDataSource.getRepository(ProductType);
    const productRepo = testDataSource.getRepository(Product);
  
    const productType = await productTypeRepo.save({ name: "Electronics", description: "..." });
    expect(productType.id).toBeDefined();
  
    const product = productRepo.create({ name: "Laptop", description: "Gaming", productType });
    const savedProduct = await productRepo.save(product);
    expect(savedProduct.id).toBeDefined();
  });
  

  it("should create a ProductVariant with Product", async () => {
    const productTypeRepo = testDataSource.getRepository(ProductType);
    const productRepo = testDataSource.getRepository(Product);

    const productType = productTypeRepo.create({
      name: "Electronics",
      description: "Category for electronics",
    });
    
    const savedProductType = await productTypeRepo.save(productType);
    expect(savedProductType.id).toBeDefined();

    const product = productRepo.create({
      name: "Laptop",
      description: "High-end gaming laptop",
      productType: savedProductType, 
    });
    const savedProduct = await productRepo.save(product);

    expect(savedProduct).toBeDefined();
    expect(savedProduct.id).toBeDefined(); 
    const variantData = { sku: "LAP123", price: 999.99, stock: 10 };
    const variant = await service.create(variantData, savedProduct.id);

    const existingProduct = await productRepo.findOne({ where: { id: savedProduct.id } });


    expect(variant).toBeDefined();
    expect(variant.id).toBeDefined();
    expect(variant.product).toEqual(
      expect.objectContaining({
        id: savedProduct.id,
        name: "Laptop",
      })
    );
  });
  it("should fetch ProductVariants associated with a Product", async () => {
    const productRepo = testDataSource.getRepository(Product);
    const variantRepo = testDataSource.getRepository(ProductVariant);
  
    const product = productRepo.create({ name: "Laptop" });
    const savedProduct = await productRepo.save(product);
  
    const variant1 = variantRepo.create({ sku: "LAP123", price: 1000, stock: 5, product: savedProduct });
    const variant2 = variantRepo.create({ sku: "LAP456", price: 1200, stock: 3, product: savedProduct });
  
    await variantRepo.save([variant1, variant2]);
  
    const fetchedProduct = await productRepo.findOne({
      where: { id: savedProduct.id },
      relations: ["variants"],
    });
  
    expect(fetchedProduct).toBeDefined();
    expect(fetchedProduct.variants).toHaveLength(2);
    expect(fetchedProduct.variants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sku: "LAP123" }),
        expect.objectContaining({ sku: "LAP456" }),
      ])
    );
  });  
});
