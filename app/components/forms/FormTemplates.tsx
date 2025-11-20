/**
 * Form Templates Component
 * 
 * Provides pre-built form templates for common hospital workflows
 * These can be used as starting points for creating new forms
 */

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { FileText, Stethoscope, Pill, DollarSign, Clipboard } from 'lucide-react';
import type { FormDefinition } from '~/lib/api.server';
import type { FormBuilderField } from './FormBuilder';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  module: string;
  category: string;
  icon: React.ReactNode;
  fields: FormBuilderField[];
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'patient-intake',
    name: 'Patient Intake Form',
    description: 'Collect patient demographics and basic information during registration',
    module: 'healthcare',
    category: 'clinical',
    icon: <FileText className="h-5 w-5" />,
    fields: [
      {
        id: 'section_1',
        name: 'section_personal',
        label: 'Personal Information',
        type: 'section',
        fieldType: 'section',
        required: false,
      },
      {
        id: 'field_1',
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        fieldType: 'text',
        required: true,
        placeholder: 'Enter first name',
        width: 'half',
      },
      {
        id: 'field_2',
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        fieldType: 'text',
        required: true,
        placeholder: 'Enter last name',
        width: 'half',
      },
      {
        id: 'field_3',
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        fieldType: 'date',
        required: true,
        width: 'half',
      },
      {
        id: 'field_4',
        name: 'gender',
        label: 'Gender',
        type: 'select',
        fieldType: 'select',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
        width: 'half',
      },
      {
        id: 'field_5',
        name: 'phone',
        label: 'Phone Number',
        type: 'phone',
        fieldType: 'phone',
        required: true,
        placeholder: '(555) 123-4567',
        width: 'half',
      },
      {
        id: 'field_6',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        fieldType: 'email',
        required: false,
        placeholder: 'patient@example.com',
        width: 'half',
      },
      {
        id: 'section_2',
        name: 'section_address',
        label: 'Address',
        type: 'section',
        fieldType: 'section',
        required: false,
      },
      {
        id: 'field_7',
        name: 'address_line1',
        label: 'Address Line 1',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'full',
      },
      {
        id: 'field_8',
        name: 'address_line2',
        label: 'Address Line 2',
        type: 'text',
        fieldType: 'text',
        required: false,
        width: 'full',
      },
      {
        id: 'field_9',
        name: 'city',
        label: 'City',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'third',
      },
      {
        id: 'field_10',
        name: 'state',
        label: 'State/Province',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'third',
      },
      {
        id: 'field_11',
        name: 'postal_code',
        label: 'Postal Code',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'third',
      },
    ],
  },
  {
    id: 'vital-signs',
    name: 'Vital Signs',
    description: 'Record patient vital signs (temperature, blood pressure, pulse, etc.)',
    module: 'healthcare',
    category: 'clinical',
    icon: <Stethoscope className="h-5 w-5" />,
    fields: [
      {
        id: 'field_1',
        name: 'temperature',
        label: 'Temperature (°C)',
        type: 'number',
        fieldType: 'number',
        required: true,
        validation: { min: 30, max: 45 },
        helpText: 'Normal range: 36.1-37.2°C',
        width: 'half',
      },
      {
        id: 'field_2',
        name: 'systolic_bp',
        label: 'Systolic BP (mmHg)',
        type: 'number',
        fieldType: 'number',
        required: true,
        validation: { min: 50, max: 250 },
        width: 'half',
      },
      {
        id: 'field_3',
        name: 'diastolic_bp',
        label: 'Diastolic BP (mmHg)',
        type: 'number',
        fieldType: 'number',
        required: true,
        validation: { min: 30, max: 150 },
        width: 'half',
      },
      {
        id: 'field_4',
        name: 'heart_rate',
        label: 'Heart Rate (bpm)',
        type: 'number',
        fieldType: 'number',
        required: true,
        validation: { min: 30, max: 220 },
        width: 'half',
      },
      {
        id: 'field_5',
        name: 'respiratory_rate',
        label: 'Respiratory Rate (per minute)',
        type: 'number',
        fieldType: 'number',
        required: true,
        validation: { min: 8, max: 40 },
        width: 'half',
      },
      {
        id: 'field_6',
        name: 'oxygen_saturation',
        label: 'Oxygen Saturation (%)',
        type: 'number',
        fieldType: 'number',
        required: false,
        validation: { min: 70, max: 100 },
        width: 'half',
      },
      {
        id: 'field_7',
        name: 'pain_scale',
        label: 'Pain Scale (0-10)',
        type: 'number',
        fieldType: 'number',
        required: false,
        validation: { min: 0, max: 10 },
        helpText: '0 = No pain, 10 = Worst pain',
        width: 'half',
      },
      {
        id: 'field_8',
        name: 'measured_at',
        label: 'Measured At',
        type: 'datetime',
        fieldType: 'datetime',
        required: true,
        width: 'half',
      },
      {
        id: 'field_9',
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        fieldType: 'textarea',
        required: false,
        placeholder: 'Additional observations...',
        width: 'full',
      },
    ],
  },
  {
    id: 'medication-administration',
    name: 'Medication Administration Record',
    description: 'Record medication administration to patients',
    module: 'pharmacy',
    category: 'clinical',
    icon: <Pill className="h-5 w-5" />,
    fields: [
      {
        id: 'field_1',
        name: 'medication_name',
        label: 'Medication Name',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'full',
      },
      {
        id: 'field_2',
        name: 'dosage',
        label: 'Dosage',
        type: 'text',
        fieldType: 'text',
        required: true,
        placeholder: 'e.g., 500mg',
        width: 'half',
      },
      {
        id: 'field_3',
        name: 'route',
        label: 'Route',
        type: 'select',
        fieldType: 'select',
        required: true,
        options: [
          { value: 'oral', label: 'Oral' },
          { value: 'iv', label: 'IV' },
          { value: 'im', label: 'IM' },
          { value: 'subcutaneous', label: 'Subcutaneous' },
          { value: 'topical', label: 'Topical' },
          { value: 'inhalation', label: 'Inhalation' },
        ],
        width: 'half',
      },
      {
        id: 'field_4',
        name: 'time_given',
        label: 'Time Given',
        type: 'datetime',
        fieldType: 'datetime',
        required: true,
        width: 'half',
      },
      {
        id: 'field_5',
        name: 'given_by',
        label: 'Given By',
        type: 'text',
        fieldType: 'text',
        required: true,
        placeholder: 'Nurse name',
        width: 'half',
      },
      {
        id: 'field_6',
        name: 'patient_response',
        label: 'Patient Response',
        type: 'textarea',
        fieldType: 'textarea',
        required: false,
        placeholder: 'Any adverse reactions or observations...',
        width: 'full',
      },
    ],
  },
  {
    id: 'billing-form',
    name: 'Billing Information Form',
    description: 'Collect billing and insurance information',
    module: 'billing',
    category: 'administrative',
    icon: <DollarSign className="h-5 w-5" />,
    fields: [
      {
        id: 'section_1',
        name: 'section_insurance',
        label: 'Insurance Information',
        type: 'section',
        fieldType: 'section',
        required: false,
      },
      {
        id: 'field_1',
        name: 'insurance_provider',
        label: 'Insurance Provider',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'half',
      },
      {
        id: 'field_2',
        name: 'policy_number',
        label: 'Policy Number',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'half',
      },
      {
        id: 'field_3',
        name: 'group_number',
        label: 'Group Number',
        type: 'text',
        fieldType: 'text',
        required: false,
        width: 'half',
      },
      {
        id: 'field_4',
        name: 'coverage_type',
        label: 'Coverage Type',
        type: 'select',
        fieldType: 'select',
        required: true,
        options: [
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'tertiary', label: 'Tertiary' },
        ],
        width: 'half',
      },
      {
        id: 'section_2',
        name: 'section_billing',
        label: 'Billing Address',
        type: 'section',
        fieldType: 'section',
        required: false,
      },
      {
        id: 'field_5',
        name: 'billing_address',
        label: 'Billing Address',
        type: 'textarea',
        fieldType: 'textarea',
        required: false,
        width: 'full',
      },
    ],
  },
  {
    id: 'incident-report',
    name: 'Incident Report',
    description: 'Document incidents and near-misses',
    module: 'healthcare',
    category: 'administrative',
    icon: <Clipboard className="h-5 w-5" />,
    fields: [
      {
        id: 'field_1',
        name: 'incident_date',
        label: 'Incident Date/Time',
        type: 'datetime',
        fieldType: 'datetime',
        required: true,
        width: 'half',
      },
      {
        id: 'field_2',
        name: 'incident_type',
        label: 'Incident Type',
        type: 'select',
        fieldType: 'select',
        required: true,
        options: [
          { value: 'medication_error', label: 'Medication Error' },
          { value: 'patient_fall', label: 'Patient Fall' },
          { value: 'equipment_failure', label: 'Equipment Failure' },
          { value: 'documentation_error', label: 'Documentation Error' },
          { value: 'other', label: 'Other' },
        ],
        width: 'half',
      },
      {
        id: 'field_3',
        name: 'severity',
        label: 'Severity',
        type: 'radio',
        fieldType: 'radio',
        required: true,
        options: [
          { value: 'minor', label: 'Minor' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'severe', label: 'Severe' },
          { value: 'critical', label: 'Critical' },
        ],
        width: 'full',
      },
      {
        id: 'field_4',
        name: 'description',
        label: 'Description',
        type: 'textarea',
        fieldType: 'textarea',
        required: true,
        placeholder: 'Describe what happened...',
        width: 'full',
      },
      {
        id: 'field_5',
        name: 'actions_taken',
        label: 'Actions Taken',
        type: 'textarea',
        fieldType: 'textarea',
        required: true,
        placeholder: 'What actions were taken?',
        width: 'full',
      },
      {
        id: 'field_6',
        name: 'reported_by',
        label: 'Reported By',
        type: 'text',
        fieldType: 'text',
        required: true,
        width: 'half',
      },
    ],
  },
];

interface FormTemplatesProps {
  onSelectTemplate: (template: FormTemplate) => void;
}

export default function FormTemplates({ onSelectTemplate }: FormTemplatesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Form Templates</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Start with a pre-built template or create from scratch
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FORM_TEMPLATES.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.icon}
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <Badge variant="outline">{template.module}</Badge>
              </div>
              <CardDescription className="mt-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{template.category}</Badge>
                <Button
                  size="sm"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

