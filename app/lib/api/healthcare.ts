import type { MedicalRecord, HealthcareProvider } from '~/types/healthcare';
import { API_ENDPOINTS } from '~/constants/api';
import { serverFetch } from '../api.server';

// Medical Records API
export const medicalRecordsApi = {
  list: async (params?: {
    patient_id?: string;
    provider_id?: string;
    record_type?: string;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.patient_id) queryParams.set('patient_id', params.patient_id);
    if (params?.provider_id) queryParams.set('provider_id', params.provider_id);
    if (params?.record_type) queryParams.set('record_type', params.record_type);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORDS}?${queryString}`
      : API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORDS;
      
    return serverFetch<MedicalRecord[]>(endpoint);
  },
  
  get: async (recordId: string) => {
    return serverFetch<MedicalRecord>(API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORD_BY_ID(recordId));
  },
  
  create: async (record: Partial<MedicalRecord>) => {
    return serverFetch<MedicalRecord>(API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORDS, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },
  
  update: async (recordId: string, record: Partial<MedicalRecord>) => {
    return serverFetch<MedicalRecord>(API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORD_BY_ID(recordId), {
      method: 'PUT',
      body: JSON.stringify(record),
    });
  },
  
  delete: async (recordId: string) => {
    return serverFetch<void>(API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORD_BY_ID(recordId), {
      method: 'DELETE',
    });
  },
  
  getAudit: async (recordId: string) => {
    return serverFetch<any[]>(API_ENDPOINTS.HEALTHCARE.MEDICAL_RECORD_AUDIT(recordId));
  },
};

// Healthcare Providers API
export const providersApi = {
  list: async () => {
    return serverFetch<HealthcareProvider[]>(API_ENDPOINTS.HEALTHCARE.PROVIDERS);
  },
};

