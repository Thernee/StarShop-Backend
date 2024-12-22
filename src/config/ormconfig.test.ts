import { DataSource } from 'typeorm';
import { TestEntity } from '../entities/testEntity';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { ProductType } from '../entities/ProductType';
import { ProductVariant } from '../entities/ProductVariant';
import { Attribute } from '../entities/Attribute';
import { AttributeValue } from '../entities/AttributeValue';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'testdb',
  synchronize: true,
  logging: false,
  entities: [TestEntity, User, Product, ProductType, ProductVariant, Attribute, AttributeValue],
});
