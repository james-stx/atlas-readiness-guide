import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-slate-900">Atlas</span>
          </div>
          <Link
            href="/start"
            className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6 leading-tight">
            Readiness. <span className="text-primary">Revealed.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Months of preparation, in a moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/start"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Start Your Readiness Check
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
            For Australian Founders Considering the U.S. Market
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Atlas is built for founders who want to base their expansion decisions
            on evidence, not instinct alone.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <AudienceCard
              title="Founders"
              description="Evaluating U.S. market entry timing and want to know what's validated vs. assumed"
            />
            <AudienceCard
              title="CEOs"
              description="Preparing for board discussions about expansion and need a clear, defensible position"
            />
            <AudienceCard
              title="Expansion Leads"
              description="Building the go-to-market case and identifying gaps before they become problems"
            />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            The Expansion Trap
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Founders routinely make U.S. expansion decisions with incomplete, uneven,
            or low-confidence information without realising it.
          </p>
          <p className="text-slate-600">
            Assumptions quietly get treated as facts. &quot;Readiness&quot; becomes a
            vague feeling rather than a defensible position. By the time you realize
            what&apos;s missing, momentum is lost, or worse, misdirected.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            What You&apos;ll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapIcon />}
              title="See Where You Stand"
              description="A structured conversation across 5 readiness domains reveals your actual position, not where you hope to be."
            />
            <FeatureCard
              icon={<ScaleIcon />}
              title="Facts vs. Assumptions"
              description="Every input is classified by confidence level (high, medium, or low) so you know exactly what's validated."
            />
            <FeatureCard
              icon={<DocumentIcon />}
              title="Share With Confidence"
              description="Export a professional PDF summary that aligns your team, board, and advisors around a clear picture."
            />
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
            5 Readiness Domains
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            We explore your readiness across the critical areas that determine
            U.S. expansion success.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <DomainCard
              name="Market"
              description="Target customers, size, competition"
            />
            <DomainCard
              name="Product"
              description="Fit, localization, regulatory needs"
            />
            <DomainCard
              name="Go-to-Market"
              description="Sales, channels, partnerships"
            />
            <DomainCard
              name="Operations"
              description="Legal, hiring, infrastructure"
            />
            <DomainCard
              name="Financials"
              description="Funding, runway, unit economics"
            />
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Clarity, Not Scores
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Atlas doesn&apos;t grade you. It doesn&apos;t pretend to have answers
            you don&apos;t.
          </p>
          <p className="text-slate-600">
            Instead, it helps you see exactly what you&apos;re basing your decision
            on so you can validate what needs validating and address what needs
            addressing. The outcome is clarity, not false confidence.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to find out where you really stand?
          </h2>
          <p className="text-primary-100 mb-8">
            30 minutes. No scores. Just clarity about your U.S. expansion readiness.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Start Your Readiness Check
          </Link>
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
            <Link
              href="/privacy"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Privacy Policy
            </Link>
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

function AudienceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-slate-50 rounded-xl">
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}

function DomainCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
      <h3 className="font-semibold text-slate-900 mb-1">{name}</h3>
      <p className="text-slate-500 text-xs">{description}</p>
    </div>
  );
}

// Icon components
function MapIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
