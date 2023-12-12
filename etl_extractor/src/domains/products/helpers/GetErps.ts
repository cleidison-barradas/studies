import { BaseModel, BaseRepository } from "@mypharma/api-core";

export async function GetErps<T extends BaseModel>(repository: BaseRepository<T>,): Promise<T[]> {
  let data = await repository.find()

  return data as T[]
}
