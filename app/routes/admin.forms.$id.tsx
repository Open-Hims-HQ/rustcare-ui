/**
 * Form Detail/Edit Page
 * 
 * View form details, edit form, and view submissions
 */

import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher, Link } from '@remix-run/react';
import { ArrowLeft, Edit, Trash2, Eye, FileText, Users } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Badge } from '~/components/ui/badge';
import FormBuilder from '~/components/forms/FormBuilder';
import DynamicFormRenderer, { type FormField } from '~/components/forms/DynamicFormRenderer';
import { formsApi, type FormDefinition, type FormSubmission } from '~/lib/api.server';
import { apiRequest } from '~/lib/api.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) {
    throw new Response('Form ID is required', { status: 400 });
  }

  try {
    const [form, submissions] = await Promise.all([
      formsApi.getFormById(request, id),
      formsApi.getSubmissions(request, id).catch(() => []),
    ]);
    return json({ form, submissions });
  } catch (error) {
    console.error('Failed to load form:', error);
    throw new Response('Form not found', { status: 404 });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id;
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'update') {
    try {
      const updates: Partial<FormDefinition> = {};
      if (formData.get('display_name')) updates.display_name = formData.get('display_name') as string;
      if (formData.get('description')) updates.description = formData.get('description') as string;
      if (formData.get('form_schema')) updates.form_schema = JSON.parse(formData.get('form_schema') as string);
      if (formData.get('is_active')) updates.is_active = formData.get('is_active') === 'true';
      
      const form = await formsApi.updateForm(request, id!, updates);
      return json({ success: true, form });
    } catch (error: any) {
      return json({ success: false, error: error.message }, { status: 400 });
    }
  }

  if (intent === 'delete') {
    try {
      await formsApi.deleteForm(request, id!);
      return json({ success: true, deleted: true });
    } catch (error: any) {
      return json({ success: false, error: error.message }, { status: 400 });
    }
  }

  return json({ success: false }, { status: 400 });
}

export default function FormDetailPage() {
  const { form, submissions } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  if (fetcher.data?.deleted) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg mb-4">Form deleted successfully.</p>
            <Button asChild>
              <Link to="/admin/forms">Back to Forms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fields: FormField[] = Array.isArray(form.form_schema) ? form.form_schema : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/admin/forms">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{form.display_name}</h1>
            <p className="text-muted-foreground mt-1">{form.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/forms/${form.form_slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              View Form
            </Link>
          </Button>
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <Button
              type="submit"
              variant="destructive"
              onClick={(e) => {
                if (!confirm('Are you sure you want to delete this form?')) {
                  e.preventDefault();
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </fetcher.Form>
        </div>
      </div>

      {/* Form Info */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={form.is_active ? 'default' : 'secondary'}>
              {form.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{form.module_name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Version</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">v{form.version}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{submissions.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({submissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicFormRenderer
                fields={fields}
                onSubmit={(data) => {
                  console.log('Preview submission:', data);
                  alert('This is a preview. Use the "View Form" button to submit.');
                }}
                submitLabel="Preview Submit"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Form</CardTitle>
            </CardHeader>
            <CardContent>
              <FormBuilder
                formId={form.id}
                initialFields={fields.map(f => ({ ...f, fieldType: f.type }))}
                moduleName={form.module_name}
                entityType={form.entity_type}
                onSave={async (formData) => {
                  const formDataObj = new FormData();
                  formDataObj.append('intent', 'update');
                  formDataObj.append('form_schema', JSON.stringify(formData.form_schema));
                  if (formData.display_name) formDataObj.append('display_name', formData.display_name);
                  if (formData.description) formDataObj.append('description', formData.description);
                  
                  fetcher.submit(formDataObj, { method: 'post' });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission: FormSubmission) => (
                    <Card key={submission.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">
                            Submission #{submission.id.slice(0, 8)}
                          </CardTitle>
                          <Badge variant={
                            submission.submission_status === 'approved' ? 'default' :
                            submission.submission_status === 'rejected' ? 'destructive' :
                            'secondary'
                          }>
                            {submission.submission_status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Submitted:</span>{' '}
                              {submission.submitted_at 
                                ? new Date(submission.submitted_at).toLocaleString()
                                : 'Not submitted'}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Form Version:</span>{' '}
                              v{submission.form_version}
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(submission.submission_data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

