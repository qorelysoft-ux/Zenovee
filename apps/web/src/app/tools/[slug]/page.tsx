import { notFound } from 'next/navigation'

import { getToolBySlug } from '@/lib/toolsCatalog'
import { ToolGatePlaceholder } from '@/components/ToolGatePlaceholder'
import { PremiumToolWorkspace } from '@/components/tools/PremiumToolWorkspace'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: 'Tool not found — Zenovee' }
  return {
    title: `${tool.name} — Zenovee`,
    description: tool.description,
  }
}

export default async function ToolSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <ToolGatePlaceholder requiredCategory={tool.category}>
        <PremiumToolWorkspace tool={tool} />
      </ToolGatePlaceholder>
    </div>
  )
}
