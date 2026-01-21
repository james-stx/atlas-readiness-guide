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
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6 leading-tight">
            Know What You Know.
            <br />
            <span className="text-primary">Clarify What You&apos;re Assuming.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            A 20-30 minute AI-guided conversation to assess your readiness for
            U.S. market expansion. No scores. No rankings. Just clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/start"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Begin Your Assessment
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

      {/* Features */}
      <section className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            What You&apos;ll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="💬"
              title="Guided Conversation"
              description="An AI-powered dialogue that adapts to your responses across 5 key readiness domains."
            />
            <FeatureCard
              icon="🎯"
              title="Confidence Clarity"
              description="See which of your inputs are validated facts vs. assumptions that need testing."
            />
            <FeatureCard
              icon="📄"
              title="Board-Ready Snapshot"
              description="Export a professional PDF summarizing your strengths, assumptions, and gaps."
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
            We&apos;ll explore your readiness across the critical areas that
            determine U.S. expansion success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Market', 'Product', 'Go-to-Market', 'Operations', 'Financials'].map(
              (domain) => (
                <div
                  key={domain}
                  className="px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-medium"
                >
                  {domain}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} STX Labs. All rights reserved.
          </p>
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}
