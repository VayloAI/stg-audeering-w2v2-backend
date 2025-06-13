import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("vaylo_audio_gender")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("file_id", "varchar", (col) => col.notNull())
    .addColumn("male_prob", "real", (col) =>
      col.check(sql`male_prob BETWEEN 0 AND 1`),
    )
    .addColumn("female_prob", "real", (col) =>
      col.check(sql`female_prob BETWEEN 0 AND 1`),
    )
    .addColumn("status", "integer", (col) =>
      col.check(sql`status in (-1, 0, 1, 2)`).notNull(),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("vaylo_audio_gender").execute();
}
