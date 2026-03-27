export const metadata = {
  title: 'Documentation — Zenovee',
  description: 'Deployment, extension, environment, and platform documentation for Zenovee.',
}

const sections = [
  {
    title: 'Platform overview',
    points: [
      'Zenovee is a paid premium tools platform built around category-based access.',
      'The current product structure includes Marketing, Developer Assistant, E-commerce Image, SEO Growth, and Business Automation.',
      'Each premium tool has its own SEO page and entitlement-aware access flow.',
    ],
  },
  {
    title: 'Environment variables',
    points: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'DATABASE_URL',
      'GEMINI_API_KEY',
      'OPENAI_API_KEY',
      'Server-side secrets should stay only in secure environment settings and never in the frontend bundle.',
    ],
  },
  {
    title: 'Deployment checklist',
    points: [
      'Deploy the web app from apps/web on Vercel.',
      'Verify environment variables before building.',
      'Confirm production login, dashboard, tools directory, admin, and extension download pages work.',
      'Verify database-backed API routes and AI-powered tool routes after deployment.',
    ],
  },
  {
    title: 'Chrome extension',
    points: [
      'Build with npm -w @zenovee/extension run build',
      'Package with npm -w @zenovee/extension run package',
      'Latest ZIP can be distributed from the public downloads directory.',
      'The extension currently supports login, entitlement visibility, quick-launch actions, and context-menu helpers.',
    ],
  },
  {
    title: 'Current remaining work',
    points: [
      'Razorpay subscriptions and webhook lifecycle',
      'Payment history and subscription actions in the dashboard',
      'Deeper admin management workflows',
      'Further extension-to-tool integrations',
      'Final production QA and hardening',
    ],
  },
]

export default function DocumentationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Documentation</h1>
      <p className="mt-3 max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
        Central reference for deployment, environment setup, extension packaging, and the current implementation status of Zenovee.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
