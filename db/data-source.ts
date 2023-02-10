import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource(dataSourceOption());

export function dataSourceOption(load_src_entities = false): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.JWT_SECRET_KEY,
    port: 5433,
    username: process.env.JWT_SECRET_KEY || 'asda',
    password: '123123',
    database: 'nest-template-db',
    entities: [!load_src_entities ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
  };
}

export default dataSource;
// host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
