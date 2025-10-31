import { json, type LoaderFunctionArgs, type MetaFunction, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { useState } from "react";
import { Bell, Filter, Check, CheckCheck, Eye, Trash2, Clock, AlertCircle, Info, CheckCircle, XCircle, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";

export const meta: MetaFunction = () => {
  return [
    { title: "Notifications - RustCare Admin" },
    { name: "description", content: "View and manage system notifications with audit logs" },
  ];
};

// Loader: Mock notifications for now
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // TODO: Fetch from actual API
    const notifications = [
      {
        id: 'notif-001',
        title: 'New Appointment Scheduled',
        message: 'Dr. John Smith has scheduled an appointment for Patient ID 12345 on January 15, 2024 at 10:00 AM',
        notification_type: 'info',
        priority: 'medium',
        category: 'appointment',
        is_read: false,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        action_url: '/admin/healthcare/appointments/12345',
        action_label: 'View Appointment',
        icon: 'calendar',
      },
      {
        id: 'notif-002',
        title: 'Prescription Expiring Soon',
        message: 'Prescription #RX-456789 for Patient ID 12345 is expiring in 7 days',
        notification_type: 'warning',
        priority: 'high',
        category: 'prescription',
        is_read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        action_url: '/admin/pharmacy/prescriptions/RX-456789',
        action_label: 'Review Prescription',
        icon: 'pill',
      },
      {
        id: 'notif-003',
        title: 'Security Alert',
        message: 'Multiple failed login attempts detected for user account admin@rustcare.com',
        notification_type: 'error',
        priority: 'urgent',
        category: 'security',
        is_read: false,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        action_url: '/admin/security/alerts',
        action_label: 'View Security Alerts',
        icon: 'shield',
      },
      {
        id: 'notif-004',
        title: 'Compliance Check Completed',
        message: 'HIPAA compliance audit for Q4 2024 has been completed successfully',
        notification_type: 'success',
        priority: 'low',
        category: 'compliance',
        is_read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        action_url: '/admin/compliance/reports/Q4-2024',
        action_label: 'View Report',
        icon: 'checkmark',
      },
      {
        id: 'notif-005',
        title: 'Vendor Inventory Low',
        message: 'Vendor "MedSupply Inc" has critical low stock on medical supplies',
        notification_type: 'warning',
        priority: 'high',
        category: 'inventory',
        is_read: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        action_url: '/admin/vendors/medsupply-inventory',
        action_label: 'Check Inventory',
        icon: 'package',
      },
    ];

    return json({ notifications, isMockData: true });
  } catch (error) {
    console.error('Error loading notifications:', error);
    return json({ notifications: [], isMockData: true });
  }
}

export default function NotificationsPage() {
  const { notifications, isMockData } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const handleMarkAsRead = (notificationId: string) => {
    fetcher.submit(
      { notificationId, action: 'mark-read' },
      { method: 'post' }
    );
  };

  const handleBulkMarkAsRead = () => {
    if (selectedNotifications.size === 0) return;
    fetcher.submit(
      { notificationIds: Array.from(selectedNotifications), action: 'bulk-mark-read' },
      { method: 'post' }
    );
    setSelectedNotifications(new Set());
  };

  const toggleSelect = (notificationId: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.size === unreadNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(unreadNotifications.map(n => n.id)));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: 'destructive',
      urgent: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    };
    return <Badge variant={variants[priority as keyof typeof variants] || 'default'}>{priority}</Badge>;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {unreadNotifications.length} Unread
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-base">
              Manage system notifications, alerts, and security events with complete audit trail
            </p>
          </div>
          <div className="flex gap-3">
            {selectedNotifications.size > 0 && (
              <Button onClick={handleBulkMarkAsRead} variant="outline" className="shadow-md">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark {selectedNotifications.size} as Read
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shadow-md">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Newest First</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
                <DropdownMenuItem>Priority</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mock Data Warning */}
      {isMockData && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Development Mode</p>
              <p className="text-sm text-yellow-700">Showing demo notification data. Backend API not connected.</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All Notifications
                <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge variant="destructive" className="ml-2">{unreadNotifications.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    notification.is_read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    {!notification.is_read && (
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => toggleSelect(notification.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}

                    {/* Type Icon */}
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.notification_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold ${notification.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-700'} mt-1`}>
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getPriorityBadge(notification.priority)}
                          <Badge variant="outline" className="text-xs">{notification.category}</Badge>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(notification.created_at)}
                          </div>
                          {notification.action_url && (
                            <Link
                              to={notification.action_url}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {notification.action_label}
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audit Trail</span>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </CardTitle>
          <CardDescription>Complete tracking of all notification actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Recent Audit Events:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Notification created 5 minutes ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>User viewed notification 2 hours ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Bulk read operation 1 day ago</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">
              Full audit logs available via API endpoint
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

