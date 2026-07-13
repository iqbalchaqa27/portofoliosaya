import { PortfolioPage } from "@/components/portfolio-page"
import { readSiteContent } from "@/lib/site-content-server"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default async function Portfolio() {
  const content = await readSiteContent()

  return <PortfolioPage initialContent={content} />
}