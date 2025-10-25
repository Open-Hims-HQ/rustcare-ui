import { useState } from "react";
import { Link } from "@remix-run/react";
import { Plus, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

// Types (matches backend API)
interface Device {
  id: string;
  name: string;
  device_type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  location: {
    department?: string;
    building?: string;
    floor?: string;
    room?: string;
    bed?: string;
  };
  status: string;
  last_connected: string | null;
  last_data_received: string | null;
  last_error: string | null;
  config: any;
  metadata: any;
}

interface DeviceType {
  code: string;
  name: string;
  category: string;
  description: string;
}

interface ConnectionType {
  code: string;
  name: string;
  protocol: string;
  default_port?: number;
  requires_auth: boolean;
}

interface DataFormat {
  code: string;
  name: string;
  version?: string;
  mime_type: string;
  parser_plugin: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [filter, setFilter] = useState({
    device_type: "",
    status: "",
    location: "",
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      disconnected: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      connecting: { color: "bg-yellow-100 text-yellow-800", icon: Activity },
      connected: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      active: { color: "bg-blue-100 text-blue-800", icon: Activity },
      error: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      maintenance: { color: "bg-orange-100 text-orange-800", icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disconnected;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // Register device dialog
  const RegisterDeviceDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      device_type: "",
      manufacturer: "",
      model: "",
      serial_number: "",
      location: {
        department: "",
        building: "",
        floor: "",
        room: "",
        bed: "",
      },
      config: {
        connection: {
          connection_type: "",
          host: "",
          port: "",
        },
        protocol: {
          format: "",
        },
      },
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch("/api/v1/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const device = await response.json();
          setDevices([...devices, device]);
          setIsRegisterDialogOpen(false);
        }
      } catch (error) {
        console.error("Failed to register device:", error);
      }
    };

    return (
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Register Device
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Device</DialogTitle>
            <DialogDescription>
              Add a new medical device to the system. All fields are configurable.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="device_type">Device Type</Label>
                  <select
                    id="device_type"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.device_type}
                    onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="vitals_monitor">Vitals Monitor</option>
                    <option value="lab_analyzer">Laboratory Analyzer</option>
                    <option value="imaging_device">Imaging Device</option>
                    <option value="infusion_pump">Infusion Pump</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Location</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.location.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, department: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="building">Building</Label>
                  <Input
                    id="building"
                    value={formData.location.building}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, building: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    value={formData.location.floor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, floor: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.location.room}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, room: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="bed">Bed</Label>
                  <Input
                    id="bed"
                    value={formData.location.bed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, bed: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Connection Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Connection Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="connection_type">Connection Type</Label>
                  <select
                    id="connection_type"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.config.connection.connection_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          connection: {
                            ...formData.config.connection,
                            connection_type: e.target.value,
                          },
                        },
                      })
                    }
                  >
                    <option value="">Select connection...</option>
                    <option value="serial">Serial Port</option>
                    <option value="network">Network (TCP/IP)</option>
                    <option value="hl7_mllp">HL7 MLLP</option>
                    <option value="dicom">DICOM</option>
                    <option value="websocket">WebSocket</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="format">Data Format</Label>
                  <select
                    id="format"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.config.protocol.format}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          protocol: { ...formData.config.protocol, format: e.target.value },
                        },
                      })
                    }
                  >
                    <option value="">Select format...</option>
                    <option value="hl7_v2">HL7 v2</option>
                    <option value="fhir_r4">FHIR R4</option>
                    <option value="dicom">DICOM</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="host">Host/IP Address</Label>
                  <Input
                    id="host"
                    value={formData.config.connection.host}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          connection: { ...formData.config.connection, host: e.target.value },
                        },
                      })
                    }
                    placeholder="192.168.1.100"
                  />
                </div>

                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.config.connection.port}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          connection: { ...formData.config.connection, port: e.target.value },
                        },
                      })
                    }
                    placeholder="8080"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Device</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Device Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor medical devices connected to the system
          </p>
        </div>
        <RegisterDeviceDialog />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-type">Device Type</Label>
              <select
                id="filter-type"
                className="w-full border rounded-md px-3 py-2"
                value={filter.device_type}
                onChange={(e) => setFilter({ ...filter, device_type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="vitals_monitor">Vitals Monitor</option>
                <option value="lab_analyzer">Laboratory Analyzer</option>
                <option value="imaging_device">Imaging Device</option>
              </select>
            </div>

            <div>
              <Label htmlFor="filter-status">Status</Label>
              <select
                id="filter-status"
                className="w-full border rounded-md px-3 py-2"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="connected">Connected</option>
                <option value="disconnected">Disconnected</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <Label htmlFor="filter-location">Location</Label>
              <Input
                id="filter-location"
                placeholder="e.g. ICU, ER"
                value={filter.location}
                onChange={(e) => setFilter({ ...filter, location: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No devices registered yet. Click "Register Device" to add one.</p>
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => (
            <Link key={device.id} to={`/admin/devices/${device.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>
                        {device.manufacturer} {device.model}
                      </CardDescription>
                    </div>
                    <StatusBadge status={device.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span> {device.device_type}
                    </div>
                    <div>
                      <span className="text-gray-500">Serial:</span> {device.serial_number}
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>{" "}
                      {device.location.department || "N/A"}
                      {device.location.room && `, Room ${device.location.room}`}
                    </div>
                    {device.last_connected && (
                      <div>
                        <span className="text-gray-500">Last Connected:</span>{" "}
                        {new Date(device.last_connected).toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
