import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import {
  Clock,
  Filter,
  Search,
  FileText,
} from "lucide-react";

interface AuditEvent {
  id: string;
  timestamp: string;
  event_type:
    | "SecretAccessed"
    | "SecretCreated"
    | "SecretUpdated"
    | "SecretDeleted"
    | "SecretRotated";
  user: string;
  secret_key: string;
  provider: string;
  success: boolean;
  message?: string;
  metadata?: Record<string, any>;
}

interface AuditData {
  events: AuditEvent[];
  total: number;
  page: number;
  per_page: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = parseInt(url.searchParams.get("per_page") || "50");
  const eventType = url.searchParams.get("event_type") || "";
  const user = url.searchParams.get("user") || "";

  // TODO: Replace with actual API call
  const mockEvents: AuditEvent[] = [
    {
      id: "1",
      timestamp: "2025-10-28T10:30:00Z",
      event_type: "SecretAccessed",
      user: "admin@example.com",
      secret_key: "database/password",
      provider: "vault",
      success: true,
      metadata: { ip: "192.168.1.1", user_agent: "Mozilla/5.0" },
    },
    {
      id: "2",
      timestamp: "2025-10-28T10:25:00Z",
      event_type: "SecretCreated",
      user: "admin@example.com",
      secret_key: "api/stripe-key",
      provider: "aws",
      success: true,
    },
    {
      id: "3",
      timestamp: "2025-10-28T10:20:00Z",
      event_type: "SecretRotated",
      user: "system",
      secret_key: "database/password",
      provider: "vault",
      success: true,
      message: "Automatic rotation",
    },
    {
      id: "4",
      timestamp: "2025-10-28T10:15:00Z",
      event_type: "SecretUpdated",
      user: "dev@example.com",
      secret_key: "api/sendgrid-key",
      provider: "vault",
      success: true,
    },
    {
      id: "5",
      timestamp: "2025-10-28T10:10:00Z",
      event_type: "SecretDeleted",
      user: "admin@example.com",
      secret_key: "temp/test-key",
      provider: "aws",
      success: true,
    },
    {
      id: "6",
      timestamp: "2025-10-28T10:05:00Z",
      event_type: "SecretAccessed",
      user: "api-service",
      secret_key: "database/password",
      provider: "vault",
      success: false,
      message: "Permission denied",
    },
  ];

  const data: AuditData = {
    events: mockEvents,
    total: mockEvents.length,
    page,
    per_page: perPage,
  };

  return json(data);
}

export default function SecretsAudit() {
  const { events, total, page, per_page } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const eventTypeColors: Record<string, string> = {
    SecretAccessed: "bg-blue-100 text-blue-800",
    SecretCreated: "bg-green-100 text-green-800",
    SecretUpdated: "bg-yellow-100 text-yellow-800",
    SecretDeleted: "bg-red-100 text-red-800",
    SecretRotated: "bg-purple-100 text-purple-800",
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1"); // Reset to first page
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-600" />
                Audit Log
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Track all secret access and modifications
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={searchParams.get("event_type") || ""}
                  onChange={(e) => handleFilterChange("event_type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="SecretAccessed">Accessed</option>
                  <option value="SecretCreated">Created</option>
                  <option value="SecretUpdated">Updated</option>
                  <option value="SecretDeleted">Deleted</option>
                  <option value="SecretRotated">Rotated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <input
                  type="text"
                  value={searchParams.get("user") || ""}
                  onChange={(e) => handleFilterChange("user", e.target.value)}
                  placeholder="Filter by user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secret Key
                </label>
                <input
                  type="text"
                  value={searchParams.get("secret_key") || ""}
                  onChange={(e) => handleFilterChange("secret_key", e.target.value)}
                  placeholder="Filter by secret key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Successful</p>
            <p className="text-2xl font-bold text-green-600">
              {events.filter((e) => e.success).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {events.filter((e) => !e.success).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Page</p>
            <p className="text-2xl font-bold text-gray-900">
              {page} / {Math.ceil(total / per_page)}
            </p>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !event.success ? "bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            eventTypeColors[event.event_type]
                          }`}
                        >
                          {event.event_type.replace("Secret", "")}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            event.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.success ? "Success" : "Failed"}
                        </span>
                      </div>

                      <div className="ml-8 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">User:</span>
                          <span className="text-sm text-gray-700">{event.user}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">Secret:</span>
                          <span className="text-sm text-gray-700 font-mono">{event.secret_key}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">Provider:</span>
                          <span className="text-sm text-gray-700">{event.provider}</span>
                        </div>
                        {event.message && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">Message:</span>
                            <span className="text-sm text-gray-700">{event.message}</span>
                          </div>
                        )}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                              Show metadata
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {total > per_page && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", String(Math.max(1, page - 1)));
                  setSearchParams(newParams);
                }}
                disabled={page === 1}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(total / per_page)}
              </span>

              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", String(Math.min(Math.ceil(total / per_page), page + 1)));
                  setSearchParams(newParams);
                }}
                disabled={page >= Math.ceil(total / per_page)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}
