import { DataSource } from 'typeorm';
import { TestEntity } from '../entities/testEntity';
import { User } from '../entities/User';

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [TestEntity, User]
});
