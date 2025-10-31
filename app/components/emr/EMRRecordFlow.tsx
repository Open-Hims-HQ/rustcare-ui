import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  NodeTypes,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Node } from '@xyflow/react';
import ConfigurableNode from '~/components/flow/ConfigurableNode';
import type { FormField } from '~/components/forms/DynamicFormRenderer';

// Patient Info Node
const PatientInfoNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-200 bg-blue-50 min-w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <h3 className="font-bold text-sm text-blue-900">Patient Info</h3>
      </div>
      <div className="text-xs space-y-1">
        <p className="text-gray-700"><span className="font-semibold">ID:</span> {data.patientId}</p>
        {data.name && (
          <p className="text-gray-700"><span className="font-semibold">Name:</span> {data.name}</p>
        )}
        {data.age && (
          <p className="text-gray-700"><span className="font-semibold">Age:</span> {data.age}</p>
        )}
        {data.dateOfBirth && (
          <p className="text-gray-700"><span className="font-semibold">DOB:</span> {data.dateOfBirth}</p>
        )}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  configurableNode: ConfigurableNode,
  patientInfo: PatientInfoNode,
};

// Define form fields for different node types
const getFormFieldsForType = (type: string): FormField[] => {
  switch (type) {
    case 'consultation':
      return [
        {
          id: 'chief_complaint',
          name: 'chief_complaint',
          label: 'Chief Complaint',
          type: 'textarea',
          required: true,
          placeholder: 'Enter the chief complaint...',
        },
        {
          id: 'diagnosis',
          name: 'diagnosis',
          label: 'Primary Diagnosis',
          type: 'text',
          required: true,
          placeholder: 'Enter ICD-10 code or diagnosis',
        },
        {
          id: 'visit_type',
          name: 'visit_type',
          label: 'Visit Type',
          type: 'select',
          required: true,
          options: [
            { value: 'initial', label: 'Initial Consultation' },
            { value: 'followup', label: 'Follow-up' },
            { value: 'urgent', label: 'Urgent Care' },
            { value: 'routine', label: 'Routine Check' },
          ],
        },
      ];
    case 'diagnostic':
      return [
        {
          id: 'test_type',
          name: 'test_type',
          label: 'Test Type',
          type: 'select',
          required: true,
          options: [
            { value: 'lab', label: 'Laboratory Test' },
            { value: 'imaging', label: 'Imaging Study' },
            { value: 'ecg', label: 'ECG/EKG' },
            { value: 'biopsy', label: 'Biopsy' },
          ],
        },
        {
          id: 'test_name',
          name: 'test_name',
          label: 'Test Name',
          type: 'text',
          required: true,
          placeholder: 'Enter test name',
        },
        {
          id: 'ordered_by',
          name: 'ordered_by',
          label: 'Ordered By',
          type: 'text',
          required: true,
          placeholder: 'Provider name',
        },
      ];
    case 'treatment':
      return [
        {
          id: 'treatment_type',
          name: 'treatment_type',
          label: 'Treatment Type',
          type: 'select',
          required: true,
          options: [
            { value: 'medication', label: 'Medication' },
            { value: 'procedure', label: 'Procedure' },
            { value: 'therapy', label: 'Physical Therapy' },
            { value: 'surgery', label: 'Surgery' },
          ],
        },
        {
          id: 'treatment_details',
          name: 'treatment_details',
          label: 'Treatment Details',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the treatment...',
        },
      ];
    default:
      return [];
  }
};

interface EMRRecordFlowProps {
  patientId?: string;
  recordId?: string;
  viewMode?: 'timeline' | 'workflow' | 'network';
  orgId?: string;
}

