export type SeasonType = 'HIGH' | 'MEDIUM' | 'LOW';
export type SeasonScope = 'GLOBAL' | 'REGION' | 'COUNTRY' | 'SUBREGION';
export type SeasonRecurrence = 'NONE' | 'YEARLY';

export interface SeasonDefinitionDto {
  id: number;
  name: string;
  seasonType: SeasonType;
  scope: SeasonScope;
  country: string | null;
  regionCode: string | null;
  region: string | null;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  recurrence: SeasonRecurrence;
  isSystem: boolean;
}

export interface SeasonRegionDto {
  code: string;
  name: string;
}

export interface CreateSeasonDefinitionRequest {
  name: string;
  seasonType: SeasonType;
  scope: SeasonScope;
  country?: string | null;
  regionCode?: string | null;
  region?: string | null;
  startDate: string;
  endDate: string;
  recurrence: SeasonRecurrence;
}

export type UpdateSeasonDefinitionRequest = CreateSeasonDefinitionRequest;

/** Visually-grouped set of seasons with the same name/type/scope/dates */
export interface GroupedSeason {
  /** Composite key used for grouping */
  key: string;
  /** First season in the group — used for name, type, dates, scope */
  representative: SeasonDefinitionDto;
  /** All seasons in the group */
  seasons: SeasonDefinitionDto[];
}
