import { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Dialog } from "~/components/ui/dialog";
import { Select } from "~/components/ui/select";
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Management
        </h1>
        <p className="text-gray-600">
          Manage employees and assign roles with Zanzibar authorization
        </p>
      </div>

      {/* Employees Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {employee.position || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {employee.department || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {employee.roles.length > 0 ? (
                        employee.roles.map((roleId) => (
                          <span
                            key={roleId}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {getRoleName(roleId)}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No roles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      onClick={() => openAssignDialog(employee)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                    >
                      Assign Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-2">No employees found</p>
            <p className="text-sm text-gray-500">
              Add employees to your organization to manage their roles
            </p>
          </div>
        )}
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Assign Role</h2>

            {selectedEmployee && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Assigning role to:</p>
                <p className="font-semibold text-gray-900">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </p>
                <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasExpiration}
                    onChange={(e) => setHasExpiration(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Set expiration date (time-based access)
                  </span>
                </label>
              </div>

              {hasExpiration && (
                <div>
                  <Label htmlFor="expiration">Expiration Date</Label>
                  <Input
                    id="expiration"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Role access will automatically expire on this date
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Zanzibar Authorization
                </p>
                <p className="text-xs text-blue-700">
                  This assignment will create a Zanzibar tuple for fine-grained
                  access control:
                  <br />
                  <code className="mt-1 block bg-white px-2 py-1 rounded">
                    user:{selectedEmployee?.user_id}#member@role:
                    {selectedRoleId || "[role_id]"}
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRole}
                disabled={!selectedRoleId}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Assign Role
              </Button>
            </div>
          </Card>
        </div>
      </Dialog>
    </div>
  );
}
