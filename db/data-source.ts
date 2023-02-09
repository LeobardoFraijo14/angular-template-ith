import { DataSourceOptions, DataSource } from 'typeorm';

const dataSource = new DataSource(dataSourceOption());
export default dataSource;

export function dataSourceOption(load_src_entities = false): DataSourceOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '123123',
    database: 'nest-template-db',
    entities: [!load_src_entities ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
  };
}

// host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
