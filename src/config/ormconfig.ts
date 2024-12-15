import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../entities/*.ts'],
  migrations: [__dirname + '/../migrations/*.ts'],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  ssl: false,
  synchronize: false, // Set to true only in development; false in production
});

export default AppDataSource;
