import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface AudioFeedbackProps {
  enabled?: boolean;
  rate?: number; // Speech rate (0.1 - 10, default 1.0)
  pitch?: number; // Voice pitch (0 - 2, default 1.0)
  volume?: number; // Volume (0 - 1, default 1.0)
}

/**
 * Audio Feedback Component
 * 
 * Provides text-to-speech functionality for visual content
 * WCAG 2.2 Level AAA Compliance:
 * - Audio description of visual information
 * - User control over audio playback
 * - Respects user preferences
 */
export function useAudioFeedback({
  enabled = true,
  rate = 1.0,
  pitch = 1.0,
  volume = 1.0
}: AudioFeedbackProps = {}) {
  const [audioEnabled, setAudioEnabled] = useState(enabled);
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    setIsSupported('speechSynthesis' in window);
  }, []);

  /**
   * Speak text using Web Speech API
   */
  const speak = (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    priority?: 'polite' | 'assertive';
  }) => {
    if (!audioEnabled || !isSupported) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || rate;
    utterance.pitch = options?.pitch || pitch;
    utterance.volume = options?.volume || volume;
    utterance.lang = 'en-US';

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Stop current speech
   */
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  /**
   * Toggle audio feedback
   */
  const toggleAudio = () => {
    if (isSpeaking) {
      stop();
    }
    setAudioEnabled(!audioEnabled);
  };

  return {
    speak,
    stop,
    toggleAudio,
    audioEnabled,
    isSpeaking,
    isSupported
  };
}

/**
 * Audio Feedback Control Button Component
 */
export function AudioFeedbackControl({
  enabled,
  onToggle
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-label={enabled ? "Disable audio feedback" : "Enable audio feedback"}
      className="gap-2"
    >
      {enabled ? (
        <>
          <Volume2 className="h-4 w-4" />
          <span className="sr-only">Audio enabled</span>
        </>
      ) : (
        <>
          <VolumeX className="h-4 w-4" />
          <span className="sr-only">Audio disabled</span>
        </>
      )}
    </Button>
  );
}

/**
 * Healthcare-specific audio descriptions
 */
export const AudioDescriptions = {
  // Patient information
  patientInfo: (name: string, age: number, mrn: string) => 
    `Patient ${name}, age ${age} years, Medical Record Number ${mrn}`,
  
  vitalSigns: (bp: string, hr: number, temp: string, spo2: number) =>
    `Vital signs: Blood pressure ${bp} millimeters of mercury, Heart rate ${hr} beats per minute, Temperature ${temp} Fahrenheit, Oxygen saturation ${spo2} percent`,
  
  // Clinical data
  labResults: (test: string, value: string, status: string) =>
    `Laboratory test ${test}, result ${value}, status ${status}`,
  
  medicationList: (medications: Array<{name: string, dose: string, frequency: string}>) =>
    `Medications: ${medications.map(m => `${m.name} ${m.dose} ${m.frequency}`).join(', ')}`,
  
  allergies: (allergens: Array<{substance: string, severity: string}>) =>
    `Allergies: ${allergens.map(a => `${a.substance}, severity ${a.severity}`).join(', ')}`,
  
  // Clinical notes
  clinicalNote: (provider: string, specialty: string, date: string, chiefComplaint: string) =>
    `Clinical note by ${provider}, ${specialty}, dated ${date}. Chief complaint: ${chiefComplaint}`,
  
  // Appointments
  appointment: (provider: string, date: string, time: string, type: string) =>
    `Appointment with ${provider} on ${date} at ${time} for ${type}`,
  
  // Status messages
  recordSaved: "Medical record saved successfully",
  recordUpdated: "Medical record updated successfully",
  recordDeleted: "Medical record deleted",
  
  // Form validation
  fieldRequired: (field: string) => `${field} is required`,
  fieldInvalid: (field: string) => `${field} contains an invalid value`,
  
  // Navigation
  pageLoaded: (page: string) => `${page} page loaded`,
  tabSwitched: (tab: string) => `Switched to ${tab} tab`,
  
  // Warnings and errors
  criticalAlert: (message: string) => `Critical alert: ${message}`,
  warningMessage: (message: string) => `Warning: ${message}`,
  errorMessage: (message: string) => `Error: ${message}`,
  
  // Charts and visualizations
  chartLoaded: (chartType: string, dataPoints: number) =>
    `${chartType} chart loaded with ${dataPoints} data points`,
  
  dataTable: (rows: number, columns: number) =>
    `Data table with ${rows} rows and ${columns} columns`,
} as const;

export default AudioFeedbackControl;