export default function EMRRecordFlow({ 
  patientId,
  recordId,
  viewMode = 'timeline',
  orgId
}: EMRRecordFlowProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patient data and records
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let currentPatient;
        
        // Try to fetch patient data if orgId is available
        if (orgId) {
          try {
            const patientResponse = await fetch(`/api/v1/organizations/${orgId}/patients`);
            if (patientResponse.ok) {
              const patientData = await patientResponse.json();
              const patients = patientData.data || [];
              currentPatient = patients[0];
            }
          } catch (fetchError) {
            console.warn('Backend not available, using mock data');
          }
        }
        
        // Use mock data if no patient found
        if (!currentPatient) {
          currentPatient = {
            patient_id: 'PAT-001',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1978-05-15',
          };
        }
        
        // Build nodes with proper spacing and layout
        // Center the flow for timeline view
        const centerX = 400;
        const verticalSpacing = 180;
        const startY = 50;
        
        const patientNodes: Node[] = [
          {
            id: 'patient',
            type: 'patientInfo',
            position: { x: centerX, y: startY },
            data: { 
              patientId: currentPatient.patient_id || currentPatient.id,
              name: currentPatient.first_name ? `${currentPatient.first_name} ${currentPatient.last_name}` : undefined,
              dateOfBirth: currentPatient.date_of_birth,
              age: currentPatient.date_of_birth ? calculateAge(currentPatient.date_of_birth) : undefined,
            },
          }
        ];
        
        // Create EMR record nodes with consistent spacing
        const recordNodes: Node[] = [
          {
            id: 'record-1',
            type: 'configurableNode',
            position: { x: centerX, y: startY + verticalSpacing },
            data: { 
              label: 'Initial Consultation',
              description: 'Patient admitted with chest pain',
              date: '2024-01-15',
              status: 'completed',
              type: 'consultation',
              isConfigured: false,
              formFields: getFormFieldsForType('consultation'),
            },
          },
          {
            id: 'record-2',
            type: 'configurableNode',
            position: { x: centerX, y: startY + (verticalSpacing * 2) },
            data: { 
              label: 'Diagnostic Test',
              description: 'ECG and Blood Work Completed',
              date: '2024-01-15',
              status: 'completed',
              type: 'diagnostic',
              isConfigured: false,
              formFields: getFormFieldsForType('diagnostic'),
            },
          },
          {
            id: 'record-3',
            type: 'configurableNode',
            position: { x: centerX, y: startY + (verticalSpacing * 3) },
            data: { 
              label: 'Treatment Plan',
              description: 'Medication prescribed and follow-up scheduled',
              date: '2024-01-16',
              status: 'in_progress',
              type: 'treatment',
              isConfigured: false,
              formFields: getFormFieldsForType('treatment'),
            },
          },
          {
            id: 'record-4',
            type: 'configurableNode',
            position: { x: centerX, y: startY + (verticalSpacing * 4) },
            data: { 
              label: 'Follow-up Appointment',
              description: 'Scheduled for next week',
              date: '2024-01-23',
              status: 'pending',
              type: 'consultation',
              isConfigured: false,
              formFields: getFormFieldsForType('consultation'),
            },
          },
        ];
        
        // Create clean vertical edges
        const recordEdges: Edge[] = [
          {
            id: 'e1',
            source: 'patient',
            target: 'record-1',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          },
          {
            id: 'e2',
            source: 'record-1',
            target: 'record-2',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          },
          {
            id: 'e3',
            source: 'record-2',
            target: 'record-3',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          },
          {
            id: 'e4',
            source: 'record-3',
            target: 'record-4',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          },
        ];
        
        // Set initial state
        setNodes([...patientNodes, ...recordNodes]);
        setEdges(recordEdges);
      } catch (err) {
        console.error('Error loading EMR data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, orgId]);

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleConfigUpdate = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                config,
                isConfigured: true,
              },
            }
          : node
      )
    );
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[800px]">
        <div className="text-gray-600">Loading EMR data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[800px]">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3, duration: 300 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#e5e7eb"
          className="bg-gray-50"
        />
        <Controls 
          className="bg-white border border-gray-200 shadow-sm"
          style={{ 
            button: { 
              borderColor: '#e5e7eb',
              backgroundColor: '#ffffff',
            }
          }}
        />
        <MiniMap 
          nodeStrokeColor="rgb(59, 130, 246)"
          nodeColor="rgb(147, 197, 253)"
          nodeBorderRadius={8}
          className="bg-white border border-gray-200 shadow-sm"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
