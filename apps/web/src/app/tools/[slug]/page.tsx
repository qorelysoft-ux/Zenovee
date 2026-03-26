import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getToolBySlug } from '@/lib/toolsCatalog'
import { ToolGatePlaceholder } from '@/components/ToolGatePlaceholder'
import { ColdOutreachPersonalizationTool } from '@/components/tools/ColdOutreachPersonalizationTool'
import { AdCopyConversionTool } from '@/components/tools/AdCopyConversionTool'
import { AiAltTextGeneratorTool } from '@/components/tools/AiAltTextGeneratorTool'
import { ApiRequestConverterTool } from '@/components/tools/ApiRequestConverterTool'
import { ApiSchemaConverterTool } from '@/components/tools/ApiSchemaConverterTool'
import { BrandVoiceReplicationTool } from '@/components/tools/BrandVoiceReplicationTool'
import { BrandColorKitGeneratorTool } from '@/components/tools/BrandColorKitGeneratorTool'
import { BulkWatermarkProtectionTool } from '@/components/tools/BulkWatermarkProtectionTool'
import { BacklinkQualityCheckerTool } from '@/components/tools/BacklinkQualityCheckerTool'
import { CodeDocumentationGeneratorTool } from '@/components/tools/CodeDocumentationGeneratorTool'
import { CompetitorGapAnalyzerTool } from '@/components/tools/CompetitorGapAnalyzerTool'
import { CronScheduleTranslatorTool } from '@/components/tools/CronScheduleTranslatorTool'
import { CoreWebVitalsAuditorTool } from '@/components/tools/CoreWebVitalsAuditorTool'
import { CustomerPersonaIntelligenceTool } from '@/components/tools/CustomerPersonaIntelligenceTool'
import { DatabaseVisualMapperTool } from '@/components/tools/DatabaseVisualMapperTool'
import { DynamicQrCodeSystemTool } from '@/components/tools/DynamicQrCodeSystemTool'
import { EcommerceConversionBoosterTool } from '@/components/tools/EcommerceConversionBoosterTool'
import { EnvironmentConfigGeneratorTool } from '@/components/tools/EnvironmentConfigGeneratorTool'
import { GitErrorFixAssistantTool } from '@/components/tools/GitErrorFixAssistantTool'
import { GiveawayWinnerSelectorTool } from '@/components/tools/GiveawayWinnerSelectorTool'
import { GlobalTimeSyncTool } from '@/components/tools/GlobalTimeSyncTool'
import { KeywordClusterEngineTool } from '@/components/tools/KeywordClusterEngineTool'
import { LandingPageConversionWriterTool } from '@/components/tools/LandingPageConversionWriterTool'
import { LeadMagnetCreatorTool } from '@/components/tools/LeadMagnetCreatorTool'
import { LegalPolicyGeneratorTool } from '@/components/tools/LegalPolicyGeneratorTool'
import { MultiPlatformImageResizerTool } from '@/components/tools/MultiPlatformImageResizerTool'
import { PdfToMarkdownConverterTool } from '@/components/tools/PdfToMarkdownConverterTool'
import { ProductPhotoEnhancerTool } from '@/components/tools/ProductPhotoEnhancerTool'
import { SchemaMarkupGeneratorTool } from '@/components/tools/SchemaMarkupGeneratorTool'
import { SearchConsoleInsightsSimplifierTool } from '@/components/tools/SearchConsoleInsightsSimplifierTool'
import { ScreenshotCleanerProTool } from '@/components/tools/ScreenshotCleanerProTool'
import { BulkMetaOptimizerTool } from '@/components/tools/BulkMetaOptimizerTool'
import { SitemapHealthAnalyzerTool } from '@/components/tools/SitemapHealthAnalyzerTool'
import { InternalLinkingEngineTool } from '@/components/tools/InternalLinkingEngineTool'
import { SecurityVulnerabilityScannerTool } from '@/components/tools/SecurityVulnerabilityScannerTool'
import { SeoAuthorityBuilderTool } from '@/components/tools/SeoAuthorityBuilderTool'
import { SqlPerformanceOptimizerTool } from '@/components/tools/SqlPerformanceOptimizerTool'
import { SmartRegexBuilderTool } from '@/components/tools/SmartRegexBuilderTool'
import { SmartUnitCurrencyConverterTool } from '@/components/tools/SmartUnitCurrencyConverterTool'
import { SocialThreadGrowthTool } from '@/components/tools/SocialThreadGrowthTool'
import { SvgConversionEngineTool } from '@/components/tools/SvgConversionEngineTool'
import { ViralShortCreatorTool } from '@/components/tools/ViralShortCreatorTool'
import { WebsiteErrorScannerTool } from '@/components/tools/WebsiteErrorScannerTool'

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
            ) : tool.slug === 'ad-copy-conversion-engine' ? (
              <AdCopyConversionTool />
            ) : tool.slug === 'ecommerce-conversion-booster' ? (
              <EcommerceConversionBoosterTool />
            ) : tool.slug === 'multi-platform-image-resizer' ? (
              <MultiPlatformImageResizerTool />
            ) : tool.slug === 'bulk-watermark-protection-tool' ? (
              <BulkWatermarkProtectionTool />
            ) : tool.slug === 'svg-conversion-engine' ? (
              <SvgConversionEngineTool />
            ) : tool.slug === 'ai-alt-text-generator' ? (
              <AiAltTextGeneratorTool />
            ) : tool.slug === 'brand-color-kit-generator' ? (
              <BrandColorKitGeneratorTool />
            ) : tool.slug === 'product-photo-enhancer' ? (
              <ProductPhotoEnhancerTool />
            ) : tool.slug === 'screenshot-cleaner-pro' ? (
              <ScreenshotCleanerProTool />
            ) : tool.slug === 'pdf-to-markdown-converter' ? (
              <PdfToMarkdownConverterTool />
            ) : tool.slug === 'legal-policy-generator' ? (
              <LegalPolicyGeneratorTool />
            ) : tool.slug === 'smart-unit-currency-converter' ? (
              <SmartUnitCurrencyConverterTool />
            ) : tool.slug === 'schema-markup-generator' ? (
              <SchemaMarkupGeneratorTool />
            ) : tool.slug === 'bulk-meta-optimizer' ? (
              <BulkMetaOptimizerTool />
            ) : tool.slug === 'internal-linking-engine' ? (
              <InternalLinkingEngineTool />
            ) : tool.slug === 'website-error-scanner' ? (
              <WebsiteErrorScannerTool />
            ) : tool.slug === 'competitor-gap-analyzer' ? (
              <CompetitorGapAnalyzerTool />
            ) : tool.slug === 'core-web-vitals-auditor' ? (
              <CoreWebVitalsAuditorTool />
            ) : tool.slug === 'sitemap-health-analyzer' ? (
              <SitemapHealthAnalyzerTool />
            ) : tool.slug === 'backlink-quality-checker' ? (
              <BacklinkQualityCheckerTool />
            ) : tool.slug === 'search-console-insights-simplifier' ? (
              <SearchConsoleInsightsSimplifierTool />
            ) : tool.slug === 'dynamic-qr-code-system' ? (
              <DynamicQrCodeSystemTool />
            ) : tool.slug === 'global-time-sync-tool' ? (
              <GlobalTimeSyncTool />
            ) : tool.slug === 'giveaway-winner-selector' ? (
              <GiveawayWinnerSelectorTool />
            ) : tool.slug === 'lead-magnet-creator-engine' ? (
              <LeadMagnetCreatorTool />
            ) : tool.slug === 'social-thread-growth-engine' ? (
              <SocialThreadGrowthTool />
            ) : tool.slug === 'customer-persona-intelligence-engine' ? (
              <CustomerPersonaIntelligenceTool />
            ) : tool.slug === 'landing-page-conversion-writer' ? (
              <LandingPageConversionWriterTool />
            ) : tool.slug === 'brand-voice-replication-engine' ? (
              <BrandVoiceReplicationTool />
            ) : tool.slug === 'code-documentation-generator' ? (
              <CodeDocumentationGeneratorTool />
            ) : tool.slug === 'sql-performance-optimizer' ? (
              <SqlPerformanceOptimizerTool />
            ) : tool.slug === 'api-schema-converter' ? (
              <ApiSchemaConverterTool />
            ) : tool.slug === 'security-vulnerability-scanner' ? (
              <SecurityVulnerabilityScannerTool />
            ) : tool.slug === 'database-visual-mapper' ? (
              <DatabaseVisualMapperTool />
            ) : tool.slug === 'keyword-cluster-engine' ? (
              <KeywordClusterEngineTool />
            ) : tool.slug === 'smart-regex-builder' ? (
              <SmartRegexBuilderTool />
            ) : tool.slug === 'cron-schedule-translator' ? (
              <CronScheduleTranslatorTool />
            ) : tool.slug === 'environment-config-generator' ? (
              <EnvironmentConfigGeneratorTool />
            ) : tool.slug === 'git-error-fix-assistant' ? (
              <GitErrorFixAssistantTool />
            ) : tool.slug === 'api-request-converter' ? (
              <ApiRequestConverterTool />
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
