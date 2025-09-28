"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { MetricCard } from "@/components/ui/metric-card"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package, Clock, Plus, Thermometer, AlertTriangle, CheckCircle, BarChart3, Calendar } from "lucide-react"

// Mock data for distributor operations
const distributorMetrics = {
  activeShipments: "47",
  totalInventory: "12,450 lbs",
  onTimeDelivery: "98.2%",
  qualityMaintained: "99.1%",
}

const shipmentsData = [
  {
    id: "SHIP-001",
    product: "Organic Cherry Tomatoes",
    origin: "Green Valley Farm",
    destination: "Fresh Market Downtown",
    status: "In Transit",
    temperature: "34°F",
    humidity: "85%",
    estimatedArrival: "2024-03-20 14:00",
    weight: "340 lbs",
  },
  {
    id: "SHIP-002",
    product: "Butter Lettuce",
    origin: "Sunrise Organic Farm",
    destination: "Whole Foods Market",
    status: "Delivered",
    temperature: "35°F",
    humidity: "90%",
    estimatedArrival: "2024-03-19 10:30",
    weight: "180 lbs",
  },
  {
    id: "SHIP-003",
    product: "Rainbow Carrots",
    origin: "Heritage Roots Farm",
    destination: "Local Grocery Chain",
    status: "Loading",
    temperature: "36°F",
    humidity: "80%",
    estimatedArrival: "2024-03-21 09:00",
    weight: "420 lbs",
  },
]

const inventoryData = [
  {
    id: "INV-001",
    product: "Organic Cherry Tomatoes",
    batch: "GT-2024-0315",
    quantity: "1,240 lbs",
    location: "Warehouse A",
    temperature: "34°F",
    expiryDate: "2024-03-25",
    status: "Good",
  },
  {
    id: "INV-002",
    product: "Butter Lettuce",
    batch: "GL-2024-0318",
    quantity: "890 lbs",
    location: "Warehouse B",
    temperature: "35°F",
    expiryDate: "2024-03-22",
    status: "Good",
  },
  {
    id: "INV-003",
    product: "Rainbow Carrots",
    batch: "GC-2024-0320",
    quantity: "2,100 lbs",
    location: "Warehouse A",
    temperature: "36°F",
    expiryDate: "2024-04-15",
    status: "Excellent",
  },
]

const shipmentColumns = [
  { key: "product", label: "Product", sortable: true },
  { key: "origin", label: "Origin", sortable: true },
  { key: "destination", label: "Destination", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (status: string) => (
      <Badge
        variant={
          status === "Delivered"
            ? "default"
            : status === "In Transit"
              ? "secondary"
              : status === "Loading"
                ? "outline"
                : "destructive"
        }
        className={
          status === "Delivered"
            ? "bg-primary/10 text-primary"
            : status === "In Transit"
              ? "bg-accent/10 text-accent"
              : ""
        }
      >
        {status}
      </Badge>
    ),
  },
  { key: "temperature", label: "Temperature", sortable: true },
  { key: "estimatedArrival", label: "ETA", sortable: true },
  { key: "weight", label: "Weight", sortable: true },
]

const inventoryColumns = [
  { key: "product", label: "Product", sortable: true },
  { key: "batch", label: "Batch ID", sortable: true },
  { key: "quantity", label: "Quantity", sortable: true },
  { key: "location", label: "Location", sortable: true },
  { key: "temperature", label: "Temperature", sortable: true },
  { key: "expiryDate", label: "Expiry Date", sortable: true },
  {
    key: "status",
    label: "Quality",
    render: (status: string) => (
      <Badge
        variant={status === "Excellent" ? "default" : status === "Good" ? "secondary" : "destructive"}
        className={
          status === "Excellent" ? "bg-primary/10 text-primary" : status === "Good" ? "bg-accent/10 text-accent" : ""
        }
      >
        {status}
      </Badge>
    ),
  },
]

export default function DistributorDashboard() {
  const [showNewShipment, setShowNewShipment] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Distributor Dashboard</h1>
            <p className="text-muted-foreground">Bay Area Distribution Hub - Oakland, CA</p>
          </div>
          <div className="flex items-center gap-3">
            <TrustBadge type="verified" />
            <TrustBadge type="blockchain" />
            <Button onClick={() => setShowNewShipment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Shipment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Shipments"
                value={distributorMetrics.activeShipments}
                change="+5 today"
                changeType="positive"
                icon={Truck}
              />
              <MetricCard
                title="Total Inventory"
                value={distributorMetrics.totalInventory}
                change="Across 3 warehouses"
                changeType="neutral"
                icon={Package}
              />
              <MetricCard
                title="On-Time Delivery"
                value={distributorMetrics.onTimeDelivery}
                change="+0.5% this month"
                changeType="positive"
                icon={Clock}
              />
              <MetricCard
                title="Quality Maintained"
                value={distributorMetrics.qualityMaintained}
                change="Cold chain intact"
                changeType="positive"
                icon={Thermometer}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Create Shipment</p>
                    <p className="text-sm text-muted-foreground">Schedule new delivery</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Update Inventory</p>
                    <p className="text-sm text-muted-foreground">Manage stock levels</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-medium">Monitor Temperature</p>
                    <p className="text-sm text-muted-foreground">Check cold chain</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-sm text-muted-foreground">Performance analytics</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Shipments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shipmentsData
                    .filter((shipment) => shipment.status !== "Delivered")
                    .map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{shipment.product}</p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.origin} → {shipment.destination}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.temperature} • {shipment.humidity}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge
                            variant={shipment.status === "In Transit" ? "secondary" : "outline"}
                            className={shipment.status === "In Transit" ? "bg-accent/10 text-accent" : ""}
                          >
                            {shipment.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{shipment.estimatedArrival}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Butter Lettuce - Low Stock</p>
                      <p className="text-sm text-muted-foreground">Only 890 lbs remaining in Warehouse B</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Temperature Optimal</p>
                      <p className="text-sm text-muted-foreground">All warehouses maintaining cold chain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-chart-3/5 border border-chart-3/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-chart-3" />
                    <div>
                      <p className="font-medium">Expiry Reminder</p>
                      <p className="text-sm text-muted-foreground">Butter Lettuce expires in 3 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <DataTable title="All Shipments" data={shipmentsData} columns={shipmentColumns} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <DataTable title="Inventory Management" data={inventoryData} columns={inventoryColumns} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">On-Time Deliveries</span>
                      <span className="font-semibold">98.2%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "98.2%" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quality Maintained</span>
                      <span className="font-semibold">99.1%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "99.1%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temperature Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg Temperature</p>
                        <p className="text-2xl font-bold">35°F</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg Humidity</p>
                        <p className="text-2xl font-bold">85%</p>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Cold chain maintained across all shipments</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Shipment Modal */}
        {showNewShipment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Shipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tomatoes">Organic Cherry Tomatoes</SelectItem>
                      <SelectItem value="lettuce">Butter Lettuce</SelectItem>
                      <SelectItem value="carrots">Rainbow Carrots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input id="origin" placeholder="e.g., Green Valley Farm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" placeholder="e.g., Fresh Market Downtown" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input id="weight" placeholder="340" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eta">Estimated Arrival</Label>
                    <Input id="eta" type="datetime-local" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewShipment(false)} className="flex-1">
                    Create Shipment
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewShipment(false)} className="bg-transparent">
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
