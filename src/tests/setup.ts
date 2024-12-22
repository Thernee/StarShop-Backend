import AppDataSource from "../config/ormconfig";

beforeAll(async () => {
  console.log("Initializing database...");
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log("Database initialized.");

  if (process.env.NODE_ENV === "test") {
    console.log("Synchronizing database...");
    await AppDataSource.synchronize();
    console.log("Database synchronized.");
  }
});

afterEach(async () => {
  console.log("Clearing database...");
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName};`);
  }
  console.log("Database cleared.");
});

afterAll(async () => {
  console.log("Destroying database...");
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  console.log("Database destroyed.");
});
