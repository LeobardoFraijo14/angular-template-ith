import { DataSourceOptions, DataSource } from 'typeorm';

const dataSource = new DataSource(dataSourceOption());
export default dataSource;

export function dataSourceOption(): DataSourceOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'batipibe7',
    database: 'nest-template-db',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
  };
}

// host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
