import Link from 'next/link';

export default function HowItWorksPage() {
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

      {/* Hero */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            How It Works
          </h1>
          <p className="text-lg text-slate-500">
            A simple, conversational approach to understanding your U.S. expansion readiness.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-14">
            <Step
              number={1}
              title="Start with Your Email"
              description="Enter your email address to begin. No password needed. We'll use this to send your results and allow you to return to your session if you need to take a break."
              details={[
                "Your session is saved automatically as you go",
                "Come back anytime within 7 days to continue",
                "No account creation required"
              ]}
            />

            <Step
              number={2}
              title="Have a Conversation"
              description="Chat with our AI guide, Atlas, who will ask you questions about your business across five key domains. Just answer naturally. There are no right or wrong answers."
              details={[
                "Takes about 20-30 minutes to complete",
                "Answer in your own words or use quick-response buttons",
                "Skip questions if you're unsure. That's valuable data too"
              ]}
            />

            <Step
              number={3}
              title="Cover Five Domains"
              description="The conversation explores the critical areas that determine U.S. expansion success:"
            >
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <DomainCard
                  name="Market"
                  description="Target customers, market size, competitive landscape"
                />
                <DomainCard
                  name="Product"
                  description="Product-market fit, localization needs, regulatory requirements"
                />
                <DomainCard
                  name="Go-to-Market"
                  description="Sales strategy, channels, partnerships, pricing"
                />
                <DomainCard
                  name="Operations"
                  description="Legal structure, hiring, infrastructure, logistics"
                />
                <DomainCard
                  name="Financials"
                  description="Funding, runway, unit economics, investment needs"
                />
              </div>
            </Step>

            <Step
              number={4}
              title="Get Your Confidence Clarity"
              description="As you answer, Atlas classifies each input by confidence level. This isn't about judging you. It's about helping you see what's validated versus what needs more work."
            >
              <div className="mt-6 space-y-3">
                <ConfidenceLevel
                  level="High Confidence"
                  color="green"
                  description="Validated with data, research, or direct experience"
                />
                <ConfidenceLevel
                  level="Medium Confidence"
                  color="amber"
                  description="Researched but not yet validated in the U.S. market"
                />
                <ConfidenceLevel
                  level="Low Confidence"
                  color="red"
                  description="Assumptions or unknowns that need investigation"
                />
              </div>
            </Step>

            <Step
              number={5}
              title="Receive Your Snapshot"
              description="At the end, Atlas synthesizes everything into a Readiness Snapshot: a clear summary of where you stand."
              details={[
                "Key findings across all domains",
                "Your strengths (high confidence areas)",
                "Assumptions to validate (medium confidence)",
                "Gaps to address (low confidence areas)",
                "Recommended next steps"
              ]}
            />

            <Step
              number={6}
              title="Export and Share"
              description="Download your results as a professional PDF or have them emailed directly to you. Use this to align your team, prepare for board discussions, or guide your expansion planning."
              details={[
                "Clean, professional PDF format",
                "Email delivery with download link",
                "Share with advisors, investors, or team members"
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-14 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <FAQ
              question="How long does it take?"
              answer="Most people complete the assessment in 20-30 minutes. You can take breaks and return anytime within 7 days."
            />
            <FAQ
              question="Is this a score or ranking?"
              answer="No. This isn't about passing or failing. It's about gaining clarity on what you know versus what you're assuming. Every company has gaps. The goal is to see them clearly."
            />
            <FAQ
              question="What happens to my data?"
              answer="Your responses are stored securely and used only to generate your snapshot. We don't share your individual data with third parties. See our Privacy Policy for details."
            />
            <FAQ
              question="Can I edit my answers?"
              answer="Currently, you can't go back and edit previous answers, but you can clarify or add context as the conversation continues. We're working on adding edit functionality."
            />
            <FAQ
              question="Who should use this?"
              answer="This is designed for Australian companies considering or planning U.S. market expansion: founders, CEOs, expansion leads, or anyone driving the go-to-market strategy."
            />
            <FAQ
              question="What if I don't know an answer?"
              answer="That's perfectly fine! Not knowing is valuable information. It helps identify gaps in your planning. Just say you're unsure or skip the question."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-slate-500 mb-10">
            It takes about 20-30 minutes. No preparation needed. Just answer honestly.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-all btn-glow text-lg"
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

function Step({
  number,
  title,
  description,
  details,
  children,
}: {
  number: number;
  title: string;
  description: string;
  details?: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg">{number}</span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 mb-4">{description}</p>
        {details && (
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-500">
                <span className="text-primary mt-1">•</span>
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <h4 className="font-semibold text-slate-900 mb-1">{name}</h4>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

function ConfidenceLevel({
  level,
  color,
  description,
}: {
  level: string;
  color: 'green' | 'amber' | 'red';
  description: string;
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-800 border-green-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${colorClasses[color]}`}>
      <span className="font-medium whitespace-nowrap">{level}</span>
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
    <div className="pb-8 border-b border-slate-100 last:border-0 last:pb-0">
      <h3 className="font-semibold text-slate-900 mb-2 text-lg">{question}</h3>
      <p className="text-slate-500 leading-relaxed">{answer}</p>
    </div>
  );
}
