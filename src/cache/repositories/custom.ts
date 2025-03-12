import { Example } from "@/schemas/custom";
import BaseRepository from "./base";
import { cache } from "../cache";

export default class ExampleRepository extends BaseRepository {
  repositoryName = "example";
  dateFields = ["created_at"];

  async get(id: number): Promise<Example | undefined> {
    const result = await cache.hget(this.getKey(), String(id));

    return this.reviveJSON<Example>(result);
  }
}

export const exampleRepository = new ExampleRepository();
