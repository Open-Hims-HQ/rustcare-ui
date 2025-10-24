/**
 * Central Type Definitions Export
 * 
 * Import types from this index file:
 * import { Organization, Employee, Role } from "~/types";
 */

// Common types
export * from "./common";

// Domain-specific types
export * from "./organization";
export * from "./employee";
export * from "./role";
export * from "./compliance";
export * from "./geographic";
export * from "./permissions";

// Re-export for convenience
export type { Organization, OrganizationType } from "./organization";
export type { Employee, Role as EmployeeRole } from "./employee";
export type { Role, Permission } from "./role";
export type { ComplianceRule, ComplianceFramework } from "./compliance";
export type { GeographicLocation, LocationType } from "./geographic";
export type { Resource, ResourceType } from "./permissions";
