/**
 * Form Builder Management Page
 * 
 * Allows hospital staff (doctors, nurses, admins, management) to:
 * - Create custom forms for their workflows
 * - Manage existing forms
 * - View form submissions
 */

import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher, Link } from '@remix-run/react';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import FormBuilder from '~/components/forms/FormBuilder';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { apiRequest } from '~/lib/api.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const moduleName = url.searchParams.get('module') || 'healthcare';
  
  try {
    const forms = await apiRequest(request, `/api/v1/forms?module_name=${moduleName}`);
    return json({ forms: forms.data || [], moduleName });
  } catch (error) {
    console.error('Failed to load forms:', error);
    return json({ forms: [], moduleName });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'create') {
    const formDefinition = {
      form_name: formData.get('form_name'),
      form_slug: formData.get('form_slug'),
      display_name: formData.get('display_name'),
      description: formData.get('description'),
      module_name: formData.get('module_name'),
      entity_type: formData.get('entity_type'),
      form_schema: JSON.parse(formData.get('form_schema') as string),
      category: formData.get('category'),
      icon: formData.get('icon'),
    };
    
    try {
      const result = await apiRequest(request, '/api/v1/forms', {
        method: 'POST',
        body: JSON.stringify(formDefinition),
      });
      return json({ success: true, form: result.data });
    } catch (error) {
      return json({ success: false, error: 'Failed to create form' }, { status: 400 });
    }
  }
  
  if (intent === 'delete') {
    const formId = formData.get('form_id');
    try {
      await apiRequest(request, `/api/v1/forms/${formId}`, {
        method: 'DELETE',
      });
      return json({ success: true });
    } catch (error) {
      return json({ success: false, error: 'Failed to delete form' }, { status: 400 });
    }
  }
  
  return json({ success: false }, { status: 400 });
}

export default function FormsPage() {
  const { forms, moduleName } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage custom forms for your workflows
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
            </DialogHeader>
            <FormBuilder
              moduleName={moduleName}
              onSave={(formData) => {
                const formDataObj = new FormData();
                formDataObj.append('intent', 'create');
                Object.entries(formData).forEach(([key, value]) => {
                  if (key === 'form_schema') {
                    formDataObj.append(key, JSON.stringify(value));
                  } else {
                    formDataObj.append(key, String(value || ''));
                  }
                });
                fetcher.submit(formDataObj, { method: 'post' });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Forms</TabsTrigger>
          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="admin">Administrative</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {forms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first form to get started
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form: any) => (
                <Card key={form.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{form.display_name}</CardTitle>
                        <CardDescription className="mt-1">
                          {form.description || 'No description'}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{form.module_name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Slug: {form.form_slug}</span>
                        {form.entity_type && (
                          <span>• Entity: {form.entity_type}</span>
                        )}
                      </div>
                      {form.category && (
                        <Badge variant="secondary">{form.category}</Badge>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/forms/${form.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/forms/${form.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="form_id" value={form.id} />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this form?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </fetcher.Form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

