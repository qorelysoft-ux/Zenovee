import type { ToolCategory } from './entitlements'

export type ToolDef = {
  slug: string
  name: string
  category: ToolCategory
  description: string
  availability?: 'available' | 'upcoming'
  availabilityNote?: string
}

const UPCOMING_NOTE = 'Upcoming in 20–30 days while paid billing goes live.'

export const categoryPages = [
  { slug: 'marketing', name: 'AI Marketing Engine', category: 'MARKETING' as const },
  { slug: 'dev-assistant', name: 'AI Developer Assistant', category: 'DEV_ASSISTANT' as const },
  { slug: 'ecom-image', name: 'E-commerce Image Engine', category: 'ECOM_IMAGE' as const },
  { slug: 'seo-growth', name: 'SEO Growth Engine', category: 'SEO_GROWTH' as const },
  {
    slug: 'business-automation',
    name: 'Business Automation Toolkit',
    category: 'BUSINESS_AUTOMATION' as const,
  },
] as const

export const toolsCatalog: ToolDef[] = [
  { slug: 'viral-short-creator-engine', name: 'Viral Short Creator Engine', category: 'MARKETING', description: 'Turn long-form content into high-retention short video scripts with hooks, beats, and CTA structure.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'cold-outreach-personalization-engine', name: 'Cold Outreach Personalization Engine', category: 'MARKETING', description: 'Generate personalized outreach openers and angles from pasted prospect or company context.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'seo-authority-builder-engine', name: 'SEO Authority Builder Engine', category: 'MARKETING', description: 'Create long-form authority articles with keyword clusters, sections, and internal-link suggestions.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'ad-copy-conversion-engine', name: 'Ad Copy Conversion Engine', category: 'MARKETING', description: 'Generate multiple high-converting ad variants for Meta and Google from one offer brief.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'ecommerce-conversion-booster', name: 'E-commerce Conversion Booster', category: 'MARKETING', description: 'Rewrite product listings to improve clarity, desire, and purchase intent.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'lead-magnet-creator-engine', name: 'Lead Magnet Creator Engine', category: 'MARKETING', description: 'Convert blog or notes into downloadable lead magnet outlines, sections, and CTA assets.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'social-thread-growth-engine', name: 'Social Thread Growth Engine', category: 'MARKETING', description: 'Transform raw ideas into viral-style X/Twitter threads with hooks and flow.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'customer-persona-intelligence-engine', name: 'Customer Persona Intelligence Engine', category: 'MARKETING', description: 'Turn business notes into ICP, pain points, buying triggers, and positioning insights.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'landing-page-conversion-writer', name: 'Landing Page Conversion Writer', category: 'MARKETING', description: 'Generate a conversion-focused landing page structure, headlines, proof, and CTAs.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'brand-voice-replication-engine', name: 'Brand Voice Replication Engine', category: 'MARKETING', description: 'Learn a brand voice from pasted samples and produce reusable tone rules plus matching content.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },

  { slug: 'code-documentation-generator', name: 'Code Documentation Generator', category: 'DEV_ASSISTANT', description: 'Generate README and technical documentation from pasted code, folder notes, or architecture context.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'sql-performance-optimizer', name: 'SQL Performance Optimizer', category: 'DEV_ASSISTANT', description: 'Analyze slow SQL and produce optimized rewrites with performance reasoning.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'api-schema-converter', name: 'API Schema Converter', category: 'DEV_ASSISTANT', description: 'Convert raw JSON payloads into TypeScript interfaces and typed models.' },
  { slug: 'security-vulnerability-scanner', name: 'Security Vulnerability Scanner', category: 'DEV_ASSISTANT', description: 'Check a URL for missing security headers and common web security configuration issues.' },
  { slug: 'smart-regex-builder', name: 'Smart Regex Builder', category: 'DEV_ASSISTANT', description: 'Generate practical regex patterns from plain English requirements.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'database-visual-mapper', name: 'Database Visual Mapper', category: 'DEV_ASSISTANT', description: 'Transform schema definitions into readable table relationships and visual mapping output.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'cron-schedule-translator', name: 'Cron Schedule Translator', category: 'DEV_ASSISTANT', description: 'Explain cron expressions in plain English and generate cron from human schedules.' },
  { slug: 'environment-config-generator', name: 'Environment Config Generator', category: 'DEV_ASSISTANT', description: 'Create secure .env templates for common frameworks and deployment setups.' },
  { slug: 'git-error-fix-assistant', name: 'Git Error Fix Assistant', category: 'DEV_ASSISTANT', description: 'Explain git errors and provide exact commands to resolve them safely.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'api-request-converter', name: 'API Request Converter', category: 'DEV_ASSISTANT', description: 'Convert API request details into cURL and developer-friendly request formats.' },

  { slug: 'bulk-background-removal-engine', name: 'Bulk Background Removal Engine', category: 'ECOM_IMAGE', description: 'Remove product-image backgrounds in bulk-ready workflows for e-commerce teams.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'ai-image-upscaler-pro', name: 'AI Image Upscaler Pro', category: 'ECOM_IMAGE', description: 'Enhance low-quality product visuals into sharper, marketplace-ready images.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'multi-platform-image-resizer', name: 'Multi-Platform Image Resizer', category: 'ECOM_IMAGE', description: 'Resize once and export platform-specific dimensions for store, ads, and social.' },
  { slug: 'product-mockup-generator', name: 'Product Mockup Generator', category: 'ECOM_IMAGE', description: 'Generate realistic mockup-ready product presentation concepts from your asset details.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'bulk-watermark-protection-tool', name: 'Bulk Watermark Protection Tool', category: 'ECOM_IMAGE', description: 'Apply consistent watermark settings across multiple brand assets.' },
  { slug: 'screenshot-cleaner-pro', name: 'Screenshot Cleaner Pro', category: 'ECOM_IMAGE', description: 'Clean screenshots for professional sharing by removing clutter and improving presentation.' },
  { slug: 'svg-conversion-engine', name: 'SVG Conversion Engine', category: 'ECOM_IMAGE', description: 'Prepare vector assets for multiple output scenarios and delivery formats.' },
  { slug: 'ai-alt-text-generator', name: 'AI Alt Text Generator', category: 'ECOM_IMAGE', description: 'Create SEO-friendly, accessible alt text for many images at scale.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'brand-color-kit-generator', name: 'Brand Color Kit Generator', category: 'ECOM_IMAGE', description: 'Build a practical brand color kit and usage guidance from existing logo colors.' },
  { slug: 'product-photo-enhancer', name: 'Product Photo Enhancer', category: 'ECOM_IMAGE', description: 'Improve product photo presentation with enhancement suggestions and workflow output.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },

  { slug: 'keyword-cluster-engine', name: 'Keyword Cluster Engine', category: 'SEO_GROWTH', description: 'Group large keyword lists into topic clusters for content planning.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'schema-markup-generator', name: 'Schema Markup Generator', category: 'SEO_GROWTH', description: 'Create production-ready JSON-LD schema markup for rich search visibility.' },
  { slug: 'website-error-scanner', name: 'Website Error Scanner', category: 'SEO_GROWTH', description: 'Audit website pages for broken links, redirect issues, and crawl blockers.' },
  { slug: 'competitor-gap-analyzer', name: 'Competitor Gap Analyzer', category: 'SEO_GROWTH', description: 'Compare your pages and competitor notes to identify missing content opportunities.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'bulk-meta-optimizer', name: 'Bulk Meta Optimizer', category: 'SEO_GROWTH', description: 'Generate SEO titles and descriptions for many pages in one workflow.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'internal-linking-engine', name: 'Internal Linking Engine', category: 'SEO_GROWTH', description: 'Suggest smart internal-link opportunities from pasted pages or content summaries.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'core-web-vitals-auditor', name: 'Core Web Vitals Auditor', category: 'SEO_GROWTH', description: 'Explain performance issues and provide concrete Core Web Vitals fixes.' },
  { slug: 'sitemap-health-analyzer', name: 'Sitemap Health Analyzer', category: 'SEO_GROWTH', description: 'Validate sitemap completeness, indexing intent, and crawlability patterns.' },
  { slug: 'backlink-quality-checker', name: 'Backlink Quality Checker', category: 'SEO_GROWTH', description: 'Evaluate backlink quality from pasted domain lists and flag risky links.' },
  { slug: 'search-console-insights-simplifier', name: 'Search Console Insights Simplifier', category: 'SEO_GROWTH', description: 'Turn raw Search Console exports into clear action items for growth.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },

  { slug: 'meeting-notes-to-email-converter', name: 'Meeting Notes to Email Converter', category: 'BUSINESS_AUTOMATION', description: 'Convert raw notes into clean client or team follow-up emails with actions and deadlines.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'receipt-data-extractor', name: 'Receipt Data Extractor', category: 'BUSINESS_AUTOMATION', description: 'Extract structured receipt or invoice fields from pasted text or OCR output.' },
  { slug: 'pdf-to-markdown-converter', name: 'PDF to Markdown Converter', category: 'BUSINESS_AUTOMATION', description: 'Transform pasted PDF text into clean markdown for documentation workflows.' },
  { slug: 'legal-policy-generator', name: 'Legal Policy Generator', category: 'BUSINESS_AUTOMATION', description: 'Draft baseline privacy policy and terms content from business details.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'dynamic-qr-code-system', name: 'Dynamic QR Code System', category: 'BUSINESS_AUTOMATION', description: 'Create QR workflows with editable destination planning and campaign tracking structure.' },
  { slug: 'smart-unit-currency-converter', name: 'Smart Unit & Currency Converter', category: 'BUSINESS_AUTOMATION', description: 'Handle business-friendly unit and currency conversions for global operations.' },
  { slug: 'employee-onboarding-builder', name: 'Employee Onboarding Builder', category: 'BUSINESS_AUTOMATION', description: 'Generate structured onboarding plans, documents, and first-week workflows.', availability: 'upcoming', availabilityNote: UPCOMING_NOTE },
  { slug: 'secure-vault-manager', name: 'Secure Vault Manager', category: 'BUSINESS_AUTOMATION', description: 'Organize secure credential-sharing workflows and sensitive note templates.' },
  { slug: 'global-time-sync-tool', name: 'Global Time Sync Tool', category: 'BUSINESS_AUTOMATION', description: 'Plan meetings and coordination windows across distributed teams and time zones.' },
  { slug: 'giveaway-winner-selector', name: 'Giveaway Winner Selector', category: 'BUSINESS_AUTOMATION', description: 'Run transparent winner-selection workflows for campaigns and promotions.' },
]

export function getToolBySlug(slug: string): ToolDef | undefined {
  return toolsCatalog.find((t) => t.slug === slug)
}

export function isToolUpcoming(tool: ToolDef) {
  return tool.availability === 'upcoming'
}
