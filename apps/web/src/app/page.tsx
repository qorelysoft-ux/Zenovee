const suites = [
  {
    title: 'AI Marketing Engine',
    price: '$97',
    href: '/tools/marketing',
    outcome: 'Turn campaigns, copy, outreach, and conversion work into one repeatable growth system.',
  },
  {
    title: 'AI Developer Assistant',
    price: '$47',
    href: '/tools/dev-assistant',
    outcome: 'Ship faster with cleaner docs, better debugging, stronger schemas, and less engineering drag.',
  },
  {
    title: 'E-commerce Image Engine',
    price: '$37',
    href: '/tools/ecom-image',
    outcome: 'Produce polished product visuals that improve trust, click-through, and conversion quality.',
  },
  {
    title: 'SEO Growth Engine',
    price: '$27',
    href: '/tools/seo-growth',
    outcome: 'Find ranking opportunities faster and turn SEO work into measurable traffic growth.',
  },
  {
    title: 'Business Automation Toolkit',
    price: '$17',
    href: '/tools/business-automation',
    outcome: 'Remove repetitive admin work so your team can focus on higher-value execution.',
  },
] as const

const pains = [
  'Too many disconnected tools create confusion, slow execution, and kill momentum.',
  'The highest-value work gets delayed by repetitive tasks, unclear workflows, and context switching.',
  'Generic tools produce generic outcomes. Premium growth requires systems designed around real results.',
]

const benefits = [
  'Save time across growth, engineering, and operations',
  'Increase output quality and consistency',
  'Move from idea to production-ready result faster',
]

const testimonials = [
  {
    quote: 'Zenovee made our marketing workflow feel like we hired a high-performance execution team overnight.',
    author: 'Amina R.',
    role: 'Growth Lead',
  },
  {
    quote: 'The Developer Assistant alone removed hours of debugging and documentation overhead every week.',
    author: 'Bilal H.',
    role: 'Product Engineer',
  },
  {
    quote: 'We stopped jumping between random tools and finally got one focused system for actual business output.',
    author: 'Mariam S.',
    role: 'Operations Manager',
  },
] as const

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10">
      <section className="zen-grid overflow-hidden rounded-[2rem] border border-white/10 px-6 py-10 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300">
              Trusted workflow suites • Premium only • Limited launch pricing
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              One premium AI workspace to grow revenue, speed up work, and reduce operational drag.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Zenovee helps marketers, developers, operators, and e-commerce teams move faster with focused workflow suites designed around outcomes—not tool clutter.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/pricing" className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-violet-950/40 hover:scale-[1.02]">
                Choose your suite
              </a>
              <a href="/tools" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Explore tools
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
              <div><span className="font-semibold text-white">5</span> premium suites</div>
              <div><span className="font-semibold text-white">50+</span> focused workflows</div>
              <div><span className="font-semibold text-white">100%</span> paid-only experience</div>
            </div>
          </div>

          <div className="zen-card-strong rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Executive command view</span>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-300">Money-back guarantee</span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">This week</div>
                <div className="mt-2 text-3xl font-semibold text-white">37 hours saved</div>
                <div className="mt-1 text-sm text-slate-400">Across growth, engineering, SEO, and operations workflows</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Top-performing suite</div>
                  <div className="mt-2 font-semibold text-white">AI Marketing Engine</div>
                  <div className="mt-1 text-sm text-slate-300">Campaign ideation → copy → conversion workflow</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Fastest ROI</div>
                  <div className="mt-2 font-semibold text-white">Business Automation</div>
                  <div className="mt-1 text-sm text-slate-300">Eliminate repetitive coordination and admin work</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {pains.map((copy) => (
          <div key={copy} className="zen-card rounded-[1.5rem] p-6 text-slate-200">
            <div className="text-sm font-semibold text-white">Pain point</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Suites</div>
          <h2 className="mt-3 text-4xl font-semibold text-white">Five premium engines. One direct path from problem to result.</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-5">
          {suites.map((suite) => (
            <a key={suite.href} href={suite.href} className="zen-card rounded-[1.5rem] p-6 hover:-translate-y-1 hover:border-blue-400/30">
              <div className="text-sm text-slate-400">{suite.price}/month</div>
              <div className="mt-3 text-lg font-semibold text-white">{suite.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{suite.outcome}</p>
              <div className="mt-6 text-sm font-semibold text-blue-300">Explore suite →</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        <div className="zen-card rounded-[1.5rem] p-6 md:col-span-2">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">How it works</div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {['Choose your goal', 'Use focused AI tools', 'Get production-ready results'].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-slate-400">Step {index + 1}</div>
                <div className="mt-2 font-semibold text-white">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="zen-card rounded-[1.5rem] p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Benefits</div>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            {benefits.map((benefit) => (
              <li key={benefit} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20">
        <div className="zen-card rounded-[1.75rem] p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Social proof</div>
              <h2 className="mt-3 text-4xl font-semibold text-white">Built for teams that value speed, clarity, and trust.</h2>
            </div>
            <div className="text-sm text-slate-300">Trusted by ambitious founders, operators, growth teams, and engineers.</div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.author} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm leading-7 text-slate-200">“{item.quote}”</p>
                <div className="mt-5 text-sm font-semibold text-white">{item.author}</div>
                <div className="text-xs text-slate-400">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="zen-card-strong rounded-[2rem] px-8 py-10 text-center">
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Final CTA
          </div>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold text-white">Stop stitching together random tools. Start using one premium system that helps you execute faster.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Limited launch pricing is still available. Choose a suite, unlock your workflow, and move from scattered effort to focused execution.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/pricing" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">
              View pricing
            </a>
            <a href="/dashboard" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Open dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}