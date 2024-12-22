import { setupTestDB, teardownTestDB } from "../../utils/test-utils";
import { testDataSource } from "../../config/ormconfig.test";
import { UserService } from "../../services/User.service";
import { User } from "../../entities/User";


describe("UserService", () => {
  let service: UserService;

  beforeAll(async () => {
    await setupTestDB();
    service = new UserService(testDataSource);

    const userRepo = testDataSource.getRepository(User);
    await userRepo.save({
      name: "Existing User",
      email: "existing@example.com",
      walletAddress: "0x06D97198756295A96C2158a23963306f507b2f69",
      role: "buyer" as "buyer", // Explicit type cast
    });
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it("should create a new user", async () => {
    const newUser: Partial<User> = {
      name: "New User",
      email: "newuser@example.com",
      walletAddress: "0x07D97198756295A96C2158a23963306f507b2f70",
      role: "buyer", // Ensure it's a valid value
    };

    const createdUser = await service.createUser(newUser);
    expect(createdUser).toBeDefined();
    expect(createdUser.name).toBe("New User");
    expect(createdUser.email).toBe("newuser@example.com");
  });

  it("should not create a user with a duplicate wallet address", async () => {
    const duplicateUser: Partial<User> = {
      name: "Duplicate User",
      email: "duplicate@example.com",
      walletAddress: "0x06D97198756295A96C2158a23963306f507b2f69", // Same as pre-populated wallet address
      role: "buyer", // Ensure it's a valid value
    };

    await expect(service.createUser(duplicateUser)).rejects.toThrowError(
      "The wallet address is already in use. Please use a unique wallet address."
    );
  });

  it("should retrieve an existing user by ID", async () => {
    const userRepo = testDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: "existing@example.com" } });

    const fetchedUser = await service.getUserById(user?.id || 0);
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser?.email).toBe("existing@example.com");
  });

  it("should return null if the user does not exist", async () => {
    const nonExistentUser = await service.getUserById(9999);
    expect(nonExistentUser).toBeNull();
  });

  it("should update a user's information", async () => {
    const userRepo = testDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: "existing@example.com" } });

    const updatedUser = await service.updateUser(user?.id || 0, { name: "Updated User" });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe("Updated User");
  });

  it("should delete a user", async () => {
    const userRepo = testDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: "existing@example.com" } });

    const success = await service.deleteUser(user?.id || 0);
    expect(success).toBe(true);

    const deletedUser = await userRepo.findOne({ where: { email: "existing@example.com" } });
    expect(deletedUser).toBeNull();
  });
});
