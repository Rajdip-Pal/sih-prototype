"use client"

import { Navigation } from "@/components/navigation"
import { DataTable } from "@/components/ui/data-table"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileCheck, AlertTriangle, Building, Download } from "lucide-react"

// Mock data for regulatory oversight
const regulatoryMetrics = {
  totalFarms: "1,247",
  activeCertifications: "892",
  pendingInspections: "23",
  complianceRate: "96.8%",
}

const farmsData = [
  {
    id: "FARM-001",
    name: "Green Valley Farm",
    location: "Sonoma County, CA",
    owner: "John Smith",
    certifications: ["USDA Organic", "Non-GMO"],
    lastInspection: "2024-02-15",
    status: "Compliant",
    crops: 24,
    batches: 8,
  },
  {
    id: "FARM-002",
    name: "Sunrise Organic Farm",
    location: "Salinas Valley, CA",
    owner: "Maria Garcia",
    certifications: ["USDA Organic"],
    lastInspection: "2024-01-20",
    status: "Pending Review",
    crops: 18,
    batches: 12,
  },
  {
    id: "FARM-003",
    name: "Heritage Roots Farm",
    location: "Watsonville, CA",
    owner: "David Chen",
    certifications: ["USDA Organic", "Biodynamic"],
    lastInspection: "2024-03-01",
    status: "Compliant",
    crops: 31,
    batches: 15,
  },
]

const certificationsData = [
  {
    id: "CERT-001",
    farm: "Green Valley Farm",
    type: "USDA Organic",
    issueDate: "2023-01-15",
    expiryDate: "2025-01-15",
    status: "Active",
    inspector: "Jane Wilson",
  },
  {
    id: "CERT-002",
    farm: "Sunrise Organic Farm",
    type: "USDA Organic",
    issueDate: "2023-06-20",
    expiryDate: "2025-06-20",
    status: "Active",
    inspector: "Mike Johnson",
  },
  {
    id: "CERT-003",
    farm: "Heritage Roots Farm",
    type: "Biodynamic",
    issueDate: "2023-03-10",
    expiryDate: "2024-12-10",
    status: "Expiring Soon",
    inspector: "Sarah Davis",
  },
]

const inspectionsData = [
  {
    id: "INS-001",
    farm: "Green Valley Farm",
    type: "Annual Inspection",
    scheduledDate: "2024-04-15",
    inspector: "Jane Wilson",
    status: "Scheduled",
    priority: "Normal",
  },
  {
    id: "INS-002",
    farm: "Mountain View Farm",
    type: "Complaint Investigation",
    scheduledDate: "2024-03-25",
    inspector: "Mike Johnson",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "INS-003",
    farm: "Valley Fresh Farm",
    type: "Follow-up Inspection",
    scheduledDate: "2024-04-01",
    inspector: "Sarah Davis",
    status: "Pending",
    priority: "Medium",
  },
]

const farmColumns = [
  { key: "name", label: "Farm Name", sortable: true },
  { key: "location", label: "Location", sortable: true },
  { key: "owner", label: "Owner", sortable: true },
  {
    key: "certifications",
    label: "Certifications",
    render: (certifications: string[]) => (
      <div className="flex flex-wrap gap-1">
        {certifications.map((cert, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {cert}
          </Badge>
        ))}
      </div>
    ),
  },
  { key: "lastInspection", label: "Last Inspection", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (status: string) => (
      <Badge
        variant={status === "Compliant" ? "default" : status === "Pending Review" ? "secondary" : "destructive"}
        className={
          status === "Compliant"
            ? "bg-primary/10 text-primary"
            : status === "Pending Review"
              ? "bg-accent/10 text-accent"
              : ""
        }
      >
        {status}
      </Badge>
    ),
  },
]

const certificationColumns = [
  { key: "farm", label: "Farm", sortable: true },
  { key: "type", label: "Certification Type", sortable: true },
  { key: "issueDate", label: "Issue Date", sortable: true },
  { key: "expiryDate", label: "Expiry Date", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (status: string) => (
      <Badge
        variant={status === "Active" ? "default" : status === "Expiring Soon" ? "secondary" : "destructive"}
        className={
          status === "Active"
            ? "bg-primary/10 text-primary"
            : status === "Expiring Soon"
              ? "bg-accent/10 text-accent"
              : ""
        }
      >
        {status}
      </Badge>
    ),
  },
  { key: "inspector", label: "Inspector", sortable: true },
]

