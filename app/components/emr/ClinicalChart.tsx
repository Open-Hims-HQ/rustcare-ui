import React, { useState } from 'react';
import { 
  ClipboardList, 
  FileText, 
  Activity, 
  Pill, 
  TestTube, 
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

interface ClinicalChartProps {
  patientId: string;
  patientName?: string;
  patientInfo?: {
    age?: number;
    dateOfBirth?: string;
    gender?: string;
    mrn?: string;
  };
}

export default function ClinicalChart({ 
  patientId, 
  patientName, 
  patientInfo 
}: ClinicalChartProps) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="w-full space-y-4">
      {/* Patient Banner - Epic/Cerner Style */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b-2 border-blue-500 shadow-sm">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {patientName || `Patient ${patientId}`}
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                {patientInfo?.mrn && (
                  <span className="font-medium"><strong className="text-gray-500">MRN:</strong> {patientInfo.mrn}</span>
                )}
                {patientInfo?.age && (
                  <span><strong className="text-gray-500">Age:</strong> {patientInfo.age} years</span>
                )}
                {patientInfo?.dateOfBirth && (
                  <span><strong className="text-gray-500">DOB:</strong> {patientInfo.dateOfBirth}</span>
                )}
                {patientInfo?.gender && (
                  <span><strong className="text-gray-500">Gender:</strong> {patientInfo.gender}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Chart Tabs - Epic Style */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 border-b bg-white">
          <TabsTrigger value="summary">
            <ClipboardList className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="progress">
            <FileText className="h-4 w-4 mr-2" />
            Progress Notes
          </TabsTrigger>
          <TabsTrigger value="labs">
            <TestTube className="h-4 w-4 mr-2" />
            Labs
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Activity className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-0">
          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* Active Problems */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                  Active Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start justify-between p-2 bg-orange-50 rounded">
                    <div>
                      <p className="text-sm font-medium">Hypertension</p>
                      <p className="text-xs text-gray-600">Since 2020</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex items-start justify-between p-2 bg-orange-50 rounded">
                    <div>
                      <p className="text-sm font-medium">Type 2 Diabetes</p>
                      <p className="text-xs text-gray-600">Since 2018</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start justify-between p-2 bg-red-50 rounded border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-900">Penicillin</p>
                      <p className="text-xs text-red-700">Severe - Anaphylaxis</p>
                    </div>
                  </div>
                  <div className="p-2 text-xs text-gray-500 italic">
                    No known allergies
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-600">BP</span>
                    <span className="text-sm font-semibold">142/88 mmHg</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-600">HR</span>
                    <span className="text-sm font-semibold">78 bpm</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-600">Temp</span>
                    <span className="text-sm font-semibold">98.6°F</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-600">SpO2</span>
                    <span className="text-sm font-semibold">98%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last recorded: Today, 08:30 AM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Visit Completed</p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Follow-up consultation with Dr. Smith
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <div className="flex-shrink-0 mt-1">
                    <TestTube className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Lab Results</p>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Complete Blood Count - All values normal
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border-l-4 border-purple-500 bg-purple-50 rounded">
                  <div className="flex-shrink-0 mt-1">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Medication Started</p>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Metformin 500mg, twice daily
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Notes Tab */}
        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Notes</CardTitle>
              <CardDescription>Clinical documentation and provider notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold">Dr. Smith, MD</span>
                      <Badge variant="outline" className="text-xs">Primary Care</Badge>
                    </div>
                    <span className="text-xs text-gray-500">Today, 08:30 AM</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Chief Complaint:</strong> Follow-up for diabetes management
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Assessment:</strong> Type 2 Diabetes Mellitus, well-controlled on current regimen. Blood glucose levels within target range.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Plan:</strong> Continue Metformin 500mg BID. Recheck A1C in 3 months. Recommend dietary consultation.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold">Dr. Johnson, MD</span>
                      <Badge variant="outline" className="text-xs">Cardiology</Badge>
                    </div>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Chief Complaint:</strong> Routine cardiac follow-up
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Assessment:</strong> Hypertension, stable. ECG normal sinus rhythm. No new concerns.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Plan:</strong> Continue Lisinopril 10mg daily. Lifestyle modifications reinforced.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labs Tab */}
        <TabsContent value="labs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Recent lab tests and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Complete Blood Count (CBC)</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      Normal
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">WBC</span>
                      <span className="font-semibold">6.5 x10³/µL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RBC</span>
                      <span className="font-semibold">4.8 x10⁶/µL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hemoglobin</span>
                      <span className="font-semibold">14.2 g/dL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hematocrit</span>
                      <span className="font-semibold">42.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platelets</span>
                      <span className="font-semibold">225 x10³/µL</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Ordered: 1 day ago | Resulted: 1 day ago</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Hemoglobin A1C</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      Normal
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">A1C</span>
                      <span className="font-semibold">6.2%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Ordered: 2 weeks ago | Resulted: 2 weeks ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Medications</CardTitle>
              <CardDescription>Current medication regimen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">Metformin</p>
                    <p className="text-sm text-gray-600">500mg, oral tablet</p>
                    <p className="text-xs text-gray-500">Take twice daily with meals</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    Active
                  </Badge>
                </div>

                <div className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">Lisinopril</p>
                    <p className="text-sm text-gray-600">10mg, oral tablet</p>
                    <p className="text-xs text-gray-500">Take once daily in the morning</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Orders</CardTitle>
              <CardDescription>Recent and pending orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start justify-between p-3 border rounded-lg border-green-500 bg-green-50">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold">Complete Metabolic Panel</p>
                      <p className="text-sm text-gray-600">Lab Order</p>
                      <p className="text-xs text-gray-500">Ordered: Today, 08:30 AM</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white text-green-700 border-green-300">
                    Completed
                  </Badge>
                </div>

                <div className="flex items-start justify-between p-3 border rounded-lg border-yellow-500 bg-yellow-50">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-1" />
                    <div>
                      <p className="font-semibold">Dietary Consultation</p>
                      <p className="text-sm text-gray-600">Referral</p>
                      <p className="text-xs text-gray-500">Ordered: Yesterday, 2:00 PM</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">
                    Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Timeline</CardTitle>
              <CardDescription>Chronological view of clinical events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
                <div className="space-y-6">
                  <div className="relative pl-12">
                    <div className="absolute left-2 top-2 h-4 w-4 bg-blue-600 rounded-full border-2 border-white" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Follow-up Visit</p>
                        <p className="text-sm text-gray-600">Dr. Smith, Primary Care</p>
                      </div>
                      <span className="text-xs text-gray-500">Today, 08:30 AM</span>
                    </div>
                  </div>

                  <div className="relative pl-12">
                    <div className="absolute left-2 top-2 h-4 w-4 bg-green-600 rounded-full border-2 border-white" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Lab Results</p>
                        <p className="text-sm text-gray-600">CBC - All normal</p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>

                  <div className="relative pl-12">
                    <div className="absolute left-2 top-2 h-4 w-4 bg-purple-600 rounded-full border-2 border-white" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Medication Started</p>
                        <p className="text-sm text-gray-600">Metformin 500mg BID</p>
                      </div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>

                  <div className="relative pl-12">
                    <div className="absolute left-2 top-2 h-4 w-4 bg-orange-600 rounded-full border-2 border-white" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Cardiology Visit</p>
                        <p className="text-sm text-gray-600">Dr. Johnson - Routine follow-up</p>
                      </div>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

