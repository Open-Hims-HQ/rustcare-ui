/**
 * Geographic Location Type Definitions
 */

export type LocationType = "Country" | "State" | "City" | "District" | "Zone";

export interface GeographicLocation {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  parent_id: string | null;
  postal_codes: string[];
  metadata?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LocationHierarchy extends GeographicLocation {
  children?: LocationHierarchy[];
  parent?: GeographicLocation;
}

export interface CreateLocationInput {
  name: string;
  code: string;
  type: LocationType;
  parent_id?: string | null;
  postal_codes?: string[];
  metadata?: Record<string, unknown>;
  is_active: boolean;
}

export interface UpdateLocationInput extends Partial<CreateLocationInput> {
  id: string;
}

export interface LocationStats {
  total: number;
  countries: number;
  states: number;
  cities: number;
  districts: number;
}
