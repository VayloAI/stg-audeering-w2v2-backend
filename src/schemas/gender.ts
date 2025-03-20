import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

import { ProcessStatus } from "@/types/process";

export interface AudioGenderTable {
  id: Generated<number>;
  file_id: string;
  male_prob: number | null;
  female_prob: number | null;
  status: ProcessStatus;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type AudioGender = Selectable<AudioGenderTable>;
export type NewAudioGender = Insertable<AudioGenderTable>;
export type AudioGenderUpdate = Updateable<AudioGenderTable>;
