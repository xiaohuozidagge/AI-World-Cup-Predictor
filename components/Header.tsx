"use client"

import Link from "next/link"
import { Trophy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from "react"

const navLinks = [
  { href: "/predictions", label: "Predictions" },
  { href: "/teams", label: "Teams" },
  { href: "/schedule", label: "Schedule" },
  { href: "/winner-predictions", label: "Winner" },
  { href: "/simulator", label: "Simulator" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sports-green hover:text-sports-green/80 transition-colors">
          <Trophy className="h-6 w-6" />
          <span className="hidden sm:inline">AI World Cup Predictions</span>
          <span className="sm:hidden">AI WCP</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-white px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("block py-2.5 text-sm font-medium text-foreground hover:text-sports-green transition-colors")}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
