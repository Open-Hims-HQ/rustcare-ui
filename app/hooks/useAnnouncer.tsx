import { useEffect, useRef, useCallback } from "react";

/**
 * Hook for announcing messages to screen readers
 * Uses ARIA live regions to provide feedback for dynamic content
 * 
 * WCAG 2.2 Level AA Compliance:
 * - Status messages (4.1.3)
 * - Dynamic content updates
 */

export type AnnouncementPriority = "polite" | "assertive";

export interface AnnouncementOptions {
  priority?: AnnouncementPriority;
  clearAfter?: number; // milliseconds
}

export function useAnnouncer() {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  /**
   * Announce a message to screen readers
   * 
   * @param message - The message to announce
   * @param options - Configuration options
   * @param options.priority - "polite" (default) waits for user to finish, "assertive" interrupts immediately
   * @param options.clearAfter - Clear the announcement after specified milliseconds (default: 5000)
   */
  const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
    const { priority = "polite", clearAfter = 5000 } = options;
    const targetRef = priority === "assertive" ? assertiveRef : politeRef;

    if (targetRef.current) {
      // Clear any existing announcement
      targetRef.current.textContent = "";
      
      // Trigger a reflow to ensure screen readers notice the change
      void targetRef.current.offsetHeight;
      
      // Set the new announcement
      targetRef.current.textContent = message;

      // Auto-clear after specified time
      if (clearAfter > 0) {
        setTimeout(() => {
          if (targetRef.current) {
            targetRef.current.textContent = "";
          }
        }, clearAfter);
      }
    }
  }, []);

  /**
   * Announce a success message
   * Uses polite priority
   */
  const announceSuccess = useCallback((message: string) => {
    announce(message, { priority: "polite" });
  }, [announce]);

  /**
   * Announce an error message
   * Uses assertive priority to interrupt
   */
  const announceError = useCallback((message: string) => {
    announce(message, { priority: "assertive" });
  }, [announce]);

  /**
   * Announce loading state
   * Uses polite priority
   */
  const announceLoading = useCallback((message: string = "Loading...") => {
    announce(message, { priority: "polite", clearAfter: 0 });
  }, [announce]);

  /**
   * Clear all announcements
   */
  const clear = useCallback(() => {
    if (politeRef.current) politeRef.current.textContent = "";
    if (assertiveRef.current) assertiveRef.current.textContent = "";
  }, []);

  // Render the ARIA live regions
  const Announcer = useCallback(() => (
    <>
      {/* Polite announcements - doesn't interrupt */}
      <div
        ref={politeRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      {/* Assertive announcements - interrupts immediately */}
      <div
        ref={assertiveRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  ), []);

  return {
    announce,
    announceSuccess,
    announceError,
    announceLoading,
    clear,
    Announcer,
  };
}

/**
 * Common announcement messages for consistency
 */
export const AnnouncementMessages = {
  // Form actions
  FORM_SUBMITTED: "Form submitted successfully",
  FORM_ERROR: "Form submission failed. Please check the errors and try again",
  FIELD_REQUIRED: (field: string) => `${field} is required`,
  FIELD_INVALID: (field: string) => `${field} is invalid`,
  
  // CRUD operations
  CREATED: (item: string) => `${item} created successfully`,
  UPDATED: (item: string) => `${item} updated successfully`,
  DELETED: (item: string) => `${item} deleted successfully`,
  CREATE_ERROR: (item: string) => `Failed to create ${item}`,
  UPDATE_ERROR: (item: string) => `Failed to update ${item}`,
  DELETE_ERROR: (item: string) => `Failed to delete ${item}`,
  
  // Loading states
  LOADING: (item: string = "content") => `Loading ${item}...`,
  LOADING_COMPLETE: (item: string = "content") => `${item} loaded`,
  
  // Navigation
  NAVIGATING: (destination: string) => `Navigating to ${destination}`,
  PAGE_LOADED: (page: string) => `${page} page loaded`,
  
  // Role/Permission actions
  ROLE_ASSIGNED: (role: string, user: string) => `${role} role assigned to ${user}`,
  ROLE_REMOVED: (role: string, user: string) => `${role} role removed from ${user}`,
  PERMISSION_GRANTED: (permission: string) => `${permission} permission granted`,
  PERMISSION_REVOKED: (permission: string) => `${permission} permission revoked`,
  
  // Compliance
  COMPLIANCE_CHECK_PASSED: "Compliance check passed",
  COMPLIANCE_CHECK_FAILED: "Compliance check failed. Please review the errors",
  FRAMEWORK_ACTIVATED: (framework: string) => `${framework} framework activated`,
  FRAMEWORK_DEACTIVATED: (framework: string) => `${framework} framework deactivated`,
  
  // Organization
  ORGANIZATION_ACTIVATED: (name: string) => `${name} organization activated`,
  ORGANIZATION_DEACTIVATED: (name: string) => `${name} organization deactivated`,
  
  // Dialog/Modal
  DIALOG_OPENED: (title: string) => `${title} dialog opened`,
  DIALOG_CLOSED: "Dialog closed",
  
  // Generic
  ACTION_COMPLETE: "Action completed successfully",
  ACTION_FAILED: "Action failed. Please try again",
  CHANGES_SAVED: "Changes saved",
  CHANGES_DISCARDED: "Changes discarded",
} as const;
