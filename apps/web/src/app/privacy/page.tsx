import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-900">Atlas</span>
              <span className="text-xs text-gradient font-medium">by STX Labs</span>
            </span>
          </Link>
          <Link
            href="/start"
            className="text-sm font-medium text-primary hover:text-primary-700 transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="flex-1 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-12">
            Last updated: January 2026
          </p>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            <Section title="Overview">
              <p>
                STX Labs Pty Ltd (&quot;STX Labs&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
                operates the Atlas Readiness Guide (&quot;Atlas&quot;, &quot;the Service&quot;). This Privacy
                Policy explains how we collect, use, and protect your information when you use our Service.
              </p>
              <p>
                We are committed to handling your data responsibly and transparently. By using Atlas, you
                agree to the practices described in this policy.
              </p>
            </Section>

            <Section title="Information We Collect">
              <p>We collect the following information when you use Atlas:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong className="text-slate-900">Email address</strong> — provided when you start a session, used to
                  deliver your results and enable session recovery.
                </li>
                <li>
                  <strong className="text-slate-900">Conversation responses</strong> — the answers you provide during the
                  readiness assessment, including business information across five domains (Market, Product,
                  Go-to-Market, Operations, Financials).
                </li>
                <li>
                  <strong className="text-slate-900">Session metadata</strong> — technical data such as session identifiers,
                  timestamps, domain progress, and confidence classifications generated during your assessment.
                </li>
              </ul>
              <p className="mt-3">
                We do not collect passwords (Atlas uses email-based sessions), payment information,
                or precise location data.
              </p>
            </Section>

            <Section title="How We Use Your Information">
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Conduct the readiness assessment conversation</li>
                <li>Generate your personalised Readiness Snapshot</li>
                <li>Classify input confidence levels (high, medium, low)</li>
                <li>Enable session recovery if you return later</li>
                <li>Send your results via email and PDF export</li>
                <li>Improve the quality and accuracy of the assessment</li>
              </ul>
            </Section>

            <Section title="AI Processing">
              <p>
                Atlas uses AI language models (provided by Anthropic) to conduct the assessment conversation
                and generate your Readiness Snapshot. Your responses are sent to these AI services for
                processing. We do not use your individual data to train AI models.
              </p>
              <p>
                Confidence classifications are generated using pattern-based analysis to categorise your
                inputs as high, medium, or low confidence. This helps surface what is validated versus
                what may be assumed.
              </p>
            </Section>

            <Section title="Data Storage and Security">
              <p>
                Your data is stored securely using Supabase (hosted on AWS infrastructure). We implement
                industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Encrypted data in transit (TLS/SSL) and at rest</li>
                <li>Hashed session recovery tokens (SHA-256)</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Row-level security on database tables</li>
              </ul>
            </Section>

            <Section title="Data Retention">
              <p>
                Assessment sessions are retained for 30 days from creation. After this period,
                session data may be deleted. Generated snapshots and exported PDFs are retained
                as long as your session is active.
              </p>
              <p>
                You may request deletion of your data at any time by contacting us at{' '}
                <a href="mailto:hello@stxlabs.io" className="text-primary hover:underline">
                  hello@stxlabs.io
                </a>.
              </p>
            </Section>

            <Section title="Data Sharing">
              <p>
                We do not sell your personal data. We share data only with the following third-party
                services, strictly for operating the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong className="text-slate-900">Anthropic</strong> — AI processing for conversation and synthesis
                </li>
                <li>
                  <strong className="text-slate-900">Supabase</strong> — database hosting and storage
                </li>
                <li>
                  <strong className="text-slate-900">Resend</strong> — email delivery
                </li>
                <li>
                  <strong className="text-slate-900">Vercel</strong> — application hosting
                </li>
                <li>
                  <strong className="text-slate-900">Upstash</strong> — rate limiting
                </li>
              </ul>
              <p className="mt-3">
                Each provider processes data in accordance with their own privacy policies and
                applicable data protection regulations.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>
                Under the Australian Privacy Act 1988 and applicable regulations, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:hello@stxlabs.io" className="text-primary hover:underline">
                  hello@stxlabs.io
                </a>.
              </p>
            </Section>

            <Section title="Cookies and Tracking">
              <p>
                Atlas uses browser local storage to maintain your session state. We do not use
                third-party tracking cookies or advertising pixels. Session data stored locally
                in your browser is used solely to enable session continuity.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated &quot;Last updated&quot; date. Continued use of the Service after
                changes constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have questions about this Privacy Policy or how we handle your data, please
                contact us:
              </p>
              <p className="mt-3">
                <strong className="text-slate-900">STX Labs Pty Ltd</strong><br />
                Email:{' '}
                <a href="mailto:hello@stxlabs.io" className="text-primary hover:underline">
                  hello@stxlabs.io
                </a>
              </p>
            </Section>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} STX Labs. All rights reserved.
            </p>
            <span className="hidden md:inline text-slate-300">|</span>
            <p className="text-sm text-slate-500">
              Helping Australian founders expand with confidence
            </p>
          </div>
          <div className="flex gap-6">
            <span className="text-sm text-slate-900 font-medium">
              Privacy Policy
            </span>
            <Link
              href="/terms"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
