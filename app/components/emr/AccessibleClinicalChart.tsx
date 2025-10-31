import React, { useState } from 'react';
import { 
  Volume2, Settings, Contrast, Eye, ZoomIn, Keyboard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import ClinicalChart from './ClinicalChart';
import { useAccessibility } from '~/lib/accessibility';
import { useAudioFeedback, AudioDescriptions } from '~/components/accessibility/AudioFeedback';
import { BrailleFormatter } from '~/components/accessibility/BrailleDisplay';

/**
 * Accessible Clinical Chart Component
 * 
 * Demonstrates integration of:
 * - Audio feedback (text-to-speech)
 * - Braille display support
 * - High contrast mode
 * - Font size adjustment
 * - Screen reader optimization
 * - Keyboard navigation
 * 
 * WCAG 2.2 Level AAA Compliance
 */
export default function AccessibleClinicalChart({ 
  patientId,
  patientName,
  patientInfo 
}: {
  patientId: string;
  patientName?: string;
  patientInfo?: {
    age?: number;
    dateOfBirth?: string;
    gender?: string;
    mrn?: string;
  };
}) {
  const accessibility = useAccessibility();
  const audio = useAudioFeedback({
    enabled: accessibility.preferences.audioEnabled,
    rate: accessibility.preferences.audioRate,
    pitch: accessibility.preferences.audioPitch,
    volume: accessibility.preferences.audioVolume
  });

  const [showControls, setShowControls] = useState(false);

  // Screen reader announcement for page load
  React.useEffect(() => {
    if (patientName && accessibility.preferences.verboseAnnouncements) {
      const announcement = AudioDescriptions.patientInfo(
        patientName,
        patientInfo?.age || 0,
        patientInfo?.mrn || 'Unknown'
      );
      audio.speak(announcement, { priority: 'polite' });
    }
  }, []);

  const handleFontSizeChange = (size: 'small' | 'normal' | 'large' | 'xlarge') => {
    accessibility.updatePreferences({ fontSize: size });
    audio.speak(`Font size changed to ${size}`, { priority: 'polite' });
  };

  const toggleHighContrast = () => {
    const newValue = !accessibility.preferences.highContrast;
    accessibility.updatePreferences({ highContrast: newValue });
    audio.speak(
      newValue ? 'High contrast mode enabled' : 'High contrast mode disabled',
      { priority: 'polite' }
    );
  };

  const toggleAudio = () => {
    audio.toggleAudio();
    accessibility.updatePreferences({ audioEnabled: audio.audioEnabled });
  };

  const speakCurrentData = () => {
    if (patientName) {
      const patientData = BrailleFormatter.formatPatientInfo({
        name: patientName,
        age: patientInfo?.age || 0,
        mrn: patientInfo?.mrn || 'Unknown',
        dateOfBirth: patientInfo?.dateOfBirth,
        gender: patientInfo?.gender
      });
      audio.speak(patientData);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Accessibility Toolbar */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Accessibility Controls</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              aria-label={showControls ? "Hide accessibility controls" : "Show accessibility controls"}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showControls ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        
        {showControls && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Audio Feedback Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Audio</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={audio.audioEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={toggleAudio}
                    aria-label={audio.audioEnabled ? "Disable audio feedback" : "Enable audio feedback"}
                    className="flex-1"
                  >
                    {audio.audioEnabled ? 'On' : 'Off'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={speakCurrentData}
                    aria-label="Read patient information"
                    disabled={!audio.audioEnabled}
                  >
                    Play
                  </Button>
                </div>
              </div>

              {/* High Contrast Mode */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Contrast className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Contrast</span>
                </div>
                <Button
                  variant={accessibility.preferences.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={toggleHighContrast}
                  aria-label="Toggle high contrast mode"
                  className="w-full"
                >
                  {accessibility.preferences.highContrast ? 'High' : 'Normal'}
                </Button>
              </div>

              {/* Font Size Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Font</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={accessibility.preferences.fontSize === 'small' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFontSizeChange('small')}
                    aria-label="Set font size to small"
                  >
                    S
                  </Button>
                  <Button
                    variant={accessibility.preferences.fontSize === 'normal' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFontSizeChange('normal')}
                    aria-label="Set font size to normal"
                  >
                    M
                  </Button>
                  <Button
                    variant={accessibility.preferences.fontSize === 'large' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFontSizeChange('large')}
                    aria-label="Set font size to large"
                  >
                    L
                  </Button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <div className="flex flex-col gap-1">
                  {audio.audioEnabled && (
                    <Badge variant="success" className="text-xs">Audio On</Badge>
                  )}
                  {accessibility.preferences.highContrast && (
                    <Badge variant="success" className="text-xs">High Contrast</Badge>
                  )}
                  {accessibility.preferences.brailleEnabled && (
                    <Badge variant="success" className="text-xs">Braille Ready</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Support Indicator */}
            {!audio.isSupported && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  ⚠️ Your browser doesn't support audio feedback. Consider using Chrome, Edge, or Safari.
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Main Clinical Chart with Accessibility Features */}
      <div 
        role="region" 
        aria-label="Clinical chart"
        aria-describedby="clinical-chart-description"
        className="braille-optimized"
      >
        {/* Braille-optimized patient info */}
        <div className="sr-only" id="clinical-chart-description">
          {BrailleFormatter.formatPatientInfo({
            name: patientName || `Patient ${patientId}`,
            age: patientInfo?.age || 0,
            mrn: patientInfo?.mrn || 'Unknown',
            dateOfBirth: patientInfo?.dateOfBirth,
            gender: patientInfo?.gender
          })}
        </div>

        <ClinicalChart 
          patientId={patientId}
          patientName={patientName}
          patientInfo={patientInfo}
        />
      </div>

      {/* Keyboard Shortcuts Info */}
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold mb-2">Navigation</p>
              <div className="space-y-1 text-gray-600">
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Tab</kbd> - Next element</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Shift+Tab</kbd> - Previous element</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Enter</kbd> - Activate button</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Escape</kbd> - Close dialog</p>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Quick Actions</p>
              <div className="space-y-1 text-gray-600">
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Alt+A</kbd> - Toggle audio</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Alt+C</kbd> - Toggle contrast</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Alt+F</kbd> - Font size menu</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded border">Alt+S</kbd> - Skip to content</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

