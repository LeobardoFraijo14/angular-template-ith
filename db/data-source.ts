import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ override: true });

const dataSource = new DataSource(dataSourceOption());

export function dataSourceOption(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity.{js,ts}'],
    migrations: ['db/migrations/*.{js,ts}'],
    synchronize: false,
  };
}

export default dataSource;
