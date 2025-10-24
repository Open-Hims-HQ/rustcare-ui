/**
 * Common/Shared Type Definitions
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  search?: string;
  type?: string;
  status?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DashboardStats {
  label: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ComponentType;
}
