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
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
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

    switch (field.type) {
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
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
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={field.name}
              control={control}
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
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <textarea
              id={field.id}
              {...register(field.name, { required: field.required })}
              placeholder={field.placeholder}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
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
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
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
              })}
              placeholder={field.placeholder}
            />
            {error && <p className="text-xs text-red-500">This field is required</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(renderField)}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
}

