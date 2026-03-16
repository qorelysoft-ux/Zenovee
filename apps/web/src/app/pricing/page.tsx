import Link from 'next/link'

const plans = [
  { key: 'AI', name: 'AI Productivity Tools', price: 99, desc: '10 AI writing + productivity tools' },
  { key: 'DEVELOPER', name: 'Developer Tools', price: 59, desc: 'Formatters, converters, encoders' },
  { key: 'IMAGE', name: 'Image Tools', price: 49, desc: 'Compress, resize, convert, OCR' },
  { key: 'SEO', name: 'SEO Tools', price: 29, desc: 'Meta tags, sitemap, analyzers' },
  { key: 'TEXT', name: 'Text Tools', price: 18, desc: 'Counters, converters, speech tools' },
  { key: 'UTILITY', name: 'Utility Tools', price: 9, desc: 'UUID, QR, password, converters' },
] as const

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Pricing</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        No free tier. You must subscribe to a category to use the tools inside it.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.key}
            className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">{p.name}</h2>
              <div className="text-right">
                <div className="text-2xl font-semibold">${p.price}</div>
                <div className="text-xs text-zinc-500">/ month</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{p.desc}</p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/checkout"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
              >
                Subscribe
              </Link>
              <Link
                href={`/tools/${p.key.toLowerCase()}`}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
              >
                View tools
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
