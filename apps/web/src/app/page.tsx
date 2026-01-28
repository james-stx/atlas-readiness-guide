import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-wide mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="flex items-baseline gap-1.5">
              <span className="font-semibold text-neutral-900">Atlas</span>
              <span className="text-xs text-gradient font-medium">by STX Labs</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/start"
              className="text-sm font-medium text-neutral-900 hover:text-accent-600 transition-colors"
            >
              Start Assessment
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-wide mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1] animate-in">
              Your Readiness. <span className="text-gradient">Revealed.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed animate-in animate-in-delay-1">
              Atlas helps Australian founders understand their U.S. expansion readiness
              by surfacing what&apos;s validated, what&apos;s assumed, and what&apos;s missing.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-in animate-in-delay-2">
              <Link
                href="/start"
                className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-soft hover:shadow-medium"
              >
                Start your assessment
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center h-12 px-8 border border-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-[0.98]"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-6 text-sm text-neutral-500 animate-in animate-in-delay-3">
              Takes about 25 minutes. No account required.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6 border-y border-neutral-100 bg-neutral-50/50">
        <div className="max-w-wide mx-auto">
          <p className="text-sm text-neutral-500 text-center mb-6">
            Built for founders preparing for U.S. market entry
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <span className="text-sm font-medium text-neutral-400">Startmate</span>
            <span className="text-sm font-medium text-neutral-400">Blackbird</span>
            <span className="text-sm font-medium text-neutral-400">Airtree</span>
            <span className="text-sm font-medium text-neutral-400">Square Peg</span>
            <span className="text-sm font-medium text-neutral-400">Main Sequence</span>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 px-6">
        <div className="max-w-content mx-auto text-center">
          <p className="text-sm font-medium text-accent-600 mb-4">The challenge</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-snug">
            Founders routinely make expansion decisions with incomplete information
            &mdash; without realising it.
          </h2>
          <p className="mt-6 text-neutral-600 leading-relaxed">
            Assumptions get treated as facts. &quot;Readiness&quot; becomes a vague feeling
            rather than a defensible position. By the time gaps surface, momentum is
            lost or misdirected.
          </p>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-wide mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              Clarity in 25 minutes
            </h2>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
              A structured conversation that helps you see exactly where you stand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Teal */}
            <div className="bento-card feature-card-teal md:col-span-2 lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <p className="text-xs font-medium text-accent-700 uppercase tracking-wide mb-2">
                    Guided Assessment
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Explore 5 readiness domains
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Market, Product, Go-to-Market, Operations, and Financials.
                    Each domain is explored through natural conversation, not forms.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Market', 'Product', 'GTM', 'Ops', 'Finance'].map((domain) => (
                    <span
                      key={domain}
                      className="px-3 py-1.5 bg-white/80 border border-accent-200 rounded-full text-xs font-medium text-accent-700"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2 - Amber */}
            <div className="bento-card feature-card-amber">
              <p className="text-xs font-medium text-warm-700 uppercase tracking-wide mb-2">
                Confidence Classification
              </p>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Facts vs. assumptions
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Every response is classified by confidence level, so you know
                what&apos;s validated and what needs more work.
              </p>
              <div className="mt-4 space-y-2">
                <ConfidenceIndicator level="High" color="teal" />
                <ConfidenceIndicator level="Medium" color="amber" />
                <ConfidenceIndicator level="Low" color="neutral" />
              </div>
            </div>

            {/* Feature 3 - Neutral */}
            <div className="bento-card feature-card-neutral">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                Readiness Snapshot
              </p>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Synthesised insights
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Get a clear summary of your strengths, assumptions to validate,
                and gaps to address.
              </p>
            </div>

            {/* Feature 4 - Neutral */}
            <div className="bento-card feature-card-neutral md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                    Export & Share
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Professional PDF report
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Download or email your snapshot. Share with your team, board,
                    or advisors to align on expansion readiness.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                    <DownloadIcon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                    <MailIcon className="w-5 h-5 text-neutral-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-24 px-6">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              Clarity, not scores
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                <XIcon className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Not this</h3>
              <p className="text-neutral-600 text-sm">
                Generic readiness scores, one-size-fits-all checklists, or AI that
                pretends to know your business better than you do.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-accent-50 border border-accent-100">
              <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                <CheckIcon className="w-5 h-5 text-accent-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Instead, this</h3>
              <p className="text-neutral-600 text-sm">
                A clear view of what you&apos;re basing decisions on, so you can validate
                what needs validating and address what needs addressing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-wide mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              Built for Australian founders
            </h2>
            <p className="mt-4 text-neutral-600">
              Considering or preparing for U.S. market expansion.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <AudienceCard
              title="Founders"
              description="Evaluating U.S. entry timing and want clarity on what's validated vs. assumed."
            />
            <AudienceCard
              title="CEOs"
              description="Preparing for board discussions and need a defensible view of readiness."
            />
            <AudienceCard
              title="Expansion leads"
              description="Building the go-to-market case and identifying gaps early."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-content mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
            Ready to see where you stand?
          </h2>
          <p className="mt-4 text-neutral-600 mb-10">
            25 minutes. No scores. Just clarity.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center justify-center h-14 px-10 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-soft hover:shadow-medium text-base"
          >
            Start your assessment
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 px-6">
        <div className="max-w-wide mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">A</span>
                </div>
                <span className="text-sm font-medium text-neutral-600">Atlas by STX Labs</span>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-neutral-900 transition-colors">
                Terms
              </Link>
              <span>&copy; {new Date().getFullYear()} STX Labs</span>
            </div>
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
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-card hover:shadow-card-hover transition-shadow">
      <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ConfidenceIndicator({
  level,
  color,
}: {
  level: string;
  color: 'teal' | 'amber' | 'neutral';
}) {
  const colors = {
    teal: 'bg-accent-500',
    amber: 'bg-warm-500',
    neutral: 'bg-neutral-300',
  };

  const widths = {
    teal: 'w-full',
    amber: 'w-2/3',
    neutral: 'w-1/3',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500 w-16">{level}</span>
      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} ${widths[color]} rounded-full`} />
      </div>
    </div>
  );
}

// Icons
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
