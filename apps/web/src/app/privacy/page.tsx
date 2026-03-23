export const metadata = {
  title: 'Privacy Policy – Zenovee',
  description: 'Privacy Policy for Zenovee website and Zenovee Tools Chrome Extension.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        <p>
          This Privacy Policy describes how <strong>Qorelysoft</strong> ("we", "us") collects, uses, and shares
          information when you use the Zenovee website (<strong>zenovee.in</strong>) and the <strong>Zenovee Tools</strong>{' '}
          Chrome Extension.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions, contact us at: <a href="mailto:qorelysoft@zenovee.in">qorelysoft@zenovee.in</a>.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account information:</strong> email address and authentication identifiers needed to sign in.
          </li>
          <li>
            <strong>Subscription / entitlements:</strong> which tool categories you have access to (active or canceled).
          </li>
          <li>
            <strong>Usage / diagnostic information:</strong> basic logs required to secure and operate the service.
          </li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>To authenticate you and keep your account secure</li>
          <li>To check paid access (category entitlements) and unlock tools you have purchased</li>
          <li>To prevent abuse and protect the platform</li>
          <li>To improve product performance and reliability</li>
        </ul>

        <h2>Chrome Extension specific notes</h2>
        <p>
          The Zenovee Tools Chrome Extension allows you to sign in and quickly access Zenovee features. The extension
          communicates with Zenovee servers to:
        </p>
        <ul>
          <li>sign you in using your credentials</li>
          <li>retrieve your category entitlements</li>
        </ul>
        <p>
          The extension stores authentication session data locally in your browser (Chrome extension storage) so you
          don’t need to sign in repeatedly.
        </p>

        <h2>Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with service providers used to operate Zenovee
          (for example authentication and database providers) only as needed to provide the service.
        </p>

        <h2>Security</h2>
        <p>We use reasonable safeguards to protect your information. No system is 100% secure.</p>

        <h2>Your choices</h2>
        <ul>
          <li>You can log out to clear the active session.</li>
          <li>You can uninstall the Chrome Extension at any time from Chrome settings.</li>
        </ul>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Updates will be posted on this page with an updated “Last
          updated” date.
        </p>
      </div>
    </div>
  )
}
