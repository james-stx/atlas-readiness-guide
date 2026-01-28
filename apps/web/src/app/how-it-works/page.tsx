import Link from 'next/link';

export default function HowItWorksPage() {
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

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-content mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
            How it works
          </h1>
          <p className="mt-4 text-lg text-neutral-500">
            A simple, conversational approach to understanding your readiness.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-0">
            <Step
              number={1}
              title="Start with your email"
              description="Enter your email address to begin. No password needed. We use this to save your progress and send your results."
              details={[
                'Your session saves automatically as you go',
                'Return anytime within 30 days to continue',
                'No account creation required',
              ]}
              isLast={false}
            />

            <Step
              number={2}
              title="Have a conversation"
              description="Chat with Atlas, our AI guide. Answer questions about your business naturally. There are no right or wrong answers."
              details={[
                'Takes about 25 minutes to complete',
                'Answer in your own words',
                "It's okay to say you don't know",
              ]}
              isLast={false}
            />

            <Step
              number={3}
              title="Cover five domains"
              description="The conversation explores the critical areas that determine expansion success:"
              isLast={false}
            >
              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <DomainCard name="Market" description="Target customers, size, competition" />
                <DomainCard name="Product" description="Fit, localization, regulatory needs" />
                <DomainCard name="Go-to-Market" description="Sales strategy, channels, partnerships" />
                <DomainCard name="Operations" description="Legal structure, hiring, infrastructure" />
                <DomainCard name="Financials" description="Funding, runway, unit economics" />
              </div>
            </Step>

            <Step
              number={4}
              title="Get confidence clarity"
              description="As you answer, Atlas classifies each input by confidence level. This helps you see what's validated versus what needs more work."
              isLast={false}
            >
              <div className="mt-5 space-y-3">
                <ConfidenceLevel
                  level="High"
                  color="teal"
                  description="Validated with data, research, or direct experience"
                />
                <ConfidenceLevel
                  level="Medium"
                  color="amber"
                  description="Researched but not yet validated in the U.S. market"
                />
                <ConfidenceLevel
                  level="Low"
                  color="neutral"
                  description="Assumptions or unknowns that need investigation"
                />
              </div>
            </Step>

            <Step
              number={5}
              title="Receive your snapshot"
              description="Atlas synthesizes everything into a Readiness Snapshot: a clear summary of where you stand."
              details={[
                'Key findings across all domains',
                'Your strengths (high confidence areas)',
                'Assumptions to validate',
                'Gaps to address',
                'Recommended next steps',
              ]}
              isLast={false}
            />

            <Step
              number={6}
              title="Export and share"
              description="Download your results as a professional PDF or have them emailed. Use this to align your team, board, or advisors."
              details={[
                'Clean, professional PDF format',
                'Email delivery option',
                'Share with stakeholders',
              ]}
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-content mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            <FAQ
              question="How long does it take?"
              answer="Most people complete the assessment in 20-30 minutes. You can take breaks and return anytime within 30 days."
            />
            <FAQ
              question="Is this a score or ranking?"
              answer="No. This isn't about passing or failing. It's about gaining clarity on what you know versus what you're assuming. Every company has gaps. The goal is to see them clearly."
            />
            <FAQ
              question="What happens to my data?"
              answer="Your responses are stored securely and used only to generate your snapshot. We don't share your individual data with third parties."
            />
            <FAQ
              question="Can I edit my answers?"
              answer="You can clarify or add context as the conversation continues. We're working on adding edit functionality for previous answers."
            />
            <FAQ
              question="Who should use this?"
              answer="This is designed for Australian companies considering or planning U.S. market expansion: founders, CEOs, expansion leads, or anyone driving the go-to-market strategy."
            />
            <FAQ
              question="What if I don't know an answer?"
              answer="That's perfectly fine. Not knowing is valuable information. It helps identify gaps in your planning. Just say you're unsure."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="max-w-content mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-4 text-neutral-500 mb-10">
            25 minutes. No preparation needed. Just answer honestly.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-soft hover:shadow-medium"
          >
            Start your assessment
            <ArrowRightIcon className="ml-2 w-4 h-4" />
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

function Step({
  number,
  title,
  description,
  details,
  children,
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  details?: string[];
  children?: React.ReactNode;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-6 pb-12">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-5 top-12 w-px h-[calc(100%-48px)] bg-neutral-200" />
      )}

      {/* Step number */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{number}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
        {details && (
          <ul className="mt-4 space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-neutral-500">
                <span className="text-accent-500 mt-1">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
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
    <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-card">
      <h4 className="font-medium text-neutral-900 mb-1 text-sm">{name}</h4>
      <p className="text-xs text-neutral-500">{description}</p>
    </div>
  );
}

function ConfidenceLevel({
  level,
  color,
  description,
}: {
  level: string;
  color: 'teal' | 'amber' | 'neutral';
}) {
  const colorClasses = {
    teal: 'bg-accent-50 border-accent-200 text-accent-700',
    amber: 'bg-warm-50 border-warm-200 text-warm-700',
    neutral: 'bg-neutral-50 border-neutral-200 text-neutral-600',
  };

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg border ${colorClasses[color]}`}>
      <span className="font-medium text-sm w-16">{level}</span>
      <span className="text-sm opacity-80">{description}</span>
    </div>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="pb-8 border-b border-neutral-100 last:border-0 last:pb-0">
      <h3 className="font-medium text-neutral-900 mb-2">{question}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
