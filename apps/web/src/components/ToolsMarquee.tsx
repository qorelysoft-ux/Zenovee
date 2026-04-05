import Link from 'next/link'
import type { CSSProperties } from 'react'

type MarqueeTool = {
  slug: string
  name: string
  description: string
  category?: string
}

export function ToolsMarquee({ tools, speedSeconds = 32 }: { tools: MarqueeTool[]; speedSeconds?: number }) {
  if (!tools.length) return null

  const marqueeStyle = { '--marquee-duration': `${speedSeconds}s` } as CSSProperties

  const renderCards = (instance: string) =>
    tools.map((tool) => (
      <Link
        key={`${instance}-${tool.slug}`}
        href={`/tools/${tool.slug}`}
        className="tools-marquee-card group"
        aria-label={tool.name}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-white transition-colors group-hover:text-violet-300">
            {tool.name}
          </h3>
          {tool.category && (
            <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-300">
              {tool.category.replaceAll('_', ' ')}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-slate-300">{tool.description}</p>
      </Link>
    ))

  return (
    <div className="tools-marquee" style={marqueeStyle}>
      <div className="tools-marquee-track">
        <div className="tools-marquee-group">{renderCards('group-a')}</div>
        <div className="tools-marquee-group" aria-hidden="true">
          {renderCards('group-b')}
        </div>
      </div>
    </div>
  )
}