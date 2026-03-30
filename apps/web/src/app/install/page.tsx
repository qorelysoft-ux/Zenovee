import Link from 'next/link'

export default function InstallRedirectPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="zen-card-strong rounded-[2rem] px-8 py-10 text-center">
        <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
          Install extension
        </div>
        <h1 className="mt-5 text-4xl font-semibold text-white">Install Zenovee for faster browser access.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          The extension page contains the download link, installation steps, login help, and troubleshooting notes.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/extension" className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white">
            Open extension guide
          </Link>
          <Link href="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
