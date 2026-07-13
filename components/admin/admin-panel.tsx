"use client"

import Link from "next/link"
import { Code2, Eye, FileText, Inbox, LogOut, Palette, Plus, RefreshCw, RotateCcw, Save, Trash2, Upload } from "lucide-react"
import { useEffect, useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createSupabaseClient, signInToSupabase, signOutFromSupabase } from "@/lib/supabase/client"
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  cloneSiteContent,
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type SiteContent,
  type SiteTheme,
} from "@/lib/site-content"
import { useSiteContent } from "@/hooks/use-site-content"

const ADMIN_SESSION_KEY = "gradient-palette.admin-session.v1"

type AdminSection =
  | "meta"
  | "theme"
  | "nav"
  | "socials"
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "contact"
  | "messages"
  | "footer"
  | "json"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

const sections: Array<{ id: AdminSection; label: string }> = [
  { id: "meta", label: "Meta" },
  { id: "theme", label: "Theme" },
  { id: "nav", label: "Navigasi" },
  { id: "socials", label: "Social" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
  { id: "messages", label: "Pesan" },
  { id: "footer", label: "Footer" },
  { id: "json", label: "JSON" },
]

export function AdminPanel() {
  const { content, isLoading, saveContent, resetContent } = useSiteContent()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [activeSection, setActiveSection] = useState<AdminSection>("meta")
  const [draft, setDraft] = useState<SiteContent>(() => cloneSiteContent())
  const [jsonDraft, setJsonDraft] = useState("")
  const [isDirty, setIsDirty] = useState(false)
  const [status, setStatus] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [messagesError, setMessagesError] = useState("")

  useEffect(() => {
    const supabase = createSupabaseClient()

    if (!supabase) {
      setIsAuthenticated(window.localStorage.getItem(ADMIN_SESSION_KEY) === "true")
      return
    }

    void supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session || window.localStorage.getItem(ADMIN_SESSION_KEY) === "true")
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      if (!session) {
        window.localStorage.removeItem(ADMIN_SESSION_KEY)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isLoading || isDirty) return

    const nextContent = cloneSiteContent(content)
    setDraft(nextContent)
    setJsonDraft(JSON.stringify(nextContent, null, 2))
  }, [content, isDirty, isLoading])

  useEffect(() => {
    if (!isAuthenticated || activeSection !== "messages") return
    void fetchContactMessages()
  }, [activeSection, isAuthenticated])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsAuthenticating(true)
    setLoginError("")

    const supabase = createSupabaseClient()
    if (supabase) {
      const { data, error } = await signInToSupabase(loginUsername, loginPassword)
      if (!error && data?.session) {
        window.localStorage.setItem(ADMIN_SESSION_KEY, "true")
        setIsAuthenticated(true)
        setLoginPassword("")
        setIsAuthenticating(false)
        return
      }
    }

    if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_SESSION_KEY, "true")
      setIsAuthenticated(true)
      setLoginPassword("")
      setIsAuthenticating(false)
      return
    }

    setLoginError("Email atau password salah. Jika belum ada akun Supabase, gunakan kredensial admin default.")
    setIsAuthenticating(false)
  }

  async function handleLogout() {
    const supabase = createSupabaseClient()
    if (supabase) {
      await signOutFromSupabase()
    }

    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
    setLoginUsername("")
    setLoginPassword("")
  }

  function getAdminRequestCredentials(accessToken?: string) {
    return {
      username: loginUsername || ADMIN_USERNAME,
      password: loginPassword || ADMIN_PASSWORD,
      accessToken,
    }
  }

  function getAdminRequestHeaders(accessToken?: string): HeadersInit {
    const credentials = getAdminRequestCredentials(accessToken)
    const headers: HeadersInit = {
      "x-admin-username": credentials.username,
      "x-admin-password": credentials.password,
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    return headers
  }

  async function fetchContactMessages() {
    setIsLoadingMessages(true)
    setMessagesError("")

    const supabase = createSupabaseClient()
    const accessToken = supabase ? (await supabase.auth.getSession()).data.session?.access_token : undefined

    try {
      const response = await fetch("/api/contact", {
        headers: getAdminRequestHeaders(accessToken),
        cache: "no-store",
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal mengambil pesan.")
      }

      setContactMessages(result.messages ?? [])
    } catch (error) {
      setMessagesError(error instanceof Error ? error.message : "Gagal mengambil pesan.")
    } finally {
      setIsLoadingMessages(false)
    }
  }

  function commitDraft(nextDraft: SiteContent) {
    const mergedDraft = mergeSiteContent(nextDraft)
    setDraft(mergedDraft)
    setJsonDraft(JSON.stringify(mergedDraft, null, 2))
    setIsDirty(true)
    setStatus("")
  }

  function setValue(path: FieldPath, value: unknown) {
    const nextDraft = cloneSiteContent(draft)
    setAtPath(nextDraft, path, value)
    commitDraft(nextDraft)
  }

  function setValues(updates: Array<{ path: FieldPath; value: unknown }>) {
    const nextDraft = cloneSiteContent(draft)

    for (const update of updates) {
      setAtPath(nextDraft, update.path, update.value)
    }

    commitDraft(nextDraft)
  }

  function addArrayItem<T>(path: FieldPath, item: T) {
    const nextDraft = cloneSiteContent(draft)
    getAtPath<T[]>(nextDraft, path).push(item)
    commitDraft(nextDraft)
  }

  function removeArrayItem(path: FieldPath, index: number) {
    const nextDraft = cloneSiteContent(draft)
    getAtPath<unknown[]>(nextDraft, path).splice(index, 1)
    commitDraft(nextDraft)
  }

  function moveArrayItem(path: FieldPath, index: number, direction: -1 | 1) {
    const nextDraft = cloneSiteContent(draft)
    const items = getAtPath<unknown[]>(nextDraft, path)
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= items.length) return

    const [item] = items.splice(index, 1)
    items.splice(nextIndex, 0, item)
    commitDraft(nextDraft)
  }

  async function handleSave() {
    setIsSaving(true)
    setStatus("Menyimpan perubahan...")

    const supabase = createSupabaseClient()
    const accessToken = supabase ? (await supabase.auth.getSession()).data.session?.access_token : undefined

    const result = await saveContent(draft, getAdminRequestCredentials(accessToken))

    setDraft(result.content)
    setJsonDraft(JSON.stringify(result.content, null, 2))
    setIsDirty(false)
    setIsSaving(false)
    setStatus(
      result.savedRemotely
        ? "Tersimpan ke Supabase. Website utama sudah diperbarui."
        : "Gagal menyimpan ke server. Perubahan hanya tersimpan di browser ini."
    )
  }

  async function handleFileUpload(file: File, path: FieldPath | FieldPath[], successMessage = "Upload berhasil. Klik Save untuk menyimpan perubahan ke website.") {
    setIsSaving(true)
    setStatus("Mengupload file...")

    const supabase = createSupabaseClient()
    const accessToken = supabase ? (await supabase.auth.getSession()).data.session?.access_token : undefined

    const credentials = getAdminRequestCredentials(accessToken)
    const formData = new FormData()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
      const result = await response.json()

      if (!response.ok) {
        setStatus(result.error ?? "Upload gagal.")
        return
      }

      const targetPaths = Array.isArray(path[0]) ? (path as FieldPath[]) : [path as FieldPath]
      setValues(targetPaths.map((fieldPath) => ({ path: fieldPath, value: result.url })))
      setStatus(successMessage)
    } catch {
      setStatus("Upload gagal. Coba lagi.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleReset() {
    const confirmed = window.confirm("Reset semua konten ke data awal?")
    if (!confirmed) return

    setIsSaving(true)
    setStatus("Mereset konten...")

    const supabase = createSupabaseClient()
    const accessToken = supabase ? (await supabase.auth.getSession()).data.session?.access_token : undefined

    const result = await resetContent(getAdminRequestCredentials(accessToken))

    setDraft(result.content)
    setJsonDraft(JSON.stringify(result.content, null, 2))
    setIsDirty(false)
    setIsSaving(false)
    setStatus(
      result.savedRemotely
        ? "Konten berhasil direset dan tersimpan ke Supabase."
        : "Gagal mereset di server. Perubahan hanya tersimpan di browser ini."
    )
  }

  function handleApplyJson() {
    try {
      const nextContent = mergeSiteContent(JSON.parse(jsonDraft))
      commitDraft(nextContent)
      setStatus("JSON valid. Klik Save untuk menyimpan.")
    } catch {
      setStatus("JSON tidak valid. Periksa tanda koma, kutip, dan kurung.")
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-kv-blue via-kv-navy to-kv-navy text-kv-cream flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg border border-kv-sky/25 bg-kv-navy/70 p-6 shadow-xl shadow-kv-navy/40"
        >
          <div className="mb-6">
            <p className="text-sm text-kv-sand">Admin</p>
            <h1 className="text-2xl font-bold">Login Portfolio</h1>
          </div>

          <div className="space-y-4">
            <Field
              label="Email"
              value={loginUsername}
              onChange={setLoginUsername}

            />
            <Field
              label="Password"
              value={loginPassword}
              onChange={setLoginPassword}
              type="password"

            />
          </div>

          {loginError && <p className="mt-4 text-sm text-kv-rust">{loginError}</p>}

          <Button className="mt-6 w-full bg-gradient-to-r from-kv-cream to-kv-sky text-kv-navy" type="submit" disabled={isAuthenticating}>
            {isAuthenticating ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-kv-blue via-kv-navy to-kv-navy text-kv-cream">
      <div className="border-b border-kv-sky/20 bg-kv-navy/80 backdrop-blur">
        <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-kv-sand">Admin Panel</p>
            <h1 className="text-2xl font-bold">Edit Website Utama</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-kv-sky/40 text-kv-sand hover:bg-kv-blue hover:text-kv-cream" asChild>
              <Link href="/" target="_blank">
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-kv-sky/40 text-kv-sand hover:bg-kv-blue hover:text-kv-cream"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button className="bg-gradient-to-r from-kv-cream to-kv-sky text-kv-navy" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="ghost" className="text-kv-sand hover:bg-kv-blue hover:text-kv-cream" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container grid gap-6 py-6 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit rounded-lg border border-kv-sky/20 bg-kv-navy/55 p-3">
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`rounded-md px-3 py-2 text-left text-sm transition ${
                  activeSection === section.id
                    ? "bg-kv-sky text-kv-navy"
                    : "text-kv-sand hover:bg-kv-blue/70 hover:text-kv-cream"
                }`}
                onClick={() => setActiveSection(section.id)}
                type="button"
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          {status && (
            <div className="mb-4 rounded-md border border-kv-sky/20 bg-kv-blue/40 px-4 py-3 text-sm text-kv-cream">
              {status}
            </div>
          )}

          {activeSection === "meta" && (
            <Panel title="Meta Website" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title browser" value={draft.meta.title} onChange={(value) => setValue(["meta", "title"], value)} />
                <Field
                  label="Description SEO"
                  value={draft.meta.description}
                  onChange={(value) => setValue(["meta", "description"], value)}
                />
              </div>
            </Panel>
          )}

          {activeSection === "theme" && (
            <Panel title="Theme Colors" icon={<Palette className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(Object.keys(draft.theme) as Array<keyof SiteTheme>).map((key) => (
                  <ColorField
                    key={key}
                    label={key}
                    value={draft.theme[key]}
                    onChange={(value) => setValue(["theme", key], value)}
                  />
                ))}
              </div>
            </Panel>
          )}

          {activeSection === "nav" && (
            <Panel title="Navigasi" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Brand utama" value={draft.nav.brandPrimary} onChange={(value) => setValue(["nav", "brandPrimary"], value)} />
                <Field
                  label="Brand kedua"
                  value={draft.nav.brandSecondary}
                  onChange={(value) => setValue(["nav", "brandSecondary"], value)}
                />
                <Field label="Label resume" value={draft.nav.resumeLabel} onChange={(value) => setValue(["nav", "resumeLabel"], value)} />
                <UploadField
                  label="Upload resume"
                  helper="PDF, DOC, atau DOCX. Setelah upload, klik Save."
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  previewUrl={draft.nav.resumeUrl}
                  onUpload={(file) =>
                    handleFileUpload(
                      file,
                      [["nav", "resumeUrl"], ["about", "resumeUrl"]],
                      "Resume berhasil diupload. Klik Save untuk menyimpan perubahan ke website."
                    )
                  }
                  disabled={isSaving}
                />
              </div>

              <ArrayHeader title="Menu navigasi" onAdd={() => addArrayItem(["nav", "items"], { name: "Menu", label: "Menu", href: "#" })} />
              <div className="space-y-4">
                {draft.nav.items.map((item, index) => (
                  <ItemBox key={`${item.label}-${index}`} onRemove={() => removeArrayItem(["nav", "items"], index)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Label"
                        value={item.label}
                        onChange={(value) => {
                          setValues([
                            { path: ["nav", "items", index, "label"], value },
                            { path: ["nav", "items", index, "name"], value },
                          ])
                        }}
                      />
                      <Field label="Href" value={item.href} onChange={(value) => setValue(["nav", "items", index, "href"], value)} />
                    </div>
                    <MoveControls
                      index={index}
                      length={draft.nav.items.length}
                      onMove={(direction) => moveArrayItem(["nav", "items"], index, direction)}
                    />
                  </ItemBox>
                ))}
              </div>
            </Panel>
          )}

          {activeSection === "socials" && (
            <Panel title="Social Links" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="GitHub URL" value={draft.socials.github} onChange={(value) => setValue(["socials", "github"], value)} />
                <Field label="LinkedIn URL" value={draft.socials.linkedin} onChange={(value) => setValue(["socials", "linkedin"], value)} />
                <Field label="Email" value={draft.socials.email} onChange={(value) => setValue(["socials", "email"], value)} />
              </div>
            </Panel>
          )}

          {activeSection === "hero" && (
            <Panel title="Hero Section" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow" value={draft.hero.eyebrow} onChange={(value) => setValue(["hero", "eyebrow"], value)} />
                <Field label="Greeting" value={draft.hero.greeting} onChange={(value) => setValue(["hero", "greeting"], value)} />
                <Field label="Nama besar" value={draft.hero.name} onChange={(value) => setValue(["hero", "name"], value)} />
                <UploadField
                  label="Upload foto hero"
                  helper="PNG, JPG, JPEG, atau WEBP. Setelah upload, klik Save."
                  previewUrl={draft.hero.portraitImage}
                  onUpload={(file) => handleFileUpload(file, ["hero", "portraitImage"])}
                  disabled={isSaving}
                />
                <Field
                  label="Foto hero alt text"
                  value={draft.hero.portraitAlt}
                  onChange={(value) => setValue(["hero", "portraitAlt"], value)}
                />
                <TextField
                  label="Deskripsi"
                  value={draft.hero.description}
                  onChange={(value) => setValue(["hero", "description"], value)}
                />
                <Field
                  label="CTA utama label"
                  value={draft.hero.primaryCta.label}
                  onChange={(value) => setValue(["hero", "primaryCta", "label"], value)}
                />
                <Field
                  label="CTA utama href"
                  value={draft.hero.primaryCta.href}
                  onChange={(value) => setValue(["hero", "primaryCta", "href"], value)}
                />
                <Field
                  label="CTA kedua label"
                  value={draft.hero.secondaryCta.label}
                  onChange={(value) => setValue(["hero", "secondaryCta", "label"], value)}
                />
                <Field
                  label="CTA kedua href"
                  value={draft.hero.secondaryCta.href}
                  onChange={(value) => setValue(["hero", "secondaryCta", "href"], value)}
                />
              </div>
            </Panel>
          )}

          {activeSection === "about" && (
            <Panel title="About Section" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul" value={draft.about.title} onChange={(value) => setValue(["about", "title"], value)} />
                <Field label="Subtitle" value={draft.about.subtitle} onChange={(value) => setValue(["about", "subtitle"], value)} />
                <UploadField
                  label="Upload foto about"
                  helper="PNG, JPG, JPEG, atau WEBP. Setelah upload, klik Save."
                  previewUrl={draft.about.image}
                  onUpload={(file) => handleFileUpload(file, ["about", "image"])}
                  disabled={isSaving}
                />
                <Field label="Image alt" value={draft.about.imageAlt} onChange={(value) => setValue(["about", "imageAlt"], value)} />
                <Field label="Status label" value={draft.about.statusLabel} onChange={(value) => setValue(["about", "statusLabel"], value)} />
                <Field label="Resume label" value={draft.about.resumeLabel} onChange={(value) => setValue(["about", "resumeLabel"], value)} />
                <UploadField
                  label="Upload resume"
                  helper="PDF, DOC, atau DOCX. Setelah upload, klik Save."
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  previewUrl={draft.about.resumeUrl}
                  onUpload={(file) =>
                    handleFileUpload(
                      file,
                      [["about", "resumeUrl"], ["nav", "resumeUrl"]],
                      "Resume berhasil diupload. Klik Save untuk menyimpan perubahan ke website."
                    )
                  }
                  disabled={isSaving}
                />
              </div>

              <ArrayHeader title="Paragraf" onAdd={() => addArrayItem(["about", "paragraphs"], "Paragraf baru")} />
              <div className="space-y-4">
                {draft.about.paragraphs.map((paragraph, index) => (
                  <ItemBox key={index} onRemove={() => removeArrayItem(["about", "paragraphs"], index)}>
                    <TextField
                      label={`Paragraf ${index + 1}`}
                      value={paragraph}
                      onChange={(value) => setValue(["about", "paragraphs", index], value)}
                    />
                    <MoveControls
                      index={index}
                      length={draft.about.paragraphs.length}
                      onMove={(direction) => moveArrayItem(["about", "paragraphs"], index, direction)}
                    />
                  </ItemBox>
                ))}
              </div>

              <ArrayHeader title="Detail profile" onAdd={() => addArrayItem(["about", "details"], { label: "Label", value: "Value" })} />
              <div className="space-y-4">
                {draft.about.details.map((detail, index) => (
                  <ItemBox key={`${detail.label}-${index}`} onRemove={() => removeArrayItem(["about", "details"], index)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Label" value={detail.label} onChange={(value) => setValue(["about", "details", index, "label"], value)} />
                      <Field label="Value" value={detail.value} onChange={(value) => setValue(["about", "details", index, "value"], value)} />
                    </div>
                    <MoveControls
                      index={index}
                      length={draft.about.details.length}
                      onMove={(direction) => moveArrayItem(["about", "details"], index, direction)}
                    />
                  </ItemBox>
                ))}
              </div>
            </Panel>
          )}

          {activeSection === "skills" && (
            <Panel title="Skills Section" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul" value={draft.skills.title} onChange={(value) => setValue(["skills", "title"], value)} />
                <Field label="Subtitle" value={draft.skills.subtitle} onChange={(value) => setValue(["skills", "subtitle"], value)} />
              </div>

              <ArrayHeader title="Skill items" onAdd={() => addArrayItem(["skills", "items"], { name: "New Skill", level: 50 })} />
              <div className="space-y-4">
                {draft.skills.items.map((skill, index) => (
                  <ItemBox key={`${skill.name}-${index}`} onRemove={() => removeArrayItem(["skills", "items"], index)}>
                    <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                      <Field label="Nama skill" value={skill.name} onChange={(value) => setValue(["skills", "items", index, "name"], value)} />
                      <Field
                        label="Level"
                        value={skill.level}
                        type="number"
                        min={0}
                        max={100}
                        onChange={(value) => setValue(["skills", "items", index, "level"], clampLevel(value))}
                      />
                    </div>
                    <MoveControls
                      index={index}
                      length={draft.skills.items.length}
                      onMove={(direction) => moveArrayItem(["skills", "items"], index, direction)}
                    />
                  </ItemBox>
                ))}
              </div>
            </Panel>
          )}

          {activeSection === "projects" && (
            <Panel title="Projects Section" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul" value={draft.projects.title} onChange={(value) => setValue(["projects", "title"], value)} />
                <Field label="Subtitle" value={draft.projects.subtitle} onChange={(value) => setValue(["projects", "subtitle"], value)} />
              </div>

              <ArrayHeader
                title="Project items"
                onAdd={() =>
                  addArrayItem(["projects", "items"], {
                    title: "New Project",
                    description: "Project description",
                    tags: ["Next.js"],
                    image: "/placeholder.svg?height=400&width=600",
                    demoUrl: "",
                    repoUrl: "https://github.com",
                  })
                }
              />
              <div className="space-y-4">
                {draft.projects.items.map((project, index) => (
                  <ItemBox key={`${project.title}-${index}`} onRemove={() => removeArrayItem(["projects", "items"], index)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title" value={project.title} onChange={(value) => setValue(["projects", "items", index, "title"], value)} />
                      <UploadField
                        label="Upload gambar project"
                        helper="PNG, JPG, JPEG, atau WEBP. Setelah upload, klik Save."
                        previewUrl={project.image}
                        onUpload={(file) => handleFileUpload(file, ["projects", "items", index, "image"])}
                        disabled={isSaving}
                      />
                      <Field label="Demo URL / link milik sendiri" value={project.demoUrl} onChange={(value) => setValue(["projects", "items", index, "demoUrl"], value)} placeholder="https://domain-kamu.com" />
                      <Field label="Repo URL" value={project.repoUrl} onChange={(value) => setValue(["projects", "items", index, "repoUrl"], value)} />
                      <Field
                        label="Tags, pisahkan dengan koma"
                        value={project.tags.join(", ")}
                        onChange={(value) => setValue(["projects", "items", index, "tags"], parseTags(value))}
                      />
                      <TextField
                        label="Description"
                        value={project.description}
                        onChange={(value) => setValue(["projects", "items", index, "description"], value)}
                      />
                    </div>
                    <MoveControls
                      index={index}
                      length={draft.projects.items.length}
                      onMove={(direction) => moveArrayItem(["projects", "items"], index, direction)}
                    />
                  </ItemBox>
                ))}
              </div>
            </Panel>
          )}

          {activeSection === "experience" && (
            <Panel title="Experience Section" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul" value={draft.experience.title} onChange={(value) => setValue(["experience", "title"], value)} />
                <Field label="Subtitle" value={draft.experience.subtitle} onChange={(value) => setValue(["experience", "subtitle"], value)} />
              </div>

              <ArrayHeader
                title="Experience items"
                onAdd={() =>
                  addArrayItem(["experience", "items"], {
                    title: "New Role",
                    company: "Company",
                    period: "2026 - Present",
                    description: "Experience description",
                  })
                }
              />
              <div className="space-y-4">
                {draft.experience.items.map((experience, index) => (
                  <ItemBox key={`${experience.title}-${index}`} onRemove={() => removeArrayItem(["experience", "items"], index)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Title"
                        value={experience.title}
                        onChange={(value) => setValue(["experience", "items", index, "title"], value)}
                      />
                      <Field
                        label="Company"
                        value={experience.company}
                        onChange={(value) => setValue(["experience", "items", index, "company"], value)}
                      />
                      <Field
                        label="Period"
                        value={experience.period}
                        onChange={(value) => setValue(["experience", "items", index, "period"], value)}
                      />
                      <TextField
                        label="Description"
                        value={experience.description}
                        onChange={(value) => setValue(["experience", "items", index, "description"], value)}
                      />
                    </div>
                    <MoveControls
                      index={index}
                      length={draft.experience.items.length}
                      onMove={(direction) => moveArrayItem(["experience", "items"], index, direction)}
                    />
                  </ItemBox>
                ))}
              </div>
            </Panel>
          )}

          {activeSection === "contact" && (
            <Panel title="Contact Section" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul" value={draft.contact.title} onChange={(value) => setValue(["contact", "title"], value)} />
                <Field label="Subtitle" value={draft.contact.subtitle} onChange={(value) => setValue(["contact", "subtitle"], value)} />
                <Field
                  label="Information title"
                  value={draft.contact.informationTitle}
                  onChange={(value) => setValue(["contact", "informationTitle"], value)}
                />
                <Field
                  label="Current status title"
                  value={draft.contact.currentStatusTitle}
                  onChange={(value) => setValue(["contact", "currentStatusTitle"], value)}
                />
                <TextField
                  label="Current status"
                  value={draft.contact.currentStatus}
                  onChange={(value) => setValue(["contact", "currentStatus"], value)}
                />
              </div>

              <h3 className="mt-8 text-lg font-semibold">Form contact</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Form title" value={draft.contact.form.title} onChange={(value) => setValue(["contact", "form", "title"], value)} />
                <Field
                  label="Name placeholder"
                  value={draft.contact.form.namePlaceholder}
                  onChange={(value) => setValue(["contact", "form", "namePlaceholder"], value)}
                />
                <Field
                  label="Email placeholder"
                  value={draft.contact.form.emailPlaceholder}
                  onChange={(value) => setValue(["contact", "form", "emailPlaceholder"], value)}
                />
                <Field
                  label="Subject placeholder"
                  value={draft.contact.form.subjectPlaceholder}
                  onChange={(value) => setValue(["contact", "form", "subjectPlaceholder"], value)}
                />
                <Field
                  label="Message placeholder"
                  value={draft.contact.form.messagePlaceholder}
                  onChange={(value) => setValue(["contact", "form", "messagePlaceholder"], value)}
                />
                <Field
                  label="Submit label"
                  value={draft.contact.form.submitLabel}
                  onChange={(value) => setValue(["contact", "form", "submitLabel"], value)}
                />
                <Field
                  label="Submitting label"
                  value={draft.contact.form.submittingLabel}
                  onChange={(value) => setValue(["contact", "form", "submittingLabel"], value)}
                />
                <Field
                  label="Toast title"
                  value={draft.contact.form.toastTitle}
                  onChange={(value) => setValue(["contact", "form", "toastTitle"], value)}
                />
                <TextField
                  label="Toast description"
                  value={draft.contact.form.toastDescription}
                  onChange={(value) => setValue(["contact", "form", "toastDescription"], value)}
                />
              </div>
            </Panel>
          )}

          {activeSection === "messages" && (
            <Panel title="Pesan Masuk" icon={<Inbox className="h-5 w-5" />}>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-kv-sand">Data dari form contact website utama.</p>
                <Button
                  className="bg-kv-blue text-kv-cream hover:bg-kv-rust"
                  onClick={fetchContactMessages}
                  disabled={isLoadingMessages}
                  type="button"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isLoadingMessages ? "Memuat..." : "Refresh"}
                </Button>
              </div>

              {messagesError && (
                <div className="mb-4 rounded-md border border-kv-rust/40 bg-kv-rust/15 px-4 py-3 text-sm text-kv-cream">
                  {messagesError}
                </div>
              )}

              {isLoadingMessages ? (
                <p className="text-sm text-kv-sand">Memuat pesan...</p>
              ) : contactMessages.length === 0 ? (
                <p className="text-sm text-kv-sand">Belum ada pesan masuk.</p>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <div key={message.id} className="rounded-md border border-kv-sky/15 bg-kv-blue/20 p-4">
                      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-kv-cream">{message.subject}</h3>
                          <p className="text-sm text-kv-sand">
                            {message.name} | {message.email}
                          </p>
                        </div>
                        <time className="text-xs text-kv-sky/70">{formatMessageDate(message.created_at)}</time>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-kv-cream/85">{message.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
          {activeSection === "footer" && (
            <Panel title="Footer" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Owner" value={draft.footer.owner} onChange={(value) => setValue(["footer", "owner"], value)} />
                <Field label="Rights text" value={draft.footer.rightsText} onChange={(value) => setValue(["footer", "rightsText"], value)} />
              </div>
            </Panel>
          )}

          {activeSection === "json" && (
            <Panel title="Raw JSON" icon={<Code2 className="h-5 w-5" />}>
              <Textarea
                value={jsonDraft}
                onChange={(event) => {
                  setJsonDraft(event.target.value)
                  setIsDirty(true)
                }}
                className="min-h-[620px] border-kv-sky/25 bg-kv-navy/60 font-mono text-sm text-kv-cream"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="bg-kv-blue text-kv-cream hover:bg-kv-rust" onClick={handleApplyJson}>
                  Terapkan JSON
                </Button>
                <Button
                  variant="outline"
                  className="border-kv-sky/40 text-kv-sand hover:bg-kv-blue hover:text-kv-cream"
                  onClick={() => {
                    const nextContent = cloneSiteContent(DEFAULT_SITE_CONTENT)
                    setJsonDraft(JSON.stringify(nextContent, null, 2))
                    commitDraft(nextContent)
                  }}
                >
                  Pakai Default JSON
                </Button>
              </div>
            </Panel>
          )}
        </section>
      </div>
    </main>
  )
}

type FieldPath = Array<string | number>

function getAtPath<T>(target: unknown, path: FieldPath): T {
  let cursor = target as Record<string | number, unknown>

  for (const part of path) {
    cursor = cursor[part] as Record<string | number, unknown>
  }

  return cursor as T
}

function setAtPath(target: unknown, path: FieldPath, value: unknown) {
  let cursor = target as Record<string | number, unknown>

  for (const part of path.slice(0, -1)) {
    cursor = cursor[part] as Record<string | number, unknown>
  }

  cursor[path[path.length - 1]] = value
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function clampLevel(value: string) {
  const level = Number(value)

  if (Number.isNaN(level)) return 0
  return Math.max(0, Math.min(100, level))
}

function formatMessageDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-kv-sky/20 bg-kv-navy/55 p-5 shadow-xl shadow-kv-navy/20">
      <div className="mb-6 flex items-center gap-3 border-b border-kv-sky/15 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-kv-blue/70 text-kv-sand">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  min?: number
  max?: number
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-kv-sand">{label}</span>
      <Input
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        className="border-kv-sky/25 bg-kv-navy/60 text-kv-cream placeholder:text-kv-sand/50 focus-visible:ring-kv-sand"
      />
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-kv-sand">{label}</span>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 border-kv-sky/25 bg-kv-navy/60 text-kv-cream placeholder:text-kv-sand/50 focus-visible:ring-kv-sand"
      />
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium capitalize text-kv-sand">{label}</span>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 border-kv-sky/25 bg-kv-navy/60 p-1"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border-kv-sky/25 bg-kv-navy/60 font-mono text-kv-cream focus-visible:ring-kv-sand"
        />
      </div>
    </label>
  )
}

function UploadField({
  label,
  helper,
  previewUrl,
  accept = "image/png,image/jpeg,image/webp",
  onUpload,
  disabled,
}: {
  label: string
  helper: string
  previewUrl?: string
  accept?: string
  onUpload: (file: File) => void
  disabled?: boolean
}) {
  const showsImagePreview = previewUrl ? /\.(png|jpe?g|webp)(\?.*)?$/i.test(previewUrl) : false

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-kv-sand">{label}</span>
      {previewUrl && (
        <div className="overflow-hidden rounded-md border border-kv-sky/20 bg-kv-blue/20">
          {showsImagePreview ? (
            <img src={previewUrl} alt={`${label} preview`} className="h-32 w-full object-cover" />
          ) : (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-kv-sand underline-offset-4 hover:text-kv-cream hover:underline">
              Lihat file saat ini
            </a>
          )}
        </div>
      )}
      <div className="flex min-h-10 items-center gap-3 rounded-md border border-kv-sky/25 bg-kv-navy/60 px-3 py-2 text-kv-cream">
        <Upload className="h-4 w-4 text-kv-sand" />
        <input
          type="file"
          accept={accept}
          disabled={disabled}
          className="w-full cursor-pointer text-sm file:mr-3 file:rounded-md file:border-0 file:bg-kv-sky file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-kv-navy hover:file:bg-kv-sand disabled:cursor-not-allowed disabled:opacity-60"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              onUpload(file)
              event.target.value = ""
            }
          }}
        />
      </div>
      <p className="text-xs text-kv-sky/70">{helper}</p>
    </label>
  )
}

function ArrayHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mb-4 mt-8 flex items-center justify-between gap-3 border-t border-kv-sky/15 pt-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button className="bg-kv-blue text-kv-cream hover:bg-kv-rust" onClick={onAdd} type="button">
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </div>
  )
}

function ItemBox({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <div className="rounded-md border border-kv-sky/15 bg-kv-blue/20 p-4">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-kv-sand hover:bg-kv-rust hover:text-kv-cream" onClick={onRemove} type="button">
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function MoveControls({
  index,
  length,
  onMove,
}: {
  index: number
  length: number
  onMove: (direction: -1 | 1) => void
}) {
  return (
    <div className="mt-4 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-kv-sky/30 text-kv-sand hover:bg-kv-blue hover:text-kv-cream"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        type="button"
      >
        Up
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-kv-sky/30 text-kv-sand hover:bg-kv-blue hover:text-kv-cream"
        onClick={() => onMove(1)}
        disabled={index === length - 1}
        type="button"
      >
        Down
      </Button>
    </div>
  )
}
