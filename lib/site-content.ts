export const SITE_CONTENT_STORAGE_KEY = "gradient-palette.site-content.v1"
export const SITE_CONTENT_EVENT = "gradient-palette:site-content-updated"

export const ADMIN_USERNAME = "iqbal123"
export const ADMIN_PASSWORD = "iqbal123"

export interface SiteTheme {
  cream: string
  sand: string
  sky: string
  rust: string
  blue: string
  navy: string
}

export interface SiteLink {
  label: string
  href: string
}

export interface NavItem extends SiteLink {
  name: string
}

export interface SocialLinks {
  github: string
  linkedin: string
  email: string
}

export interface HeroContent {
  eyebrow: string
  greeting: string
  name: string
  description: string
  portraitImage: string
  portraitAlt: string
  primaryCta: SiteLink
  secondaryCta: SiteLink
}

export interface DetailItem {
  label: string
  value: string
}

export interface AboutContent {
  title: string
  subtitle: string
  image: string
  imageAlt: string
  statusLabel: string
  paragraphs: string[]
  details: DetailItem[]
  resumeLabel: string
  resumeUrl: string
}

export interface SkillItem {
  name: string
  level: number
}

export interface SkillsContent {
  title: string
  subtitle: string
  items: SkillItem[]
}

export interface ProjectItem {
  title: string
  description: string
  tags: string[]
  image: string
  demoUrl: string
  repoUrl: string
}

export interface ProjectsContent {
  title: string
  subtitle: string
  items: ProjectItem[]
}

export interface ExperienceItem {
  title: string
  company: string
  period: string
  description: string
}

export interface ExperienceContent {
  title: string
  subtitle: string
  items: ExperienceItem[]
}

export interface ContactFormContent {
  title: string
  namePlaceholder: string
  emailPlaceholder: string
  subjectPlaceholder: string
  messagePlaceholder: string
  submitLabel: string
  submittingLabel: string
  toastTitle: string
  toastDescription: string
}

export interface ContactContent {
  title: string
  subtitle: string
  informationTitle: string
  currentStatusTitle: string
  currentStatus: string
  form: ContactFormContent
}

export interface NavContent {
  brandPrimary: string
  brandSecondary: string
  resumeLabel: string
  resumeUrl: string
  items: NavItem[]
}

export interface FooterContent {
  owner: string
  rightsText: string
}

export interface MetaContent {
  title: string
  description: string
}

