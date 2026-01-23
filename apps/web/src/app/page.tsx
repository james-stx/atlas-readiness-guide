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
            <span className="text-xs text-gradient font-medium">by STX Labs</span>
          </div>
          <Link
            href="/start"
            className="text-sm font-medium text-primary hover:text-primary-700 transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-28 bg-white relative overflow-hidden">
        <div className="max-w-3xl text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight animate-in">
            Readiness. <span className="text-gradient">Revealed.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto animate-in animate-in-delay-1">
            Months of preparation, in a moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in animate-in-delay-2">
            <Link
              href="/start"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-all btn-glow"
            >
              Start Your Readiness Check
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              How It Works
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-400 animate-in animate-in-delay-3">
            AI-powered readiness assessment by STX Labs
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">
            For Australian Founders Considering the U.S. Market
          </h2>
          <p className="text-lg text-slate-500 text-center mb-14 max-w-2xl mx-auto">
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
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            The Expansion Trap
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Founders routinely make U.S. expansion decisions with incomplete, uneven,
            or low-confidence information without realising it.
          </p>
          <p className="text-slate-500">
            Assumptions quietly get treated as facts. &quot;Readiness&quot; becomes a
            vague feeling rather than a defensible position. By the time you realize
            what&apos;s missing, momentum is lost, or worse, misdirected.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-14 tracking-tight">
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
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">
            5 Readiness Domains
          </h2>
          <p className="text-slate-500 text-center mb-14 max-w-2xl mx-auto">
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
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Clarity, Not Scores
          </h2>
          <p className="text-lg text-slate-500 mb-6">
            Atlas doesn&apos;t grade you. It doesn&apos;t pretend to have answers
            you don&apos;t.
          </p>
          <p className="text-slate-500">
            Instead, it helps you see exactly what you&apos;re basing your decision
            on so you can validate what needs validating and address what needs
            addressing. The outcome is clarity, not false confidence.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-50 py-20 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Ready to find out where you really stand?
          </h2>
          <p className="text-slate-500 mb-10">
            30 minutes. No scores. Just clarity about your U.S. expansion readiness.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-all btn-glow"
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
    <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <h3 className="font-semibold text-slate-900 mb-2 text-lg">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
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
    <div className="text-center p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 mx-auto mb-5 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-3 text-lg">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
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
    <div className="p-5 bg-white border border-slate-200 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
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
