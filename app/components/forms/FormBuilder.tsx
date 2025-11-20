/**
 * Visual Form Builder Component
 * 
 * Allows users to create forms visually by dragging and dropping fields.
 * Used by doctors, nurses, admins, and management to create custom forms
 * for their daily workflows.
 */

import { useState, useCallback } from 'react';
import { useFetcher } from '@remix-run/react';
import { Plus, Trash2, GripVertical, Save, Eye, Settings, FileText } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Checkbox } from '~/components/ui/checkbox';
import { Textarea } from '~/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import DynamicFormRenderer, { type FormField } from './DynamicFormRenderer';
import FormTemplates, { type FormTemplate } from './FormTemplates';

export interface FormBuilderField extends FormField {
  fieldType: string; // Internal type for builder
  helpText?: string;
  width?: 'full' | 'half' | 'third' | 'quarter';
}

interface FormBuilderProps {
  formId?: string;
  initialFields?: FormBuilderField[];
  moduleName: string;
  entityType?: string;
  onSave?: (formData: FormDefinition) => void;
  onPreview?: (fields: FormBuilderField[]) => void;
}

export interface FormDefinition {
  form_name: string;
  form_slug: string;
  display_name: string;
  description?: string;
  module_name: string;
  entity_type?: string;
  form_schema: FormBuilderField[];
  form_layout?: any;
  is_template?: boolean;
  category?: string;
  icon?: string;
  tags?: string[];
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'phone', label: 'Phone', icon: '📞' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'time', label: 'Time', icon: '⏰' },
  { value: 'datetime', label: 'Date & Time', icon: '📆' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '▼' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'file', label: 'File Upload', icon: '📎' },
  { value: 'signature', label: 'Signature', icon: '✍️' },
  { value: 'section', label: 'Section Header', icon: '📋' },
];

