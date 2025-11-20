import { useForm, Controller } from 'react-hook-form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Button } from '~/components/ui/button';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea' | 'phone' | 'time' | 'datetime' | 'radio' | 'file' | 'signature' | 'section';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  width?: 'full' | 'half' | 'third' | 'quarter';
}

interface DynamicFormRendererProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  defaultValues?: Record<string, any>;
}

export default function DynamicFormRenderer({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
  defaultValues = {},
}: DynamicFormRendererProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? defaultValues[field.name];
      return acc;
    }, {} as Record<string, any>),
  });

  const renderField = (field: FormField) => {
    const error = errors[field.name];
    const widthClass = field.width === 'half' ? 'md:col-span-2' : 
                      field.width === 'third' ? 'md:col-span-4' :
                      field.width === 'quarter' ? 'md:col-span-3' : 'col-span-full';

    // Section header
    if (field.type === 'section') {
      return (
        <div key={field.id} className={`${widthClass} mt-6 mb-4`}>
          <h3 className="text-lg font-semibold">{field.label}</h3>
          {field.helpText && (
            <p className="text-sm text-muted-foreground mt-1">{field.helpText}</p>
          )}
        </div>
      );
    }

    const fieldElement = (() => {
      switch (field.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Controller
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <Select {...controllerField}>
                  <SelectTrigger id={field.id}>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Controller
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`${field.id}_${option.value}`}
                        value={option.value}
                        checked={controllerField.value === option.value}
                        onChange={() => controllerField.onChange(option.value)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={`${field.id}_${option.value}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="tel"
              {...register(field.name, {
                required: field.required,
                pattern: /^[\d\s\-\+\(\)]+$/,
              })}
              placeholder={field.placeholder || '(555) 123-4567'}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="time"
              {...register(field.name, { required: field.required })}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="datetime-local"
              {...register(field.name, { required: field.required })}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="file"
              {...register(field.name, { required: field.required })}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground">Signature pad would go here</p>
              <p className="text-xs text-muted-foreground mt-2">(Signature component integration needed)</p>
            </div>
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Controller
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <Checkbox
                  id={field.id}
                  checked={controllerField.value}
                  onCheckedChange={controllerField.onChange}
                />
              )}
            />
            <Label htmlFor={field.id} className="font-normal">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && <p className="text-xs text-muted-foreground ml-6">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500 ml-6">This field is required</p>}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <textarea
              id={field.id}
              {...register(field.name, { 
                required: field.required,
                minLength: field.validation?.minLength,
                maxLength: field.validation?.maxLength,
              })}
              placeholder={field.placeholder}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              {...register(field.name, {
                required: field.required,
                min: field.validation?.min,
                max: field.validation?.max,
              })}
              placeholder={field.placeholder}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              {...register(field.name, { required: field.required })}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              {...register(field.name, {
                required: field.required,
                pattern: field.validation?.pattern ? new RegExp(field.validation.pattern) : undefined,
                minLength: field.validation?.minLength,
                maxLength: field.validation?.maxLength,
              })}
              placeholder={field.placeholder}
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );
      }
    })();

    return (
      <div key={field.id} className={widthClass}>
        {fieldElement}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {fields.map(renderField)}
      </div>
      <div className="col-span-full">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

