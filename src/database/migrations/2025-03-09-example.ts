import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("vaylo_example")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("vaylo_example").execute();
}
