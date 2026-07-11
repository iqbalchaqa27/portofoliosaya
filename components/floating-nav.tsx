"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import type { NavContent } from "@/lib/site-content"

interface FloatingNavProps {
  nav: NavContent
}

export function FloatingNav({ nav }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = nav.items

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <motion.div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative px-4 py-3 rounded-full bg-kv-navy/85 backdrop-blur-md border border-kv-sky/25 shadow-lg shadow-kv-navy/40">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-kv-sky/20 to-kv-rust/20 rounded-full blur opacity-50"></div>

          {isMobile ? (
            <div className="relative flex items-center justify-between">
              <Link href="/" className="font-bold text-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-kv-cream to-kv-sky">
                  {nav.brandPrimary}
                </span>
                <span className="text-kv-sand">{nav.brandSecondary}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-kv-sand hover:text-kv-cream hover:bg-kv-blue/50"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          ) : (
            <div className="relative flex items-center gap-1">
              <Link href="/" className="font-bold text-lg mr-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-kv-cream to-kv-sky">
                  {nav.brandPrimary}
                </span>
                <span className="text-kv-sand">{nav.brandSecondary}</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="px-3 py-1 text-sm font-medium text-kv-sand hover:text-kv-cream transition-colors"
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                size="sm"
                className="ml-2 bg-gradient-to-r from-kv-cream to-kv-sky hover:from-kv-sand hover:to-kv-sky text-kv-navy border-0"
                asChild
              >
                <Link href={nav.resumeUrl}>{nav.resumeLabel}</Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile menu */}
      {isMobile && (
        <motion.div
          className={`fixed inset-0 z-40 bg-kv-navy/95 backdrop-blur-md ${isOpen ? "block" : "hidden"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="px-8 py-4 text-2xl font-medium text-kv-cream hover:text-kv-sky transition-colors"
                onClick={handleNavClick}
              >
                {item.label}
              </Link>
            ))}
            <Button
              className="mt-6 bg-gradient-to-r from-kv-cream to-kv-sky hover:from-kv-sand hover:to-kv-sky text-kv-navy border-0"
              asChild
            >
              <Link href={nav.resumeUrl} onClick={handleNavClick}>
                {nav.resumeLabel}
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </>
  )
}
