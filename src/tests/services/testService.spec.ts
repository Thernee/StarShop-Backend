import { setupTestDB, teardownTestDB } from "../../utils/test-utils";
import testDataSource from "../../config/ormconfig.test";
import { TestService } from "../../services/test.service";
import { TestEntity } from "../../entities/testEntity";

describe("TestService", () => {
  let service: TestService;

  beforeAll(async () => {
    await setupTestDB();
    service = new TestService(testDataSource);

    const repo = testDataSource.getRepository(TestEntity);
    await repo.save({ name: "Existing Entity" });
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should return true if the entity exists", async () => {
    const result = await service.validateEntityExists("Existing Entity");
    expect(result).toBe(true);
  });

  it("should return false if the entity does not exist", async () => {
    const result = await service.validateEntityExists("Nonexistent Entity");
    expect(result).toBe(false);
  });

  it("should retrieve an entity by name", async () => {
    const entity = await service.getEntityByName("Existing Entity");
    expect(entity).toBeDefined();
    expect(entity?.name).toBe("Existing Entity");
  });
});
