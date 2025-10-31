/**
 * Healthcare and Medical Record Types
 * Defines types for EMR system
 */

export interface MedicalRecord {
  id: string;
  organization_id: string;
  patient_id: string;
  provider_id: string;
  record_type: 'consultation' | 'diagnostic' | 'treatment' | 'prescription' | 'lab' | 'imaging' | 'vital_signs' | 'procedure' | 'emergency';
  title: string;
  description?: string;
  chief_complaint?: string;
  diagnosis?: Record<string, any>;
  treatments?: Record<string, any>;
  prescriptions?: Record<string, any>;
  test_results?: Record<string, any>;
  vital_signs?: Record<string, any>;
  visit_date: string;
  visit_duration_minutes?: number;
  location?: string;
  access_level: 'public' | 'restricted' | 'confidential';
  phi_present: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface HealthcareProvider {
  id: string;
  user_id: string;
  organization_id: string;
  license_number: string;
  license_state: string;
  license_expiry: string;
  specialty?: string;
  npi_number?: string;
  department?: string;
  is_active: boolean;
  created_at: string;
}

export interface MedicalRecordAuditLog {
  id: string;
  medical_record_id: string;
  accessed_by: string;
  access_type: 'view' | 'create' | 'update' | 'delete' | 'print' | 'export' | 'share';
  access_time: string;
  ip_address?: string;
  access_reason?: string;
  emergency_access: boolean;
  success: boolean;
}

export interface Appointment {
  id: string;
  organization_id: string;
  patient_id: string;
  provider_id: string;
  scheduled_time: string;
  duration_minutes: number;
  appointment_type: 'consultation' | 'follow_up' | 'urgent_care' | 'annual_physical' | 'specialist_referral' | 'telemedicine' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  notes?: string;
  cancellation_reason?: string;
  reminder_sent: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface VitalSigns {
  id: string;
  organization_id: string;
  patient_id: string;
  medical_record_id?: string;
  provider_id: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature_celsius?: number;
  weight_kg?: number;
  height_cm?: number;
  oxygen_saturation?: number;
  respiratory_rate?: number;
  recorded_at: string;
  notes?: string;
  recorded_by: string;
  created_at: string;
}

// Request/Response types
export interface CreateMedicalRecordRequest {
  organization_id: string;
  patient_id: string;
  record_type: string;
  title: string;
  description?: string;
  chief_complaint?: string;
  diagnosis?: Record<string, any>;
  treatments?: Record<string, any>;
  prescriptions?: Record<string, any>;
  visit_date: string;
  visit_duration_minutes?: number;
  location?: string;
  access_level?: string;
  access_reason: string;
}

export interface UpdateMedicalRecordRequest {
  title?: string;
  description?: string;
  chief_complaint?: string;
  diagnosis?: Record<string, any>;
  treatments?: Record<string, any>;
  prescriptions?: Record<string, any>;
  visit_duration_minutes?: number;
  location?: string;
  update_reason: string;
}

export interface ListMedicalRecordsParams {
  patient_id?: string;
  provider_id?: string;
  record_type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