export default function FormBuilder({
  formId,
  initialFields = [],
  moduleName,
  entityType,
  onSave,
  onPreview,
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormBuilderField[]>(initialFields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [formMeta, setFormMeta] = useState({
    form_name: '',
    form_slug: '',
    display_name: '',
    description: '',
    category: '',
    icon: '',
  });
  const [previewMode, setPreviewMode] = useState(false);
  const fetcher = useFetcher();

  const addField = useCallback((fieldType: string) => {
    const newField: FormBuilderField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type: fieldType as any,
      fieldType,
      required: false,
      width: 'full',
    };

    // Add options for select/radio fields
    if (fieldType === 'select' || fieldType === 'radio') {
      newField.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
    }

    setFields([...fields, newField]);
    setSelectedField(newField.id);
  }, [fields]);

  const removeField = useCallback((fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  }, [fields, selectedField]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormBuilderField>) => {
    setFields(fields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ));
  }, [fields]);

  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [moved] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, moved);
    setFields(newFields);
  }, [fields]);

  const selectedFieldData = fields.find(f => f.id === selectedField);

  const handleSave = async () => {
    if (!formMeta.form_name || !formMeta.form_slug || !formMeta.display_name) {
      alert('Please fill in form name, slug, and display name');
      return;
    }

    const formData: FormDefinition = {
      form_name: formMeta.form_name,
      form_slug: formMeta.form_slug,
      display_name: formMeta.display_name,
      description: formMeta.description,
      module_name: moduleName,
      entity_type: entityType,
      form_schema: fields.map(({ fieldType, ...field }) => field),
      category: formMeta.category,
      icon: formMeta.icon,
      tags: [],
    };

    if (onSave) {
      onSave(formData);
    } else {
      // Save via API
      fetcher.submit(
        { ...formData, form_schema: JSON.stringify(formData.form_schema) },
        { method: 'POST', action: '/api/v1/forms' }
      );
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(fields);
    }
    setPreviewMode(true);
  };

  return (
    <div className="space-y-6">
      {/* Form Metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Information</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select a Template</DialogTitle>
                </DialogHeader>
                <FormTemplates
                  onSelectTemplate={(template) => {
                    setFields(template.fields);
                    setFormMeta({
                      ...formMeta,
                      form_name: template.id,
                      form_slug: template.id,
                      display_name: template.name,
                      description: template.description,
                      category: template.category,
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Form Name *</Label>
            <Input
              value={formMeta.form_name}
              onChange={(e) => setFormMeta({ ...formMeta, form_name: e.target.value })}
              placeholder="e.g., patient-intake-form"
            />
          </div>
          <div className="space-y-2">
            <Label>Form Slug *</Label>
            <Input
              value={formMeta.form_slug}
              onChange={(e) => setFormMeta({ ...formMeta, form_slug: e.target.value })}
              placeholder="e.g., patient-intake"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Display Name *</Label>
            <Input
              value={formMeta.display_name}
              onChange={(e) => setFormMeta({ ...formMeta, display_name: e.target.value })}
              placeholder="e.g., Patient Intake Form"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Description</Label>
            <Textarea
              value={formMeta.description}
              onChange={(e) => setFormMeta({ ...formMeta, description: e.target.value })}
              placeholder="Describe what this form is used for..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={formMeta.category}
              onChange={(e) => setFormMeta({ ...formMeta, category: e.target.value })}
              placeholder="e.g., clinical, administrative"
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Input
              value={formMeta.icon}
              onChange={(e) => setFormMeta({ ...formMeta, icon: e.target.value })}
              placeholder="e.g., FileText"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Field Palette */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Add Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {FIELD_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addField(type.value)}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Form Fields List */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Form Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No fields yet. Add fields from the left panel.
                  </p>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedField === field.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setSelectedField(field.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{field.label}</span>
                          <span className="text-xs text-muted-foreground">({field.type})</span>
                          {field.required && (
                            <span className="text-xs text-red-500">*</span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Field Properties */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Field Properties</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFieldData ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Field Label</Label>
                      <Input
                        value={selectedFieldData.label}
                        onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field Name</Label>
                      <Input
                        value={selectedFieldData.name}
                        onChange={(e) => updateField(selectedFieldData.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Placeholder</Label>
                      <Input
                        value={selectedFieldData.placeholder || ''}
                        onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Help Text</Label>
                      <Input
                        value={selectedFieldData.helpText || ''}
                        onChange={(e) => updateField(selectedFieldData.id, { helpText: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedFieldData.required}
                        onCheckedChange={(checked) => 
                          updateField(selectedFieldData.id, { required: !!checked })
                        }
                      />
                      <Label>Required</Label>
                    </div>
                    {(selectedFieldData.type === 'select' || selectedFieldData.type === 'radio') && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {selectedFieldData.options?.map((option, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={option.value}
                              onChange={(e) => {
                                const newOptions = [...(selectedFieldData.options || [])];
                                newOptions[idx].value = e.target.value;
                                updateField(selectedFieldData.id, { options: newOptions });
                              }}
                              placeholder="Value"
                            />
                            <Input
                              value={option.label}
                              onChange={(e) => {
                                const newOptions = [...(selectedFieldData.options || [])];
                                newOptions[idx].label = e.target.value;
                                updateField(selectedFieldData.id, { options: newOptions });
                              }}
                              placeholder="Label"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(selectedFieldData.options || []), 
                              { value: '', label: '' }];
                            updateField(selectedFieldData.id, { options: newOptions });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    )}
                    {(selectedFieldData.type === 'number') && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Min Value</Label>
                          <Input
                            type="number"
                            value={selectedFieldData.validation?.min || ''}
                            onChange={(e) => updateField(selectedFieldData.id, {
                              validation: {
                                ...selectedFieldData.validation,
                                min: e.target.value ? Number(e.target.value) : undefined,
                              }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Value</Label>
                          <Input
                            type="number"
                            value={selectedFieldData.validation?.max || ''}
                            onChange={(e) => updateField(selectedFieldData.id, {
                              validation: {
                                ...selectedFieldData.validation,
                                max: e.target.value ? Number(e.target.value) : undefined,
                              }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select a field to edit properties
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicFormRenderer
                fields={fields.map(({ fieldType, ...field }) => field)}
                onSubmit={(data) => {
                  console.log('Form submitted:', data);
                  alert('Form submitted! Check console for data.');
                }}
                submitLabel="Submit Form"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleSave} disabled={fetcher.state === 'submitting'}>
          <Save className="h-4 w-4 mr-2" />
          {fetcher.state === 'submitting' ? 'Saving...' : 'Save Form'}
        </Button>
      </div>
    </div>
  );
}

