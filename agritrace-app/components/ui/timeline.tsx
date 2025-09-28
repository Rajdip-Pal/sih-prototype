"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrustBadge } from "@/components/ui/trust-badge"
import { CheckCircle, Clock, MapPin, FileText, Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineStep {
  id: string
  title: string
  location: string
  date: string
  status: "completed" | "current" | "pending"
  description: string
  certificates?: string[]
  documents?: string[]
  icon: React.ReactNode
  details?: {
    temperature?: string
    humidity?: string
    quality?: string
    notes?: string
  }
}

interface TimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function Timeline({ steps, className }: TimelineProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          {/* Timeline Line */}
          {index < steps.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />}

          <Card
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              step.status === "completed" && "border-primary/20 bg-primary/5",
              step.status === "current" && "border-accent/20 bg-accent/5 animate-pulse-green",
              expandedStep === step.id && "shadow-lg",
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                    step.status === "completed" && "bg-primary text-primary-foreground",
                    step.status === "current" && "bg-accent text-accent-foreground",
                    step.status === "pending" && "bg-muted text-muted-foreground",
                  )}
                >
                  {step.status === "completed" ? <CheckCircle className="w-6 h-6" /> : step.icon}
                </div>

                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {step.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {step.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.status === "completed" && <TrustBadge type="verified" />}
                      {step.certificates && step.certificates.includes("organic") && <TrustBadge type="organic" />}
                      {step.certificates && step.certificates.includes("blockchain") && (
                        <TrustBadge type="blockchain" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground">{step.description}</p>

                  {/* Expandable Details */}
                  {(step.details || step.documents || step.certificates) && (
                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        {expandedStep === step.id ? "Hide Details" : "View Details"}
                      </Button>

                      {expandedStep === step.id && (
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-fade-in-up">
                          {/* Environmental Details */}
                          {step.details && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {step.details.temperature && (
                                <div className="text-center p-3 bg-background rounded-lg">
                                  <p className="text-sm text-muted-foreground">Temperature</p>
                                  <p className="font-semibold">{step.details.temperature}</p>
                                </div>
                              )}
                              {step.details.humidity && (
                                <div className="text-center p-3 bg-background rounded-lg">
                                  <p className="text-sm text-muted-foreground">Humidity</p>
                                  <p className="font-semibold">{step.details.humidity}</p>
                                </div>
                              )}
                              {step.details.quality && (
                                <div className="text-center p-3 bg-background rounded-lg">
                                  <p className="text-sm text-muted-foreground">Quality Score</p>
                                  <p className="font-semibold">{step.details.quality}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Notes */}
                          {step.details?.notes && (
                            <div className="p-3 bg-background rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Notes</p>
                              <p className="text-sm">{step.details.notes}</p>
                            </div>
                          )}

                          {/* Documents */}
                          {step.documents && step.documents.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Documents</p>
                              <div className="flex flex-wrap gap-2">
                                {step.documents.map((doc, i) => (
                                  <Button key={i} variant="outline" size="sm" className="text-xs bg-transparent">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {doc}
                                    <Download className="w-3 h-3 ml-1" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Blockchain Verification */}
                          {step.certificates?.includes("blockchain") && (
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium">Blockchain Verified</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs">
                                  View on Chain
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
