import { testDataSource } from "../config/ormconfig.test";

export const setupTestDB = async () => {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }
  await testDataSource.synchronize(true); // Sync
};
export const teardownTestDB = async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
};
