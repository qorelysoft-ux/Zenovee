export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Paid-only halal productivity toolkit for real business, developer, image, SEO, and automation workflows.
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Zenovee is a premium subscription platform built around category-based access.
              The current product includes AI Marketing, Developer Assistant, E-commerce Image,
              SEO Growth, and Business Automation tool suites. No free tier.
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
              <a
                href="/documentation"
                className="rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Documentation
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
                <span>AI Marketing Engine</span>
                <span className="font-semibold">$97/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>AI Developer Assistant</span>
                <span className="font-semibold">$47/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>E-commerce Image Engine</span>
                <span className="font-semibold">$37/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>SEO Growth Engine</span>
                <span className="font-semibold">$27/mo</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Business Automation Toolkit</span>
                <span className="font-semibold">$17/mo</span>
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
              { title: 'AI Marketing Engine', href: '/tools/marketing', desc: 'Outreach, copy, content, and conversion tools' },
              { title: 'Developer Assistant', href: '/tools/dev-assistant', desc: 'Docs, SQL, regex, API, security, and debugging' },
              { title: 'E-commerce Image Engine', href: '/tools/ecom-image', desc: 'Resizing, cleanup, mockups, and image workflows' },
              { title: 'SEO Growth Engine', href: '/tools/seo-growth', desc: 'Keyword, metadata, audits, and SEO research tools' },
              { title: 'Business Automation Toolkit', href: '/tools/business-automation', desc: 'Operations, extraction, summaries, and QR workflows' },
              { title: 'Documentation', href: '/documentation', desc: 'Deployment, environment, extension, and platform docs' },
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
