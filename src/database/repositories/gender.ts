import {
  AudioGender,
  AudioGenderUpdate,
  NewAudioGender,
} from "@/schemas/gender";
import { db } from "../database";
import BaseRepository from "./base";

export default class AudioGenderRepository extends BaseRepository {
  constructor() {
    super("vaylo_audio_gender");
  }

  async get(fileId: string): Promise<AudioGender | undefined> {
    const query = db.selectFrom(this.dbName).where("file_id", "=", fileId);
    return await query.selectAll().executeTakeFirst();
  }

  async create(gender: NewAudioGender): Promise<AudioGender | undefined> {
    return await db
      .insertInto(this.dbName)
      .values(gender)
      .returningAll()
      .executeTakeFirst();
  }

  async update(fileId: string, updateWith: AudioGenderUpdate) {
    return await db
      .updateTable(this.dbName)
      .set(updateWith)
      .where("file_id", "=", fileId)
      .execute();
  }

  async delete(fileId: string): Promise<AudioGender | undefined> {
    return await db
      .deleteFrom(this.dbName)
      .where("file_id", "=", fileId)
      .returningAll()
      .executeTakeFirst();
  }
}

export const audioGenderRepository = new AudioGenderRepository();
