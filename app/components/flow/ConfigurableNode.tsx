import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import DynamicFormRenderer, { type FormField } from '~/components/forms/DynamicFormRenderer';
import type { NodeProps } from '@xyflow/react';

interface ConfigurableNodeProps extends NodeProps {
  data: {
    id: string;
    label: string;
    type: string;
    description?: string;
    status?: string;
    date?: string;
    config?: Record<string, any>;
    formFields?: FormField[];
    isConfigured?: boolean;
  };
}

export default function ConfigurableNode({ data, selected }: ConfigurableNodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-500';
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleConfigSubmit = async (formData: Record<string, any>) => {
    console.log('Configuration submitted for node:', data.id, formData);
    setIsConfigOpen(false);
  };

  // Determine if node has configuration based on type
  const hasConfiguration = data.type && ['consultation', 'diagnostic', 'treatment', 'prescription', 'lab'].includes(data.type);

  return (
    <>
      <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white min-w-[250px] transition-all ${
        selected ? 'border-blue-500 shadow-xl' : 'border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-gray-900">{data.label}</h3>
            {hasConfiguration && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfigOpen(true);
                }}
              >
                <Settings className={`h-3 w-3 ${data.isConfigured ? 'text-blue-600' : 'text-gray-400'}`} />
              </Button>
            )}
          </div>
          {data.status && (
            <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`} />
          )}
        </div>

        {/* Description */}
        {data.description && !isExpanded && (
          <p className="text-xs text-gray-600 truncate">{data.description}</p>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-200">
            {data.date && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Date:</span> {data.date}
              </p>
            )}
            {data.description && (
              <p className="text-xs text-gray-600">{data.description}</p>
            )}
            {data.config && Object.keys(data.config).length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-semibold text-gray-700">Configuration:</p>
                {Object.entries(data.config).map(([key, value]) => (
                  <div key={key} className="text-xs text-gray-600">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        {(data.description || data.config) && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 h-6 text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                More
              </>
            )}
          </Button>
        )}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure {data.label}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {data.formFields && data.formFields.length > 0 ? (
              <DynamicFormRenderer
                fields={data.formFields}
                onSubmit={handleConfigSubmit}
                submitLabel="Save Configuration"
                defaultValues={data.config || {}}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No configuration options available for this node type.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

