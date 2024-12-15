import { DataSource } from 'typeorm';
import express from 'express';
import request from 'supertest';
import { User } from '../../entities/User'; 
import userRoutes from '../../routes/UserRoutes';
import { generateWalletAddress } from '../../utils/user-utils';
// import { testDataSource } from "../../config/ormconfig.test";
import { setupTestDB, teardownTestDB } from '../../utils/test-utils';

// Create the test DataSource in the test file
const testDataSource = new DataSource({
  type: 'sqlite',     
  database: ':memory:',
  synchronize: true,  
  entities: [User],  
  logging: false,    
});

describe('User Routes (Test)', () => {
  let server: any;
  let port: number;
  let app: express.Application;

  beforeAll(async () => {
    await testDataSource.initialize();
    await setupTestDB(); 

    // Create express app and register the routes
    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);

    server = app.listen(0, () => {
      port = (server.address() as any).port;
      console.log(`Test server running on port ${port}`);
    });
  });

  afterAll(async () => {
    await testDataSource.destroy();
    await teardownTestDB(); 
    server.close();
  });

  // beforeEach(async () => {
  //   const userRepo = testDataSource.getRepository(User);
  //   await userRepo.clear(); // Clear the database before each test
  // });

  const walletAddr = generateWalletAddress()

  it('should create a new user', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      walletAddress: walletAddr,
      role: 'buyer',
    };

    const response = await request(app).post('/users/create').send(newUser);
    console.log(response.body)
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});