import testDataSource from "../config/ormconfig.test";

beforeAll(async () => {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }

  await testDataSource.synchronize();
});

afterEach(async () => {
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
});
