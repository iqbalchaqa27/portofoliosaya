"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ContactFormContent } from "@/lib/site-content"

interface ContactFormProps {
  content: ContactFormContent
}

export function ContactForm({ content }: ContactFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: content.toastTitle,
      description: content.toastDescription,
    })

    setIsSubmitting(false)
    e.currentTarget.reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-xl bg-kv-navy/55 backdrop-blur-sm border border-kv-sky/20 p-6 transition-all duration-300 hover:border-kv-sand/60">
        <div className="absolute -inset-1 bg-gradient-to-r from-kv-sky/15 to-kv-rust/15 rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

        <div className="relative">
          <h3 className="text-2xl font-bold mb-6">{content.title}</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder={content.namePlaceholder}
                required
                className="bg-kv-navy/60 border-kv-sky/25 text-kv-cream placeholder:text-kv-sand/60 focus:border-kv-sand focus:ring-kv-sand/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={content.emailPlaceholder}
                required
                className="bg-kv-navy/60 border-kv-sky/25 text-kv-cream placeholder:text-kv-sand/60 focus:border-kv-sand focus:ring-kv-sand/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder={content.subjectPlaceholder}
                required
                className="bg-kv-navy/60 border-kv-sky/25 text-kv-cream placeholder:text-kv-sand/60 focus:border-kv-sand focus:ring-kv-sand/20"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder={content.messagePlaceholder}
                rows={5}
                required
                className="bg-kv-navy/60 border-kv-sky/25 text-kv-cream placeholder:text-kv-sand/60 focus:border-kv-sand focus:ring-kv-sand/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-kv-cream to-kv-sky hover:from-kv-sand hover:to-kv-sky text-kv-navy border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{content.submittingLabel}</>
              ) : (
                <>
                  {content.submitLabel} <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
