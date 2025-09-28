"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Leaf, QrCode, User } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground">AgriTrace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/trace"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Trace Products
            </Link>
            <Link
              href="/farmers"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              For Farmers
            </Link>
            <Link
              href="/distributors"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              For Distributors
            </Link>
            <Link
              href="/regulators"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Regulators
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/scan">
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <Link
              href="/trace"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Trace Products
            </Link>
            <Link
              href="/farmers"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              For Farmers
            </Link>
            <Link
              href="/distributors"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              For Distributors
            </Link>
            <Link
              href="/regulators"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Regulators
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/scan" onClick={() => setIsOpen(false)}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
