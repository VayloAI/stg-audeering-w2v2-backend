import { AudioGender } from "@/schemas/gender";
import BaseRepository from "./base";
import { cache } from "../cache";

export default class AudioGenderRepository extends BaseRepository {
  repositoryName = "audio_gender";
  dateFields = ["created_at"];

  async get(fileId: string): Promise<AudioGender | undefined> {
    const result = await cache.hget(this.getKey(), fileId);

    return this.reviveJSON<AudioGender>(result);
  }

  async create(gender: AudioGender) {
    const hashKey = this.getKey();
    await cache.hset(hashKey, {
      [gender.file_id]: JSON.stringify(gender),
    });
    await cache.expire(hashKey, this.ttl);
  }

  async delete(fileId: string) {
    return await cache.hdel(this.getKey(), fileId);
  }
}

export const audioGenderRepository = new AudioGenderRepository();