export interface SiteContent {
  updatedAt: string
  meta: MetaContent
  theme: SiteTheme
  nav: NavContent
  socials: SocialLinks
  hero: HeroContent
  about: AboutContent
  skills: SkillsContent
  projects: ProjectsContent
  experience: ExperienceContent
  contact: ContactContent
  footer: FooterContent
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  updatedAt: "2026-07-13T09:12:20.318Z",
  meta: {
    title: "Iqbal Chaqa Fuzta | Portfolio",
    description: "Software engineer and creative developer portfolio.",
  },
  theme: {
    cream: "#F3ECEA",
    sand: "#CCC4AE",
    sky: "#A3BDD3",
    rust: "#AD4E1A",
    blue: "#24547D",
    navy: "#191F45",
  },
  nav: {
    brandPrimary: "Iqbal",
    brandSecondary: " Chaqa Fuzta",
    resumeLabel: "Resume",
    resumeUrl: "#about",
    items: [
      { name: "About", label: "About", href: "#about" },
      { name: "Skills", label: "Skills", href: "#skills" },
      { name: "Projects", label: "Projects", href: "#projects" },
      { name: "Experience", label: "Experience", href: "#experience" },
      { name: "Contact", label: "Contact", href: "#contact" },
    ],
  },
  socials: {
    github: "https://github.com/shinekyaw",
    linkedin: "https://www.linkedin.com/in/shinekyawkyawaung/",
    email: "shinekyawkyawaung@gmail.com",
  },
  hero: {
    eyebrow: "Software Engineer & Creative Developer",
    greeting: "Hi, I'm",
    name: "Iqbal Chaqa Fuzta",
    description: "I craft exceptional digital experiences with code, creativity, and a passion for innovation.",
    portraitImage: "/profile-cutout-trimmed.png",
    portraitAlt: "Iqbal Chaqa Fuzta",
    primaryCta: { label: "View Projects", href: "#projects" },
    secondaryCta: { label: "Contact Me", href: "#contact" },
  },
  about: {
    title: "About Me",
    subtitle: "My background and journey",
    image: "/placeholder.svg?height=600&width=600",
    imageAlt: "Iqbal Chaqa Fuzta",
    statusLabel: "Available for work",
    paragraphs: [
      "I'm a passionate software engineer with experience building web applications and digital products. I specialize in frontend development with React and Next.js, but I'm also comfortable working with backend technologies.",
      "My journey in tech started with a strong foundation in software development. I've worked with various companies to create intuitive, performant, and accessible digital experiences.",
      "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, and staying up-to-date with the latest industry trends.",
    ],
    details: [
      { label: "Name", value: "Iqbal Chaqa Fuzta" },
      { label: "Email", value: "shinekyawkyawaung@gmail.com" },
      { label: "Location", value: "Myanmar" },
      { label: "Availability", value: "Open to opportunities" },
    ],
    resumeLabel: "Download Resume",
    resumeUrl: "#",
  },
  skills: {
    title: "My Skills",
    subtitle: "Technologies I work with",
    items: [
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Node.js", level: 80 },
      { name: "HTML/CSS", level: 95 },
      { name: "Tailwind CSS", level: 90 },
      { name: "GraphQL", level: 75 },
      { name: "PostgreSQL", level: 70 },
      { name: "AWS", level: 65 },
      { name: "Docker", level: 60 },
      { name: "Git", level: 85 },
    ],
  },
  projects: {
    title: "Featured Projects",
    subtitle: "Some of my recent work",
    items: [
      {
        title: "E-commerce Platform",
        description: "A full-stack e-commerce platform built with Next.js, Stripe, and Prisma.",
        tags: ["Next.js", "TypeScript", "Prisma", "Stripe"],
        image: "/placeholder.svg?height=400&width=600",
        demoUrl: "",
        repoUrl: "https://github.com",
      },
      {
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates.",
        tags: ["React", "Firebase", "Tailwind CSS", "Redux"],
        image: "/placeholder.svg?height=400&width=600",
        demoUrl: "",
        repoUrl: "https://github.com",
      },
      {
        title: "AI Content Generator",
        description: "An AI-powered content generation tool using OpenAI's GPT models.",
        tags: ["Next.js", "OpenAI API", "Node.js", "MongoDB"],
        image: "/placeholder.svg?height=400&width=600",
        demoUrl: "",
        repoUrl: "https://github.com",
      },
      {
        title: "Fitness Tracker",
        description: "A mobile-first fitness tracking application with data visualization.",
        tags: ["React Native", "TypeScript", "D3.js", "Firebase"],
        image: "/placeholder.svg?height=400&width=600",
        demoUrl: "",
        repoUrl: "https://github.com",
      },
      {
        title: "Weather Dashboard",
        description: "A beautiful weather dashboard with forecasts and historical data.",
        tags: ["React", "Weather API", "Chart.js", "Styled Components"],
        image: "/placeholder.svg?height=400&width=600",
        demoUrl: "",
        repoUrl: "https://github.com",
      },
      {
        title: "Portfolio Website",
        description: "This portfolio website built with Next.js and Tailwind CSS.",
        tags: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
        image: "/placeholder.svg?height=400&width=600",
        demoUrl: "",
        repoUrl: "https://github.com",
      },
    ],
  },
  experience: {
    title: "Work Experience",
    subtitle: "My professional journey",
    items: [
      {
        title: "Senior Frontend Engineer",
        company: "Tech Innovations Inc.",
        period: "2021 - Present",
        description:
          "Lead the frontend development team in building a SaaS platform. Implemented new features, improved performance, and mentored junior developers.",
      },
      {
        title: "Frontend Developer",
        company: "Digital Solutions Co.",
        period: "2019 - 2021",
        description:
          "Developed responsive web applications using React and TypeScript. Collaborated with designers and backend engineers to deliver high-quality products.",
      },
      {
        title: "Web Developer",
        company: "Creative Agency",
        period: "2017 - 2019",
        description:
          "Built websites and web applications for various clients. Worked with HTML, CSS, JavaScript, and WordPress.",
      },
      {
        title: "Intern",
        company: "Startup Hub",
        period: "2016 - 2017",
        description: "Assisted in developing web applications and learned modern web development practices.",
      },
    ],
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Let's work together",
    informationTitle: "Contact Information",
    currentStatusTitle: "Current Status",
    currentStatus: "Available for freelance work and full-time opportunities",
    form: {
      title: "Send Me a Message",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Your Message",
      submitLabel: "Send Message",
      submittingLabel: "Sending...",
      toastTitle: "Message sent!",
      toastDescription: "Thanks for reaching out. I'll get back to you soon.",
    },
  },
  footer: {
    owner: "Iqbal Chaqa Fuzta",
    rightsText: "All rights reserved.",
  },
}

export function cloneSiteContent(content: SiteContent = DEFAULT_SITE_CONTENT): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent
}

export function mergeSiteContent(content: unknown): SiteContent {
  return deepMerge(DEFAULT_SITE_CONTENT, content)
}

function deepMerge<T>(base: T, value: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(value) ? value : cloneValue(base)) as T
  }

  if (isRecord(base)) {
    const result: Record<string, unknown> = {}
    const incoming = isRecord(value) ? value : {}

    for (const key of Object.keys(base)) {
      result[key] = deepMerge(base[key as keyof typeof base], incoming[key])
    }

    for (const key of Object.keys(incoming)) {
      if (!(key in result)) {
        result[key] = cloneValue(incoming[key])
      }
    }

    return result as T
  }

  return (value === undefined || value === null ? base : value) as T
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
