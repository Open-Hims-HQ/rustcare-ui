/**
 * Form Viewer/Filler Page
 * 
 * Allows users to view and fill out forms by slug
 * Used by doctors, nurses, and staff to complete forms
 */

import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher, useNavigate } from '@remix-run/react';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import DynamicFormRenderer, { type FormField } from '~/components/forms/DynamicFormRenderer';
import { formsApi, type FormDefinition } from '~/lib/api.server';
import { apiRequest } from '~/lib/api.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response('Form slug is required', { status: 400 });
  }

  try {
    const form = await formsApi.getFormBySlug(request, slug);
    return json({ form });
  } catch (error) {
    console.error('Failed to load form:', error);
    throw new Response('Form not found', { status: 404 });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const slug = params.slug;
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'submit') {
    try {
      // Get form definition first
      const form = await formsApi.getFormBySlug(request, slug!);
      
      const submission = {
        form_definition_id: form.id,
        submission_data: JSON.parse(formData.get('submission_data') as string),
        entity_type: formData.get('entity_type') || undefined,
        entity_id: formData.get('entity_id') || undefined,
        notes: formData.get('notes') || undefined,
      };

      const result = await formsApi.submitForm(request, submission);
      return json({ success: true, submission: result });
    } catch (error: any) {
      console.error('Failed to submit form:', error);
      return json({ 
        success: false, 
        error: error.message || 'Failed to submit form' 
      }, { status: 400 });
    }
  }

  return json({ success: false }, { status: 400 });
}

export default function FormViewerPage() {
  const { form } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();
    formData.append('intent', 'submit');
    formData.append('submission_data', JSON.stringify(data));
    
    fetcher.submit(formData, { method: 'post' });
  };

  // Convert form schema to FormField array
  const fields: FormField[] = Array.isArray(form.form_schema) 
    ? form.form_schema 
    : [];

  if (fetcher.data?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Form Submitted Successfully!</h2>
              <p className="text-muted-foreground">
                Your form has been submitted and saved.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate(-1)} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Submit Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {form.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {form.category}
            </span>
          )}
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.display_name}</CardTitle>
            {form.description && (
              <p className="text-muted-foreground mt-2">{form.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>Module: {form.module_name}</span>
              {form.entity_type && <span>• Entity: {form.entity_type}</span>}
              {form.version > 1 && <span>• Version: {form.version}</span>}
            </div>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>This form has no fields configured.</p>
              </div>
            ) : (
              <>
                <DynamicFormRenderer
                  fields={fields}
                  onSubmit={handleSubmit}
                  submitLabel={fetcher.state === 'submitting' ? 'Submitting...' : 'Submit Form'}
                  isLoading={fetcher.state === 'submitting'}
                />
                {fetcher.data?.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{fetcher.data.error}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

