"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { MetricCard } from "@/components/ui/metric-card"
import { UploadZone } from "@/components/ui/upload-zone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Package,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
  Thermometer,
  Droplets,
  Sun,
  AlertCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const farmMetrics = {
  totalCrops: "24",
  activeBatches: "8",
  monthlyYield: "2,340 lbs",
  qualityScore: "98.5%",
}

const yieldData = [
  { month: "Jan", yield: 1800 },
  { month: "Feb", yield: 2100 },
  { month: "Mar", yield: 2340 },
  { month: "Apr", yield: 2200 },
  { month: "May", yield: 2500 },
  { month: "Jun", yield: 2800 },
]

const recentBatches = [
  {
    id: "GT-2024-0315",
    crop: "Cherry Tomatoes",
    variety: "Sweet 100",
    plantedDate: "2024-01-15",
    harvestDate: "2024-03-15",
    status: "Harvested",
    yield: "340 lbs",
    quality: "Grade A",
  },
  {
    id: "GL-2024-0318",
    crop: "Butter Lettuce",
    variety: "Boston Bibb",
    plantedDate: "2024-02-01",
    harvestDate: "2024-03-18",
    status: "Ready",
    yield: "180 lbs",
    quality: "Grade A",
  },
  {
    id: "GC-2024-0320",
    crop: "Rainbow Carrots",
    variety: "Mixed Heirloom",
    plantedDate: "2024-01-05",
    harvestDate: "2024-03-20",
    status: "Growing",
    yield: "Est. 420 lbs",
    quality: "Monitoring",
  },
]

export default function FarmerDashboard() {
  const [showNewBatch, setShowNewBatch] = useState(false)

  const handleFileUpload = (files: File[]) => {
    console.log("Uploaded files:", files)
    // Handle file upload logic here
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Green Valley Farm - Sonoma County, CA</p>
          </div>
          <div className="flex items-center gap-3">
            <TrustBadge type="verified" />
            <TrustBadge type="organic" />
            <Button onClick={() => setShowNewBatch(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Batch
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="batches">Crop Batches</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Crops"
                value={farmMetrics.totalCrops}
                change="+2 this month"
                changeType="positive"
                icon={Leaf}
              />
              <MetricCard
                title="Active Batches"
                value={farmMetrics.activeBatches}
                change="3 ready to harvest"
                changeType="neutral"
                icon={Package}
              />
              <MetricCard
                title="Monthly Yield"
                value={farmMetrics.monthlyYield}
                change="+12% from last month"
                changeType="positive"
                icon={TrendingUp}
              />
              <MetricCard
                title="Quality Score"
                value={farmMetrics.qualityScore}
                change="Excellent rating"
                changeType="positive"
                icon={Calendar}
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yield Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="yield" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Thermometer className="w-5 h-5 text-chart-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-semibold">72°F</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Droplets className="w-5 h-5 text-chart-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="font-semibold">65%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Sun className="w-5 h-5 text-chart-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">UV Index</p>
                        <p className="font-semibold">6.2</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Droplets className="w-5 h-5 text-chart-4" />
                      <div>
                        <p className="text-sm text-muted-foreground">Soil Moisture</p>
                        <p className="font-semibold">78%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Optimal growing conditions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Batches */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Crop Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBatches.slice(0, 3).map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{batch.crop}</h4>
                          <span className="text-sm text-muted-foreground">({batch.variety})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Batch ID: {batch.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Planted: {batch.plantedDate} • Harvest: {batch.harvestDate}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            batch.status === "Harvested"
                              ? "bg-primary/10 text-primary"
                              : batch.status === "Ready"
                                ? "bg-accent/10 text-accent"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {batch.status}
                        </span>
                        <p className="text-sm font-medium">{batch.yield}</p>
                        <p className="text-xs text-muted-foreground">{batch.quality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batches" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Crop Batches</CardTitle>
                  <Button onClick={() => setShowNewBatch(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Batch
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBatches.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{batch.crop}</h4>
                          <span className="text-sm text-muted-foreground">({batch.variety})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Batch ID: {batch.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Planted: {batch.plantedDate} • Harvest: {batch.harvestDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              batch.status === "Harvested"
                                ? "bg-primary/10 text-primary"
                                : batch.status === "Ready"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {batch.status}
                          </span>
                          <p className="text-sm font-medium">{batch.yield}</p>
                          <p className="text-xs text-muted-foreground">{batch.quality}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Growth Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch-id">Batch ID</Label>
                      <Input id="batch-id" placeholder="GT-2024-0315" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input id="temperature" placeholder="72" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="humidity">Humidity (%)</Label>
                      <Input id="humidity" placeholder="65" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Growth Notes</Label>
                    <Textarea id="notes" placeholder="Enter observations about crop growth, health, etc." />
                  </div>
                  <Button className="w-full">Save Growth Data</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Certificates & Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <UploadZone onUpload={handleFileUpload} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Package className="w-6 h-6" />
                    Record Harvest
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Leaf className="w-6 h-6" />
                    Update Crop Status
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <TrendingUp className="w-6 h-6" />
                    Generate QR Codes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yield">Yield Report</SelectItem>
                        <SelectItem value="quality">Quality Report</SelectItem>
                        <SelectItem value="environmental">Environmental Report</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "March Yield Report", date: "2024-03-20", type: "Yield" },
                    { name: "Q1 Quality Assessment", date: "2024-03-15", type: "Quality" },
                    { name: "Environmental Conditions", date: "2024-03-10", type: "Environmental" },
                  ].map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • Generated {report.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New Batch Modal */}
        {showNewBatch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Batch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crop-type">Crop Type</Label>
                  <Input id="crop-type" placeholder="e.g., Cherry Tomatoes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input id="variety" placeholder="e.g., Sweet 100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planted-date">Planted Date</Label>
                  <Input id="planted-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-harvest">Expected Harvest</Label>
                  <Input id="expected-harvest" type="date" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewBatch(false)} className="flex-1">
                    Create Batch
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewBatch(false)} className="bg-transparent">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
