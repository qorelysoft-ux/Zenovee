import Link from 'next/link'
import type { CSSProperties } from 'react'

type ShowcaseCard = {
  name: string
  description: string
  icon: string
  href: string
}

type ShowcaseSection = {
  title: string
  cards: ShowcaseCard[]
  speedSeconds?: number
  mobileSpeedSeconds?: number
}

const showcaseSections: ShowcaseSection[] = [
  {
    title: 'AI Marketing Tools',
    speedSeconds: 56,
    cards: [
      {
        name: 'Ad Copy Conversion Engine',
        description: 'Generate conversion-focused ads for every funnel stage.',
        icon: '📣',
        href: '/tools/marketing',
      },
      {
        name: 'Cold Outreach Personalizer',
        description: 'Craft highly personalized outbound messages instantly.',
        icon: '✉️',
        href: '/tools/marketing',
      },
      {
        name: 'Landing Page Writer',
        description: 'Build persuasive landing page copy in minutes.',
        icon: '🧲',
        href: '/tools/marketing',
      },
      {
        name: 'Lead Magnet Creator',
        description: 'Turn ideas into premium lead magnets with AI.',
        icon: '🎯',
        href: '/tools/marketing',
      },
      {
        name: 'Social Thread Growth',
        description: 'Create viral threads tuned for engagement.',
        icon: '🧵',
        href: '/tools/marketing',
      },
      {
        name: 'Brand Voice Replicator',
        description: 'Keep messaging consistent across channels.',
        icon: '🎙️',
        href: '/tools/marketing',
      },
    ],
  },
  {
    title: 'Developer Tools',
    speedSeconds: 62,
    cards: [
      {
        name: 'Smart Regex Builder',
        description: 'Generate and validate regex without guesswork.',
        icon: '🧠',
        href: '/tools/dev-assistant',
      },
      {
        name: 'Git Error Fix Assistant',
        description: 'Diagnose git issues and get clean fixes fast.',
        icon: '🛠️',
        href: '/tools/dev-assistant',
      },
      {
        name: 'Code Doc Generator',
        description: 'Auto-write maintainable docs from code context.',
        icon: '📘',
        href: '/tools/dev-assistant',
      },
      {
        name: 'SQL Performance Optimizer',
        description: 'Refine heavy queries for speed and efficiency.',
        icon: '⚡',
        href: '/tools/dev-assistant',
      },
      {
        name: 'API Schema Converter',
        description: 'Translate API schemas across formats quickly.',
        icon: '🔄',
        href: '/tools/dev-assistant',
      },
      {
        name: 'Security Scanner',
        description: 'Find vulnerabilities before they hit production.',
        icon: '🔒',
        href: '/tools/dev-assistant',
      },
    ],
  },
  {
    title: 'Image Tools',
    speedSeconds: 68,
    cards: [
      {
        name: 'AI Image Upscaler Pro',
        description: 'Upscale visuals while preserving sharp details.',
        icon: '🖼️',
        href: '/tools/ecom-image',
      },
      {
        name: 'Background Removal Engine',
        description: 'Erase backgrounds in bulk with clean cutouts.',
        icon: '✂️',
        href: '/tools/ecom-image',
      },
      {
        name: 'Multi Platform Resizer',
        description: 'One image, all formats for every channel.',
        icon: '📐',
        href: '/tools/ecom-image',
      },
      {
        name: 'Product Photo Enhancer',
        description: 'Boost clarity, lighting, and premium look instantly.',
        icon: '✨',
        href: '/tools/ecom-image',
      },
      {
        name: 'Screenshot Cleaner Pro',
        description: 'Polish screenshots for launch-ready presentations.',
        icon: '🧽',
        href: '/tools/ecom-image',
      },
      {
        name: 'SVG Conversion Engine',
        description: 'Convert assets into scalable SVG outputs.',
        icon: '🧩',
        href: '/tools/ecom-image',
      },
    ],
  },
  {
    title: 'SEO Tools',
    speedSeconds: 74,
    cards: [
      {
        name: 'Keyword Cluster Engine',
        description: 'Build topic clusters that map to ranking intent.',
        icon: '🔍',
        href: '/tools/seo-growth',
      },
      {
        name: 'Schema Markup Generator',
        description: 'Create rich-result-ready schema in seconds.',
        icon: '🧬',
        href: '/tools/seo-growth',
      },
      {
        name: 'Bulk Meta Optimizer',
        description: 'Optimize titles and descriptions at scale.',
        icon: '📝',
        href: '/tools/seo-growth',
      },
      {
        name: 'Internal Linking Engine',
        description: 'Auto-plan strategic internal link structures.',
        icon: '🔗',
        href: '/tools/seo-growth',
      },
      {
        name: 'Core Web Vitals Auditor',
        description: 'Improve speed signals for stronger rankings.',
        icon: '🚀',
        href: '/tools/seo-growth',
      },
      {
        name: 'Backlink Quality Checker',
        description: 'Audit backlink profile quality with AI insights.',
        icon: '📊',
        href: '/tools/seo-growth',
      },
    ],
  },
]

function ShowcaseMarqueeRow({
  title,
  cards,
  speedSeconds = 60,
  mobileSpeedSeconds,
}: ShowcaseSection) {
  if (!cards.length) return null

  const rowStyle = {
    '--row-duration': `${speedSeconds}s`,
    '--row-duration-mobile': `${mobileSpeedSeconds ?? Math.round(speedSeconds * 1.2)}s`,
  } as CSSProperties

  const renderCards = (instance: string) =>
    cards.map((card) => (
      <Link
        key={`${instance}-${card.name}`}
        href={card.href}
        className="tools-showcase-card"
        aria-label={card.name}
      >
        <span className="tools-showcase-card-icon" aria-hidden="true">
          {card.icon}
        </span>
        <div className="min-w-0">
          <h4 className="tools-showcase-card-title">{card.name}</h4>
          <p className="tools-showcase-card-copy">{card.description}</p>
        </div>
      </Link>
    ))

  return (
    <div className="tools-showcase-row">
      <h3 className="tools-showcase-row-title">{title}</h3>

      <div className="tools-showcase-marquee">
        <div className="tools-showcase-row-track" style={rowStyle}>
          <div className="tools-showcase-row-group">{renderCards('group-a')}</div>
          <div className="tools-showcase-row-group" aria-hidden="true">
            {renderCards('group-b')}
          </div>
        </div>

        <div className="tools-showcase-edge tools-showcase-edge-left" aria-hidden="true" />
        <div className="tools-showcase-edge tools-showcase-edge-right" aria-hidden="true" />
      </div>
    </div>
  )
}

export function ToolsMarquee({ sections = showcaseSections }: { sections?: ShowcaseSection[] }) {
  if (!sections.length) return null

  return (
    <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Live Tool Streams</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Explore dynamic AI stacks moving in real time across every growth category.
          </p>
        </div>

        <div className="tools-showcase-stack">
          {sections.map((section) => (
            <ShowcaseMarqueeRow key={section.title} {...section} />
          ))}
          {renderCards('group-b')}
        </div>
    </section>
    </div>
  )
}