import React from 'react';

/**
 * Braille Display Component
 * 
 * Provides Braille support for visual content
 * WCAG 2.2 Level AAA Compliance:
 * - Support for refreshable Braille displays
 * - Proper ARIA labels and descriptions
 * - Screen reader compatibility
 * 
 * Note: Braille displays work through screen readers
 * This component ensures proper semantic markup and ARIA
 */

interface BrailleDisplayProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  hideVisualContent?: boolean;
}

/**
 * Clinical Data Display with Braille Support
 * Formats data for optimal Braille display readability
 */
export function ClinicalBrailleDisplay({
  children,
  label,
  description,
  hideVisualContent = false
}: BrailleDisplayProps) {
  const screenReaderContent = (
    <>
      {label && <div className="sr-only" aria-label={label} />}
      {description && <div className="sr-only" aria-describedby="braille-description" />}
      {description && <div id="braille-description" className="sr-only">{description}</div>}
    </>
  );

  if (hideVisualContent) {
    return <>{screenReaderContent}</>;
  }

  return (
    <div aria-label={label} aria-describedby={description ? "braille-description" : undefined}>
      {screenReaderContent}
      <div aria-hidden={false}>
        {children}
      </div>
    </div>
  );
}

/**
 * Braille-optimized medical data formatter
 * Ensures clear spacing and punctuation for Braille readers
 */
export class BrailleFormatter {
  /**
   * Format vital signs for Braille display
   */
  static formatVitalSigns(data: {
    bp?: string;
    hr?: number;
    temp?: string;
    spo2?: number;
    weight?: number;
    height?: string;
  }): string {
    const parts: string[] = [];
    
    if (data.bp) {
      parts.push(`Blood pressure, ${data.bp}`);
    }
    if (data.hr !== undefined) {
      parts.push(`Heart rate, ${data.hr} beats per minute`);
    }
    if (data.temp) {
      parts.push(`Temperature, ${data.temp} degrees Fahrenheit`);
    }
    if (data.spo2 !== undefined) {
      parts.push(`Oxygen saturation, ${data.spo2} percent`);
    }
    if (data.weight !== undefined) {
      parts.push(`Weight, ${data.weight} pounds`);
    }
    if (data.height) {
      parts.push(`Height, ${data.height}`);
    }
    
    return parts.join('. ');
  }

  /**
   * Format lab results for Braille
   */
  static formatLabResults(test: string, value: string, unit: string, status: string): string {
    return `${test}, ${value} ${unit}, Status: ${status}`;
  }

  /**
   * Format medications for Braille
   */
  static formatMedications(meds: Array<{
    name: string;
    dose: string;
    frequency: string;
    route: string;
  }>): string {
    return meds.map((med, idx) => 
      `Medication ${idx + 1}: ${med.name}, ${med.dose}, ${med.frequency}, Route: ${med.route}`
    ).join('. ');
  }

  /**
   * Format allergies for Braille
   */
  static formatAllergies(allergies: Array<{
    substance: string;
    severity: string;
    reaction?: string;
  }>): string {
    if (allergies.length === 0) {
      return 'No known allergies';
    }
    
    return allergies.map((allergy, idx) => {
      let desc = `Allergy ${idx + 1}: ${allergy.substance}, Severity: ${allergy.severity}`;
      if (allergy.reaction) {
        desc += `, Reaction: ${allergy.reaction}`;
      }
      return desc;
    }).join('. ');
  }

  /**
   * Format clinical note for Braille
   */
  static formatClinicalNote(note: {
    provider: string;
    specialty: string;
    date: string;
    time: string;
    chiefComplaint: string;
    assessment: string;
    plan: string;
  }): string {
    return (
      `Clinical note by ${note.provider}, ${note.specialty}. ` +
      `Date: ${note.date}, Time: ${note.time}. ` +
      `Chief complaint: ${note.chiefComplaint}. ` +
      `Assessment: ${note.assessment}. ` +
      `Plan: ${note.plan}`
    );
  }

  /**
   * Format patient information for Braille
   */
  static formatPatientInfo(patient: {
    name: string;
    age: number;
    mrn: string;
    dateOfBirth?: string;
    gender?: string;
  }): string {
    let info = `Patient: ${patient.name}. Age: ${patient.age} years. MRN: ${patient.mrn}`;
    
    if (patient.dateOfBirth) {
      info += `. Date of birth: ${patient.dateOfBirth}`;
    }
    if (patient.gender) {
      info += `. Gender: ${patient.gender}`;
    }
    
    return info;
  }

  /**
   * Format appointment information for Braille
   */
  static formatAppointment(apt: {
    provider: string;
    date: string;
    time: string;
    type: string;
    location?: string;
    status: string;
  }): string {
    let info = `Appointment with ${apt.provider}, ${apt.date} at ${apt.time}. ` +
               `Type: ${apt.type}. Status: ${apt.status}`;
    
    if (apt.location) {
      info += `. Location: ${apt.location}`;
    }
    
    return info;
  }
}

/**
 * Hook for Braille-optimized announcements
 */
export function useBrailleAnnouncer() {
  /**
   * Announce data in Braille-friendly format
   */
  const announceBraille = (data: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Data is automatically handled by screen readers for Braille displays
    const element = document.createElement('div');
    element.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-atomic', 'true');
    element.className = 'sr-only';
    element.textContent = data;
    
    document.body.appendChild(element);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(element);
    }, 5000);
  };

  return { announceBraille };
}

/**
 * Clinical data component with built-in Braille support
 */
export function ClinicalDataDisplay({
  label,
  data,
  type = 'generic'
}: {
  label: string;
  data: any;
  type?: 'vitals' | 'labs' | 'medications' | 'allergies' | 'note' | 'appointment' | 'patient' | 'generic';
}) {
  let formattedData = '';

  switch (type) {
    case 'vitals':
      formattedData = BrailleFormatter.formatVitalSigns(data);
      break;
    case 'labs':
      formattedData = BrailleFormatter.formatLabResults(
        data.test,
        data.value,
        data.unit,
        data.status
      );
      break;
    case 'medications':
      formattedData = BrailleFormatter.formatMedications(data);
      break;
    case 'allergies':
      formattedData = BrailleFormatter.formatAllergies(data);
      break;
    case 'note':
      formattedData = BrailleFormatter.formatClinicalNote(data);
      break;
    case 'appointment':
      formattedData = BrailleFormatter.formatAppointment(data);
      break;
    case 'patient':
      formattedData = BrailleFormatter.formatPatientInfo(data);
      break;
    default:
      formattedData = typeof data === 'string' ? data : JSON.stringify(data);
  }

  return (
    <div role="region" aria-label={label}>
      <div className="sr-only">
        {label}: {formattedData}
      </div>
      <div aria-hidden="false">
        {/* Visual content here */}
      </div>
    </div>
  );
}

export default ClinicalBrailleDisplay;

