"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { SkillBadge } from "@/components/skill-badge"
import { Timeline } from "@/components/timeline"
import { ContactForm } from "@/components/contact-form"
import { CreativeHero } from "@/components/creative-hero"
import { FloatingNav } from "@/components/floating-nav"
import { MouseFollower } from "@/components/mouse-follower"
import { ScrollProgress } from "@/components/scroll-progress"
import { SectionHeading } from "@/components/section-heading"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { useSiteContent } from "@/hooks/use-site-content"

export function PortfolioPage() {
  const { content } = useSiteContent()
  const emailHref = getEmailHref(content.socials.email)
  const emailLabel = getEmailLabel(content.socials.email)

  return (
    <div className="min-h-screen bg-gradient-to-b from-kv-blue via-kv-navy to-kv-navy text-kv-cream overflow-hidden">
      <MouseFollower />
      <ScrollProgress />
      <FloatingNav nav={content.nav} />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-kv-sky rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-kv-sand rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-kv-rust rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-kv-cream/10 backdrop-blur-sm border border-kv-cream/20 mb-4 mt-4 text-kv-cream">
                <span className="relative z-10">{content.hero.eyebrow}</span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-kv-cream/20 to-kv-sky/20 animate-pulse"></span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block">{content.hero.greeting}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-kv-cream to-kv-sky">
                {content.hero.name}
              </span>
            </h1>
            <p className="text-xl text-kv-sand max-w-[600px]">{content.hero.description}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                className="relative overflow-hidden group bg-gradient-to-r from-kv-cream to-kv-sky text-kv-navy border-0 shadow-lg shadow-kv-sky/20"
                asChild
              >
                <Link href={content.hero.primaryCta.href}>
                  <span className="relative z-10 flex items-center">
                    {content.hero.primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-kv-sand to-kv-sky opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-kv-sky/50 text-kv-sand hover:text-kv-navy hover:bg-kv-sky hover:border-kv-sky"
                asChild
              >
                <Link href={content.hero.secondaryCta.href}>{content.hero.secondaryCta.label}</Link>
              </Button>
            </div>
            <div className="flex gap-4 pt-4">
              <Link href={content.socials.github} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-kv-navy/50 hover:bg-kv-blue/70 text-kv-sand hover:text-kv-cream border border-kv-sky/10"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href={content.socials.linkedin} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-kv-navy/50 hover:bg-kv-blue/70 text-kv-sand hover:text-kv-cream border border-kv-sky/10"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href={emailHref}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-kv-navy/50 hover:bg-kv-blue/70 text-kv-sand hover:text-kv-cream border border-kv-sky/10"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <CreativeHero portraitImage={content.hero.portraitImage} portraitAlt={content.hero.portraitAlt} />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-kv-cream/30 flex justify-center items-start p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-kv-sand/80 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section id="about" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-kv-sky rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-kv-rust rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={content.about.title} subtitle={content.about.subtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-kv-sky/25 to-kv-rust/25 blur-xl opacity-70"></div>
              <div className="relative aspect-square rounded-xl overflow-hidden border border-kv-sky/20">
                <img src={content.about.image} alt={content.about.imageAlt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-kv-navy/85 via-kv-navy/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-kv-sky animate-pulse"></div>
                    <span className="text-sm font-medium">{content.about.statusLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <GlassmorphicCard>
                {content.about.paragraphs.map((paragraph, index) => (
                  <p key={index} className={`text-lg text-kv-cream/80 ${index > 0 ? "mt-4" : ""}`}>
                    {paragraph}
                  </p>
                ))}

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {content.about.details.map((detail) => (
                    <div key={detail.label} className="space-y-1">
                      <div className="text-sm text-kv-sky/70">{detail.label}</div>
                      <div className={`font-medium ${detail.label.toLowerCase().includes("availability") ? "text-kv-sky" : ""}`}>
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button className="bg-kv-blue hover:bg-kv-rust text-kv-cream" asChild>
                    <Link href={content.about.resumeUrl}>{content.about.resumeLabel}</Link>
                  </Button>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-kv-blue rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-kv-sand rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={content.skills.title} subtitle={content.skills.subtitle} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
            {content.skills.items.map((skill) => (
              <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-kv-rust rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-kv-sand rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={content.projects.title} subtitle={content.projects.subtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {content.projects.items.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.tags}
                image={project.image}
                demoUrl={project.demoUrl}
                repoUrl={project.repoUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-kv-sand rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-kv-blue rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={content.experience.title} subtitle={content.experience.subtitle} />

          <div className="mt-16">
            <Timeline experiences={content.experience.items} />
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-kv-rust rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-kv-sky rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={content.contact.title} subtitle={content.contact.subtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <GlassmorphicCard>
              <h3 className="text-2xl font-bold mb-6">{content.contact.informationTitle}</h3>
              <div className="space-y-6">
                <ContactInfo icon={<Mail className="h-5 w-5 text-kv-sand" />} label="Email" value={emailLabel} />
                <ContactInfo icon={<Linkedin className="h-5 w-5 text-kv-sand" />} label="LinkedIn" value={content.socials.linkedin} />
                <ContactInfo icon={<Github className="h-5 w-5 text-kv-sand" />} label="GitHub" value={content.socials.github} />
              </div>

              <div className="mt-8 pt-8 border-t border-kv-sky/20">
                <h4 className="text-lg font-medium mb-4">{content.contact.currentStatusTitle}</h4>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-kv-sky animate-pulse"></div>
                  <span>{content.contact.currentStatus}</span>
                </div>
              </div>
            </GlassmorphicCard>

            <ContactForm content={content.contact.form} />
          </div>
        </div>
      </section>

      <footer className="border-t border-kv-sky/20 py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link href="/" className="font-bold text-xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-kv-cream to-kv-sky">
                {content.nav.brandPrimary}
              </span>
              <span className="text-kv-sand">{content.nav.brandSecondary}</span>
            </Link>
            <p className="text-sm text-kv-sky/70 mt-2">
              &copy; {new Date().getFullYear()} {content.footer.owner}. {content.footer.rightsText}
            </p>
          </div>
          <div className="flex gap-4">
            <SocialButton href={content.socials.github} label="GitHub" icon={<Github className="h-5 w-5" />} />
            <SocialButton href={content.socials.linkedin} label="LinkedIn" icon={<Linkedin className="h-5 w-5" />} />
            <SocialButton href={emailHref} label="Email" icon={<Mail className="h-5 w-5" />} />
          </div>
        </div>
      </footer>
    </div>
  )
}

function ContactInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-kv-blue/60 border border-kv-sky/20 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-kv-sky/70">{label}</div>
        <div className="font-medium break-words">{value}</div>
      </div>
    </div>
  )
}

function SocialButton({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  const isExternal = href.startsWith("http")

  return (
    <Link href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-kv-navy/50 hover:bg-kv-blue/70 text-kv-sand hover:text-kv-cream border border-kv-sky/10"
      >
        {icon}
        <span className="sr-only">{label}</span>
      </Button>
    </Link>
  )
}

function getEmailHref(email: string) {
  return email.startsWith("mailto:") ? email : `mailto:${email}`
}

function getEmailLabel(email: string) {
  return email.replace(/^mailto:/, "")
}