const inspectionColumns = [
  { key: "farm", label: "Farm", sortable: true },
  { key: "type", label: "Inspection Type", sortable: true },
  { key: "scheduledDate", label: "Scheduled Date", sortable: true },
  { key: "inspector", label: "Inspector", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (status: string) => (
      <Badge
        variant={
          status === "Scheduled"
            ? "default"
            : status === "In Progress"
              ? "secondary"
              : status === "Pending"
                ? "outline"
                : "destructive"
        }
        className={
          status === "Scheduled"
            ? "bg-primary/10 text-primary"
            : status === "In Progress"
              ? "bg-accent/10 text-accent"
              : ""
        }
      >
        {status}
      </Badge>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    render: (priority: string) => (
      <Badge
        variant={priority === "High" ? "destructive" : priority === "Medium" ? "secondary" : "outline"}
        className={priority === "Medium" ? "bg-accent/10 text-accent" : ""}
      >
        {priority}
      </Badge>
    ),
  },
]

export default function RegulatorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Regulatory Dashboard</h1>
            <p className="text-muted-foreground">California Department of Food & Agriculture</p>
          </div>
          <div className="flex items-center gap-3">
            <TrustBadge type="verified" />
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Registered Farms"
                value={regulatoryMetrics.totalFarms}
                change="+12 this month"
                changeType="positive"
                icon={Building}
              />
              <MetricCard
                title="Active Certifications"
                value={regulatoryMetrics.activeCertifications}
                change="98% renewal rate"
                changeType="positive"
                icon={FileCheck}
              />
              <MetricCard
                title="Pending Inspections"
                value={regulatoryMetrics.pendingInspections}
                change="5 high priority"
                changeType="neutral"
                icon={AlertTriangle}
              />
              <MetricCard
                title="Compliance Rate"
                value={regulatoryMetrics.complianceRate}
                change="+0.3% from last quarter"
                changeType="positive"
                icon={Shield}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Schedule Inspection</p>
                    <p className="text-sm text-muted-foreground">Plan farm visits</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Issue Certificate</p>
                    <p className="text-sm text-muted-foreground">Grant certifications</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-medium">Review Violations</p>
                    <p className="text-sm text-muted-foreground">Handle compliance issues</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <p className="font-medium">Generate Reports</p>
                    <p className="text-sm text-muted-foreground">Export compliance data</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Inspections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inspectionsData.slice(0, 3).map((inspection) => (
                    <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{inspection.farm}</p>
                        <p className="text-sm text-muted-foreground">{inspection.type}</p>
                        <p className="text-sm text-muted-foreground">Inspector: {inspection.inspector}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge
                          variant={
                            inspection.status === "Scheduled"
                              ? "default"
                              : inspection.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            inspection.status === "Scheduled"
                              ? "bg-primary/10 text-primary"
                              : inspection.status === "In Progress"
                                ? "bg-accent/10 text-accent"
                                : ""
                          }
                        >
                          {inspection.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{inspection.scheduledDate}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expiring Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {certificationsData
                    .filter((cert) => cert.status === "Expiring Soon")
                    .map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{cert.farm}</p>
                          <p className="text-sm text-muted-foreground">{cert.type}</p>
                          <p className="text-sm text-muted-foreground">Inspector: {cert.inspector}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            Expiring Soon
                          </Badge>
                          <p className="text-sm text-muted-foreground">{cert.expiryDate}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="farms" className="space-y-6">
            <DataTable title="Registered Farms" data={farmsData} columns={farmColumns} />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <DataTable title="Certifications" data={certificationsData} columns={certificationColumns} />
          </TabsContent>

          <TabsContent value="inspections" className="space-y-6">
            <DataTable title="Inspections" data={inspectionsData} columns={inspectionColumns} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
