import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getToolBySlug } from '@/lib/toolsCatalog'
import { ToolGatePlaceholder } from '@/components/ToolGatePlaceholder'
import { ColdOutreachPersonalizationTool } from '@/components/tools/ColdOutreachPersonalizationTool'
import { SeoAuthorityBuilderTool } from '@/components/tools/SeoAuthorityBuilderTool'
import { ViralShortCreatorTool } from '@/components/tools/ViralShortCreatorTool'

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug)
  if (!tool) return { title: 'Tool not found — Zenovee' }
  return {
    title: `${tool.name} — Zenovee`,
    description: tool.description,
  }
}

export default function ToolSeoPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug)

  if (!tool) return notFound()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">{tool.name}</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">{tool.description}</p>

      <div className="mt-10">
        <ToolGatePlaceholder
          requiredCategory={tool.category}
          onUnlock={() => {
            // best-effort analytics: record a run once the user has access
            fetch('/api/tool-runs', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ toolSlug: tool.slug }),
            }).catch(() => null)
          }}
        >
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            {tool.slug === 'viral-short-creator-engine' ? (
              <ViralShortCreatorTool />
            ) : tool.slug === 'cold-outreach-personalization-engine' ? (
              <ColdOutreachPersonalizationTool />
            ) : tool.slug === 'seo-authority-builder-engine' ? (
              <SeoAuthorityBuilderTool />
            ) : (
              <>
                <div className="text-sm font-medium">Tool interface</div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  This premium tool page is wired into the paid-access system. Its full tool-specific workflow will be implemented next.
                </p>
              </>
            )}
          </div>
        </ToolGatePlaceholder>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold">How it works</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {tool.name} is part of the {tool.category} category and requires an active subscription for access.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Use cases</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Save time on repetitive tasks</li>
            <li>Improve accuracy and consistency</li>
            <li>Work faster from any device</li>
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Why is it locked?</span> This tool is part of
            a paid category.
          </p>
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">How do I get access?</span> Subscribe to the
            category on the Pricing page.
          </p>
        </div>
      </section>
    </div>
  )
}
