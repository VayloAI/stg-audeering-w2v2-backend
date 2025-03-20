import BaseFacade from "./base";

import AudioGenderCacheRepository, {
  audioGenderRepository as audioGenderCacheRepository,
} from "@/cache/repositories/gender";
import AudioGenderDBRepository, {
  audioGenderRepository as audioGenderDBRepository,
} from "@/database/repositories/gender";
import {
  AudioGender,
  AudioGenderUpdate,
  NewAudioGender,
} from "@/schemas/gender";

export default class AudioGenderFacade extends BaseFacade<
  AudioGenderCacheRepository,
  AudioGenderDBRepository
> {
  constructor() {
    super(audioGenderCacheRepository, audioGenderDBRepository);
  }

  async get(fileId: string): Promise<AudioGender | undefined> {
    const cached = await this.cacheRepository.get(fileId);
    if (cached) {
      return cached;
    }

    const result = await this.dbRepository.get(fileId);
    if (result) {
      await this.cacheRepository.create(result);
    }

    return result;
  }

  async create(gender: NewAudioGender): Promise<AudioGender | undefined> {
    const result = await this.dbRepository.create(gender);
    if (result) {
      await this.cacheRepository.create(result);
    }

    return result;
  }

  async update(
    fileId: string,
    updateWith: AudioGenderUpdate,
  ): Promise<AudioGender | undefined> {
    await this.dbRepository.update(fileId, updateWith);
    const result = await this.dbRepository.get(updateWith.file_id ?? fileId);
    if (!result) {
      await this.cacheRepository.delete(fileId);
      return undefined;
    }

    await this.cacheRepository.create(result);
    return result;
  }
}

export const audioGenderFacade = new AudioGenderFacade();
