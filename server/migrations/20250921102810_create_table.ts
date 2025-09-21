import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("recurringSlot", (table) => {
    table.increments("id").primary();
    table.integer("day_of_week").notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("exceptionSlot", (table) => {
    table.increments("id").primary();
    table
      .integer("recurring_slot_id")
      .unsigned()
      .references("id")
      .inTable("recurringSlot")
      .onDelete("CASCADE");

    table.date("date").notNullable();
    table.time("start_time");
    table.time("end_time");
    table.enu("status", ["edited", "deleted"]).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("exceptionSlot");
  await knex.schema.dropTableIfExists("recurringSlot");
}
