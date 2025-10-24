import { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Select } from "~/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { API_BASE_URL } from "~/constants/api";

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

interface Employee {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string | null;
  department: string | null;
  roles: string[]; // role IDs
  is_active: boolean;
}

interface ZanzibarTuple {
  subject_namespace: string;
  subject_type: string;
  subject_id: string;
  relation_name: string;
  object_namespace: string;
  object_type: string;
  object_id: string;
  expires_at: string | null;
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Assignment form state
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);
  
  // TODO: Get from auth context
  const organizationId = "785ae770-12ac-4aba-9bf8-6686fb53eeaf";

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/organizations/${organizationId}/employees`
      );
      const data = await response.json();
      // Handle both direct array and wrapped response
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data.success && data.data) {
        setEmployees(data.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/organizations/${organizationId}/roles`
      );
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedEmployee || !selectedRoleId) return;

    try {
      const requestBody: any = {
        employee_id: selectedEmployee.user_id,
        role_id: selectedRoleId,
        department_scope: selectedEmployee.department || undefined,
        resource_scope: [],
      };

      if (hasExpiration && expirationDate) {
        requestBody.valid_until = new Date(expirationDate).toISOString();
      }

      const response = await fetch(
        `${API_BASE_URL}/organizations/${organizationId}/employees/${selectedEmployee.user_id}/roles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Role assigned successfully!");
        setShowAssignDialog(false);
        resetAssignmentForm();
        // Refresh employees to show updated roles
        fetchEmployees();
      } else {
        alert(`Failed to assign role: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to assign role:", error);
      alert("Failed to assign role");
    }
  };

  const openAssignDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAssignDialog(true);
  };

  const resetAssignmentForm = () => {
    setSelectedRoleId("");
    setExpirationDate("");
    setHasExpiration(false);
    setSelectedEmployee(null);
  };

  const getRoleName = (roleId: string): string => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-700">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage employees and assign roles with Zanzibar authorization
          </p>
        </div>

        {/* Employees Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {employee.position || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {employee.department || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {employee.roles.length > 0 ? (
                          employee.roles.map((roleId) => (
                            <span
                              key={roleId}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md font-medium border border-blue-200"
                            >
                              {getRoleName(roleId)}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openAssignDialog(employee)}>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Assign Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.email)}>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Employee
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {employees.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-slate-700 mb-1">No employees found</p>
              <p className="text-sm text-slate-500">
                Add employees to your organization to manage their roles
              </p>
            </div>
          )}
        </Card>

        {/* Assign Role Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Assign Role
              </DialogTitle>
              {selectedEmployee && (
                <DialogDescription>
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-slate-600">Assigning role to:</p>
                    <p className="font-semibold text-slate-900">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </p>
                    <p className="text-sm text-slate-600">{selectedEmployee.email}</p>
                  </div>
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-4">
                <div>
                  <Label htmlFor="role" className="text-slate-700 font-medium">Role *</Label>
                  <select
                    id="role"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                        {role.description && ` - ${role.description}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={hasExpiration}
                      onChange={(e) => setHasExpiration(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                      Set expiration date (time-based access)
                    </span>
                  </label>
                </div>

                {hasExpiration && (
                  <div>
                    <Label htmlFor="expiration" className="text-slate-700 font-medium">
                      Expiration Date
                    </Label>
                    <Input
                      id="expiration"
                      type="datetime-local"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="mt-1"
                      showInfoIcon
                      aria-label="Select when role access expires"
                      aria-describedby="expiration-help"
                    />
                    <p id="expiration-help" className="text-xs text-slate-500 mt-1">
                      Role access will automatically expire on this date
                    </p>
                  </div>
                )}

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Zanzibar Authorization
                  </p>
                  <p className="text-xs text-blue-700">
                    This assignment will create a Zanzibar tuple for fine-grained access control:
                    <br />
                    <code className="mt-2 block bg-white/80 px-3 py-2 rounded border border-blue-200 text-blue-900 font-mono text-xs">
                      user:{selectedEmployee?.user_id}#member@role:{selectedRoleId || "[role_id]"}
                    </code>
                  </p>
                </div>
              </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowAssignDialog(false);
                  resetAssignmentForm();
                }}
                variant="outline"
                aria-label="Cancel role assignment"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRole}
                disabled={!selectedRoleId}
                aria-label={!selectedRoleId ? "Please select a role first" : "Assign selected role to employee"}
              >
                Assign Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
