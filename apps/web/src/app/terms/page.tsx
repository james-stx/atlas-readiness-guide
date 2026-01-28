import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-wide mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="font-semibold text-neutral-900">Atlas</span>
          </Link>
          <Link
            href="/start"
            className="text-sm font-medium text-neutral-900 hover:text-accent-600 transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="flex-1 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-neutral-400 mb-12">
            Last updated: January 2026
          </p>

          <div className="space-y-10 text-neutral-600 leading-relaxed">
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using the Atlas Readiness Guide (&quot;Atlas&quot;, &quot;the Service&quot;),
                operated by STX Labs Pty Ltd (&quot;STX Labs&quot;, &quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to
                these terms, please do not use the Service.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                Atlas is an AI-powered readiness assessment tool that helps founders evaluate their
                preparedness for U.S. market expansion. The Service provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>A guided conversational assessment across five business domains</li>
                <li>Confidence classification of your inputs (high, medium, low)</li>
                <li>A synthesised Readiness Snapshot summarising your position</li>
                <li>PDF export and email delivery of results</li>
              </ul>
            </Section>

            <Section title="3. Nature of the Service">
              <p>
                Atlas is an informational tool designed to help you organise and evaluate your own
                knowledge about U.S. expansion readiness. It is important to understand that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Atlas does <strong className="text-neutral-900">not</strong> provide legal, financial,
                  tax, immigration, or professional business advice.
                </li>
                <li>
                  The Readiness Snapshot reflects your inputs, not an independent evaluation of your
                  business or market opportunity.
                </li>
                <li>
                  Confidence classifications are algorithmically generated and should be treated as
                  indicative, not definitive.
                </li>
                <li>
                  You should consult qualified professionals before making expansion decisions based
                  on your results.
                </li>
              </ul>
            </Section>

            <Section title="4. User Accounts and Sessions">
              <p>
                Atlas uses email-based sessions rather than traditional accounts. By starting a session,
                you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide a valid email address</li>
                <li>Use the Service for legitimate business assessment purposes</li>
                <li>Not share session recovery links with unauthorised parties</li>
                <li>Not attempt to access sessions belonging to others</li>
              </ul>
              <p className="mt-3">
                Sessions expire after 30 days. We are not responsible for data loss due to session
                expiry. We recommend exporting your Readiness Snapshot before your session expires.
              </p>
            </Section>

            <Section title="5. Acceptable Use">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Submit false, misleading, or harmful content</li>
                <li>Attempt to reverse-engineer, decompile, or extract the underlying AI models or prompts</li>
                <li>Overwhelm the Service with automated requests or scripted interactions</li>
                <li>Use the Service for any purpose that violates applicable laws or regulations</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate access for violations of these terms.
              </p>
            </Section>

            <Section title="6. Intellectual Property">
              <p>
                <strong className="text-neutral-900">Our property:</strong> The Service, including its design,
                code, AI prompts, domain frameworks, and branding, is owned by STX Labs and protected by
                intellectual property laws. You may not copy, modify, or distribute any part of the
                Service without our written permission.
              </p>
              <p>
                <strong className="text-neutral-900">Your content:</strong> You retain ownership of the
                information you provide during the assessment. By using the Service, you grant us a
                limited licence to process your inputs for the purpose of delivering the Service
                (generating responses, snapshots, and exports).
              </p>
            </Section>

            <Section title="7. Privacy">
              <p>
                Your use of the Service is also governed by our{' '}
                <Link href="/privacy" className="text-accent-600 hover:underline">
                  Privacy Policy
                </Link>, which describes how we collect, use, and protect your data. By using Atlas,
                you consent to the data practices described in that policy.
              </p>
            </Section>

            <Section title="8. Disclaimer of Warranties">
              <p>
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
                To the fullest extent permitted by Australian law, STX Labs disclaims all warranties,
                express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Fitness for a particular purpose</li>
                <li>Accuracy or completeness of AI-generated analysis</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Suitability of results for business decision-making without professional consultation</li>
              </ul>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, STX Labs shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your use of or inability to use the Service</li>
                <li>Business decisions made based on your Readiness Snapshot</li>
                <li>Inaccuracies in AI-generated confidence classifications or analysis</li>
                <li>Loss of data due to session expiry or technical issues</li>
                <li>Unauthorised access to your session</li>
              </ul>
              <p className="mt-3">
                Where liability cannot be excluded under Australian Consumer Law, our liability is
                limited to re-supplying the Service or the cost of having the Service re-supplied.
              </p>
            </Section>

            <Section title="10. Modifications to the Service">
              <p>
                We reserve the right to modify, suspend, or discontinue the Service (or any part of it)
                at any time, with or without notice. We are not liable for any modification, suspension,
                or discontinuation of the Service.
              </p>
            </Section>

            <Section title="11. Changes to These Terms">
              <p>
                We may update these Terms of Service from time to time. Changes will be posted on this
                page with an updated &quot;Last updated&quot; date. Continued use of the Service after
                changes constitutes acceptance of the revised terms.
              </p>
            </Section>

            <Section title="12. Governing Law">
              <p>
                These Terms are governed by the laws of the State of Victoria, Australia. Any disputes
                arising from these Terms or the Service will be subject to the exclusive jurisdiction of
                the courts of Victoria, Australia.
              </p>
            </Section>

            <Section title="13. Contact Us">
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <p className="mt-3">
                <strong className="text-neutral-900">STX Labs Pty Ltd</strong><br />
                Email:{' '}
                <a href="mailto:hello@stxlabs.io" className="text-accent-600 hover:underline">
                  hello@stxlabs.io
                </a>
              </p>
            </Section>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} STX Labs. All rights reserved.
            </p>
            <span className="hidden md:inline text-neutral-300">|</span>
            <p className="text-sm text-neutral-500">
              Helping Australian founders expand with confidence
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-neutral-500 hover:text-neutral-700"
            >
              Privacy Policy
            </Link>
            <span className="text-sm text-neutral-900 font-medium">
              Terms of Service
            </span>
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
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
