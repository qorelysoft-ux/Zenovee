export const metadata = {
  title: 'Chrome Extension – Zenovee',
  description: 'How to install and use the Zenovee Tools Chrome Extension.',
}

export default function ExtensionHelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Zenovee Chrome Extension</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Install the extension to access Zenovee tools faster from your browser.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          href="/downloads/zenovee-tools-v0.1.0.zip"
        >
          Download Extension ZIP
        </a>
        <a
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          href="https://www.zenovee.in/login"
        >
          Login to Zenovee
        </a>
      </div>

      <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
        <h2>Download</h2>
        <p>
          Your admin will share you a ZIP file like: <code>zenovee-tools-v0.1.0.zip</code>.
        </p>

        <p>
          If you are on Zenovee website right now, you can download it from this link:{' '}
          <a href="/downloads/zenovee-tools-v0.1.0.zip">/downloads/zenovee-tools-v0.1.0.zip</a>
        </p>

        <h2>Install (Step-by-step)</h2>
        <ol>
          <li>
            <strong>Unzip the file</strong> (extract it) to a folder on your computer.
          </li>
          <li>
            Open Google Chrome and go to: <code>chrome://extensions</code>
          </li>
          <li>
            Turn on <strong>Developer mode</strong> (top-right).
          </li>
          <li>
            Click <strong>Load unpacked</strong>.
          </li>
          <li>
            Select the extracted folder that contains <code>manifest.json</code>.
          </li>
          <li>
            The extension will appear in Chrome. Pin it from the Extensions (puzzle) icon.
          </li>
        </ol>

        <h2>Login</h2>
        <ol>
          <li>Click the Zenovee extension icon.</li>
          <li>Login using your Zenovee email and password.</li>
          <li>
            Your access is controlled by your active subscription (tool category entitlements). If you don’t have a
            subscription, tools will remain locked.
          </li>
        </ol>

        <h2>Current extension features</h2>
        <ul>
          <li>Login with your Zenovee account</li>
          <li>See whether you are logged in</li>
          <li>Fetch and display your active entitlements</li>
          <li>Use it as a quick-access companion to the website tools</li>
          <li>Open selected text directly in the searchable tools directory</li>
          <li>Paste your own keyword/text into the popup and open matching tools</li>
          <li>Use quick-launch actions for premium tools and category-specific searches</li>
        </ul>

        <p>
          More direct tool actions will be added after premium subscription and entitlement flows are fully finalized.
        </p>

        <h2>Troubleshooting</h2>
        <h3>“Could not load manifest”</h3>
        <ul>
          <li>Make sure you selected the folder that contains <code>manifest.json</code>.</li>
          <li>Try removing the extension and loading it again.</li>
        </ul>

        <h3>Extension opens but shows “Not logged in”</h3>
        <ul>
          <li>Login again with your Zenovee account.</li>
          <li>If login fails, confirm your Zenovee account works on the website.</li>
        </ul>

        <h3>Tools still locked after login</h3>
        <ul>
          <li>This means your account does not have an active entitlement for that tool category.</li>
          <li>Contact support: <a href="mailto:qorelysoft@zenovee.in">qorelysoft@zenovee.in</a></li>
        </ul>

        <h2>Privacy</h2>
        <p>
          Read our privacy policy here: <a href="/privacy">/privacy</a>
        </p>
      </div>
    </div>
  )
}
