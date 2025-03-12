import BaseCacheRepository from "@/cache/repositories/base";
import BaseDBRepository from "@/database/repositories/base";

export default class BaseFacade<
  C extends BaseCacheRepository,
  D extends BaseDBRepository,
> {
  constructor(protected cacheRepository: C, protected dbRepository: D) {}
}
