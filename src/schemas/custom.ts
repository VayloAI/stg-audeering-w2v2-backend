import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

/**
 * Simple example of table logic
 */
export interface ExampleTable {
  id: Generated<number>;
  name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type Example = Selectable<ExampleTable>;
export type NewExample = Insertable<ExampleTable>;
export type ExampleUpdate = Updateable<ExampleTable>;
