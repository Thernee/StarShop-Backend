import AppDataSource from "../config/ormconfig";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  if (process.env.NODE_ENV === "test") {
    await AppDataSource.synchronize();

    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.getTables();
    await queryRunner.release();
  }
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
