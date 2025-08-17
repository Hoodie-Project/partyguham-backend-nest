import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true,
  //synchronize: process.env.NODE_ENV !== 'prod',
  migrations: [__dirname + '/database/migrations/*.{ts,js}'],
  extra: {
    decimalNumbers: true, //decimal number type
  },
  // bigNumberStrings: false, // bigint number type
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV !== 'prod',
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source Initialized');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
