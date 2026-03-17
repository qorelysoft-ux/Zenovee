export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <a href="/" className="text-lg font-semibold tracking-tight">
          Zenovee
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a className="hover:underline" href="/tools">
            Tools
          </a>
          <a className="hover:underline" href="/pricing">
            Pricing
          </a>
          <a
            className="rounded-md bg-black px-3 py-2 text-white dark:bg-white dark:text-black"
            href="/login"
          >
            Login
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Paid-only halal productivity toolkit — 50 tools, built for real work.
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Zenovee is a subscription platform with practical tools across AI,
              Developer, Image, SEO, Text and Utilities. No free tier: access is
              unlocked by category subscriptions.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/pricing"
                className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
              >
                View pricing
              </a>
              <a
                href="/tools"
                className="rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Browse tools
              </a>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              Note: Payments & category gating are being integrated next (Razorpay
              subscriptions + webhooks).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-medium">Category plans</div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              <li className="flex items-center justify-between">
                <span>AI Productivity Tools</span>
                <span className="font-semibold">$99/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Developer Tools</span>
                <span className="font-semibold">$59/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Image Tools</span>
                <span className="font-semibold">$49/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>SEO Tools</span>
                <span className="font-semibold">$29/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Text Tools</span>
                <span className="font-semibold">$18/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Utility Tools</span>
                <span className="font-semibold">$9/mo</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
              All tools are designed for legitimate, professional use and will be
              kept halal-friendly (no haram content generation features).
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">Popular tool categories</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'AI Productivity', href: '/tools/ai', desc: 'Resume, email, summaries, titles' },
              { title: 'Developer', href: '/tools/developer', desc: 'JSON, JWT, regex, SQL, minify' },
              { title: 'Image', href: '/tools/image', desc: 'Compress, resize, OCR, metadata' },
              { title: 'SEO', href: '/tools/seo', desc: 'Meta tags, sitemap, analyzers' },
              { title: 'Text', href: '/tools/text', desc: 'Count, case, slug, speech' },
              { title: 'Utilities', href: '/tools/utilities', desc: 'UUID, QR, password, converters' },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="rounded-xl border border-zinc-200 p-6 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <div className="text-base font-medium">{c.title}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{c.desc}</div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-10 text-center text-xs text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} Zenovee. Paid-only multi-tools SaaS.
      </footer>
    </div>
  );
}
