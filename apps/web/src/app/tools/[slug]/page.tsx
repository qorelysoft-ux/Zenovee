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
import { MeetingNotesToEmailConverterTool } from '@/components/tools/MeetingNotesToEmailConverterTool'
import { MultiPlatformImageResizerTool } from '@/components/tools/MultiPlatformImageResizerTool'
import { PdfToMarkdownConverterTool } from '@/components/tools/PdfToMarkdownConverterTool'
import { ProductPhotoEnhancerTool } from '@/components/tools/ProductPhotoEnhancerTool'
import { ReceiptDataExtractorTool } from '@/components/tools/ReceiptDataExtractorTool'
import { SchemaMarkupGeneratorTool } from '@/components/tools/SchemaMarkupGeneratorTool'
import { SearchConsoleInsightsSimplifierTool } from '@/components/tools/SearchConsoleInsightsSimplifierTool'
import { ScreenshotCleanerProTool } from '@/components/tools/ScreenshotCleanerProTool'
import { EmployeeOnboardingBuilderTool } from '@/components/tools/EmployeeOnboardingBuilderTool'
import { BulkMetaOptimizerTool } from '@/components/tools/BulkMetaOptimizerTool'
import { SitemapHealthAnalyzerTool } from '@/components/tools/SitemapHealthAnalyzerTool'
import { InternalLinkingEngineTool } from '@/components/tools/InternalLinkingEngineTool'
import { SecurityVulnerabilityScannerTool } from '@/components/tools/SecurityVulnerabilityScannerTool'
import { SeoAuthorityBuilderTool } from '@/components/tools/SeoAuthorityBuilderTool'
import { SqlPerformanceOptimizerTool } from '@/components/tools/SqlPerformanceOptimizerTool'
import { SmartRegexBuilderTool } from '@/components/tools/SmartRegexBuilderTool'
import { SmartUnitCurrencyConverterTool } from '@/components/tools/SmartUnitCurrencyConverterTool'
import { SocialThreadGrowthTool } from '@/components/tools/SocialThreadGrowthTool'
import { SecureVaultManagerTool } from '@/components/tools/SecureVaultManagerTool'
import { SvgConversionEngineTool } from '@/components/tools/SvgConversionEngineTool'
import { ViralShortCreatorTool } from '@/components/tools/ViralShortCreatorTool'
import { WebsiteErrorScannerTool } from '@/components/tools/WebsiteErrorScannerTool'
import { BulkBackgroundRemovalEngineTool } from '@/components/tools/BulkBackgroundRemovalEngineTool'
import { AiImageUpscalerProTool } from '@/components/tools/AiImageUpscalerProTool'
import { ProductMockupGeneratorTool } from '@/components/tools/ProductMockupGeneratorTool'

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
    <div className="mx-auto max-w-7xl px-4 py-16">
      <section className="zen-card-strong rounded-[2rem] px-8 py-10">
        <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
          Premium tool workspace
        </div>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-5xl font-semibold text-white">{tool.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{tool.description}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Suite</div>
            <div className="mt-2 font-semibold text-white">{tool.category}</div>
            <div className="mt-3 rounded-xl border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-xs font-medium text-violet-200">
              Paid tool • consumes credits per run
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <ToolGatePlaceholder
          requiredCategory={tool.category}
          onUnlock={() => {
            fetch('/api/tool-runs', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ toolSlug: tool.slug }),
            }).catch(() => null)
          }}
        >
          <div className="zen-card rounded-[1.75rem] p-6">
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
            ) : tool.slug === 'bulk-background-removal-engine' ? (
              <BulkBackgroundRemovalEngineTool />
            ) : tool.slug === 'ai-image-upscaler-pro' ? (
              <AiImageUpscalerProTool />
            ) : tool.slug === 'multi-platform-image-resizer' ? (
              <MultiPlatformImageResizerTool />
            ) : tool.slug === 'product-mockup-generator' ? (
              <ProductMockupGeneratorTool />
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
            ) : tool.slug === 'meeting-notes-to-email-converter' ? (
              <MeetingNotesToEmailConverterTool />
            ) : tool.slug === 'receipt-data-extractor' ? (
              <ReceiptDataExtractorTool />
            ) : tool.slug === 'employee-onboarding-builder' ? (
              <EmployeeOnboardingBuilderTool />
            ) : tool.slug === 'secure-vault-manager' ? (
              <SecureVaultManagerTool />
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
                <div className="text-sm font-medium text-white">Tool interface</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  This premium tool is available now and consumes credits when you run it.
                </p>
              </>
            )}
          </div>
        </ToolGatePlaceholder>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="zen-card rounded-[1.5rem] p-6">
          <h2 className="text-xl font-semibold text-white">How it works</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {`${tool.name} is available through the shared credit wallet and consumes credits when used.`}
          </p>
        </section>
        <section className="zen-card rounded-[1.5rem] p-6">
          <h2 className="text-xl font-semibold text-white">Use cases</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300">
            <li>Save time on repetitive tasks</li>
            <li>Improve accuracy and consistency</li>
            <li>Work faster from any device</li>
          </ul>
        </section>
      </div>

      <section className="zen-card mt-12 rounded-[1.5rem] p-6">
        <h2 className="text-xl font-semibold text-white">FAQ</h2>
        <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
          <p>
            <span className="font-medium text-white">Why is it locked?</span>{' '}
            This tool requires paid credits to use.
          </p>
          <p>
            <span className="font-medium text-white">How do I get access?</span>{' '}
            Buy credits from the pricing or checkout page.
          </p>
        </div>
      </section>
    </div>
  )
}
