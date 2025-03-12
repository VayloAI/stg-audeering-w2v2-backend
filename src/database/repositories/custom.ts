import { Example } from "@/schemas/custom";
import { db } from "../database";
import BaseRepository from "./base";

export default class ExampleRepository extends BaseRepository {
  constructor() {
    super("vaylo_example");
  }

  async get(id: number): Promise<Example | undefined> {
    const query = db.selectFrom(this.dbName).where("id", "=", id);
    return await query.selectAll().executeTakeFirst();
  }
}

export const exampleRepository = new ExampleRepository();
