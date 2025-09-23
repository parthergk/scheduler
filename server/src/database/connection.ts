import knex from "knex";

export const client = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
});

