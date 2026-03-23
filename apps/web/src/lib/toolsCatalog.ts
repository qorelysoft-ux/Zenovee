import type { ToolCategory } from './entitlements'

export type ToolDef = {
  slug: string
  name: string
  category: ToolCategory
  description: string
}

export const categoryPages = [
  { slug: 'ai', name: 'AI Productivity Tools', category: 'AI' as const },
  { slug: 'developer', name: 'Developer Tools', category: 'DEVELOPER' as const },
  { slug: 'image', name: 'Image Tools', category: 'IMAGE' as const },
  { slug: 'seo', name: 'SEO Tools', category: 'SEO' as const },
  { slug: 'text', name: 'Text Tools', category: 'TEXT' as const },
  { slug: 'utilities', name: 'Utility Tools', category: 'UTILITY' as const },
] as const

export const toolsCatalog: ToolDef[] = [
  // AI Productivity Tools (1-10)
  { slug: 'ai-resume-generator', name: 'AI Resume Generator', category: 'AI', description: 'Generate a resume draft from role, skills, and experience.' },
  { slug: 'ai-cover-letter-generator', name: 'AI Cover Letter Generator', category: 'AI', description: 'Generate a cover letter tailored to a job description.' },
  { slug: 'ai-email-writer', name: 'AI Email Writer', category: 'AI', description: 'Draft professional emails from a short prompt.' },
  { slug: 'ai-product-description-generator', name: 'AI Product Description Generator', category: 'AI', description: 'Create product descriptions for e-commerce listings.' },
  { slug: 'ai-blog-title-generator', name: 'AI Blog Title Generator', category: 'AI', description: 'Generate blog title ideas from keywords and topic.' },
  { slug: 'ai-text-summarizer', name: 'AI Text Summarizer', category: 'AI', description: 'Summarize long text into key bullet points.' },
  { slug: 'ai-grammar-fixer', name: 'AI Grammar Fixer', category: 'AI', description: 'Fix grammar and improve clarity without changing meaning.' },
  { slug: 'ai-paraphrasing-tool', name: 'AI Paraphrasing Tool', category: 'AI', description: 'Rewrite text in a new style while preserving meaning.' },
  { slug: 'ai-meeting-notes-generator', name: 'AI Meeting Notes Generator', category: 'AI', description: 'Turn raw meeting notes into structured minutes and action items.' },
  { slug: 'ai-startup-name-generator', name: 'AI Startup Name Generator', category: 'AI', description: 'Generate brandable startup names from keywords.' },

  // Developer Tools (11-20)
  { slug: 'json-formatter', name: 'JSON Formatter', category: 'DEVELOPER', description: 'Format and validate JSON into pretty-printed output.' },
  { slug: 'json-to-csv', name: 'JSON to CSV Converter', category: 'DEVELOPER', description: 'Convert JSON arrays/objects into CSV.' },
  { slug: 'base64-encoder', name: 'Base64 Encoder', category: 'DEVELOPER', description: 'Encode text to base64.' },
  { slug: 'base64-decoder', name: 'Base64 Decoder', category: 'DEVELOPER', description: 'Decode base64 into text.' },
  { slug: 'url-encoder', name: 'URL Encoder', category: 'DEVELOPER', description: 'Encode a string for safe URL usage.' },
  { slug: 'url-decoder', name: 'URL Decoder', category: 'DEVELOPER', description: 'Decode an encoded URL string.' },
  { slug: 'jwt-decoder', name: 'JWT Decoder', category: 'DEVELOPER', description: 'Decode a JWT (header/payload) without verifying signature.' },
  { slug: 'regex-tester', name: 'Regex Tester', category: 'DEVELOPER', description: 'Test regular expressions against sample text.' },
  { slug: 'sql-formatter', name: 'SQL Formatter', category: 'DEVELOPER', description: 'Format SQL queries for readability.' },
  { slug: 'code-minifier', name: 'Code Minifier', category: 'DEVELOPER', description: 'Minify code snippets (JS/CSS/HTML) for smaller size.' },

  // Image Tools (21-30)
  { slug: 'image-compressor', name: 'Image Compressor', category: 'IMAGE', description: 'Compress images to reduce file size.' },
  { slug: 'image-resizer', name: 'Image Resizer', category: 'IMAGE', description: 'Resize images to specific dimensions.' },
  { slug: 'image-format-converter', name: 'Image Format Converter', category: 'IMAGE', description: 'Convert images between PNG/JPG/WebP.' },
  { slug: 'background-remover', name: 'Background Remover', category: 'IMAGE', description: 'Remove background from an image.' },
  { slug: 'image-cropper', name: 'Image Crop Tool', category: 'IMAGE', description: 'Crop images to a selected area.' },
  { slug: 'screenshot-to-text-ocr', name: 'Screenshot to Text (OCR)', category: 'IMAGE', description: 'Extract text from an image using OCR.' },
  { slug: 'watermark-image', name: 'Watermark Image Tool', category: 'IMAGE', description: 'Add watermark text/logo to an image.' },
  { slug: 'image-metadata-viewer', name: 'Image Metadata Viewer', category: 'IMAGE', description: 'View EXIF/metadata of images.' },
  { slug: 'color-palette-generator', name: 'Color Palette Generator', category: 'IMAGE', description: 'Generate dominant color palette from an image.' },
  { slug: 'image-upscaler', name: 'Image Upscaler', category: 'IMAGE', description: 'Upscale images to higher resolution.' },

  // SEO Tools (31-38)
  { slug: 'keyword-density-checker', name: 'Keyword Density Checker', category: 'SEO', description: 'Analyze keyword frequency and density in text.' },
  { slug: 'meta-tag-generator', name: 'Meta Tag Generator', category: 'SEO', description: 'Generate SEO meta title/description tags.' },
  { slug: 'sitemap-generator', name: 'Sitemap Generator', category: 'SEO', description: 'Generate sitemap.xml from a list of URLs.' },
  { slug: 'robots-txt-generator', name: 'Robots.txt Generator', category: 'SEO', description: 'Generate a robots.txt file.' },
  { slug: 'website-seo-analyzer', name: 'Website SEO Analyzer', category: 'SEO', description: 'Analyze on-page SEO signals for a URL.' },
  { slug: 'title-tag-analyzer', name: 'Title Tag Analyzer', category: 'SEO', description: 'Analyze title length and best practices.' },
  { slug: 'broken-link-checker', name: 'Broken Link Checker', category: 'SEO', description: 'Check a page for broken links.' },
  { slug: 'open-graph-generator', name: 'Open Graph Generator', category: 'SEO', description: 'Generate OG meta tags for social sharing.' },

  // Text Tools (39-44)
  { slug: 'word-counter', name: 'Word Counter', category: 'TEXT', description: 'Count words in text.' },
  { slug: 'character-counter', name: 'Character Counter', category: 'TEXT', description: 'Count characters (with/without spaces).' },
  { slug: 'case-converter', name: 'Case Converter', category: 'TEXT', description: 'Convert text case (upper/lower/title/sentence).' },
  { slug: 'text-to-speech', name: 'Text to Speech', category: 'TEXT', description: 'Convert text into speech audio.' },
  { slug: 'speech-to-text', name: 'Speech to Text', category: 'TEXT', description: 'Convert audio to text.' },
  { slug: 'slug-generator', name: 'Slug Generator', category: 'TEXT', description: 'Generate URL-friendly slugs from titles.' },

  // Utility Tools (45-50)
  { slug: 'password-generator', name: 'Password Generator', category: 'UTILITY', description: 'Generate strong random passwords.' },
  { slug: 'uuid-generator', name: 'UUID Generator', category: 'UTILITY', description: 'Generate UUID v4 identifiers.' },
  { slug: 'qr-code-generator', name: 'QR Code Generator', category: 'UTILITY', description: 'Generate QR codes from text/URLs.' },
  { slug: 'unit-converter', name: 'Unit Converter', category: 'UTILITY', description: 'Convert between common units.' },
  { slug: 'timestamp-converter', name: 'Timestamp Converter', category: 'UTILITY', description: 'Convert timestamps to/from human dates.' },
  { slug: 'random-number-generator', name: 'Random Number Generator', category: 'UTILITY', description: 'Generate random integers within a range.' },
]

export function getToolBySlug(slug: string): ToolDef | undefined {
  return toolsCatalog.find((t) => t.slug === slug)
}
