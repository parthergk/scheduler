import type { Knex } from "knex";
import * as dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection:{
      connectionString: process.env.DATABASE_URL
    },
    migrations:{
      directory: "./migrations",
      tableName: "knex_migrations"
    }
  },


  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  }
};

export default config;
