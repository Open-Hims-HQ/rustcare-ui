/**
 * Organization Type Definitions
 */

export type OrganizationType = "Hospital" | "Clinic" | "Lab" | "Pharmacy";

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: OrganizationType;
  address: string;
  contact: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface OrganizationStats {
  total: number;
  hospitals: number;
  clinics: number;
  labs: number;
  pharmacies: number;
  active: number;
}

export interface CreateOrganizationInput {
  name: string;
  code: string;
  type: OrganizationType;
  address: string;
  contact: string;
  is_active: boolean;
}

export interface UpdateOrganizationInput extends Partial<CreateOrganizationInput> {
  id: string;
}
