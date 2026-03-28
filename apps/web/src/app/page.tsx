import Link from 'next/link';
import type { ReactNode } from 'react';
import { AtlasLogo } from '@/components/AtlasLogo';

const DOMAIN_PILLS = [
  { name: 'Market', bg: 'bg-[#2563EB]', text: 'text-white' },
  { name: 'Product', bg: 'bg-[#00C48C]', text: 'text-white' },
  { name: 'Go-to-Market', bg: 'bg-[#FF4E28]', text: 'text-white' },
  { name: 'Operations', bg: 'bg-[#7B2FFF]', text: 'text-white' },
  { name: 'Financials', bg: 'bg-[#F5C400]', text: 'text-[#0A0A0A]' },
];

const DOMAIN_COLORS = ['#2563EB', '#00C48C', '#FF4E28', '#7B2FFF', '#F5C400'];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8E6E1]">
        <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <AtlasLogo variant="dark" size={28} />
            <span className="text-[#0A0A0A] font-semibold text-[15px] tracking-[-0.01em]">Atlas</span>
            <span className="text-[#9B9A97] text-[13px] hidden sm:inline">by STX Labs</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-8">
            <Link
              href="/how-it-works"
              className="text-[#787671] text-[14px] hover:text-[#0A0A0A] transition-colors hidden sm:inline"
            >
              How it works
            </Link>
            <Link
              href="/start"
              className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#0A0A0A] text-[#0A0A0A] text-[14px] font-medium rounded-lg hover:bg-[#0A0A0A] hover:text-white transition-all"
            >
              Start assessment
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="bg-white pt-20 pb-28 md:pt-28 md:pb-36 px-6">
        <div className="max-w-[1140px] mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            <span className="text-[#2563EB] text-[12px] font-medium tracking-wide">
              AI-powered expansion readiness
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[64px] md:text-[80px] lg:text-[100px] font-black text-[#0A0A0A] tracking-[-0.04em] leading-[0.9] max-w-[900px]">
            Your Readiness.<br />
            <span className="text-[#2563EB]">Revealed.</span>
          </h1>

          {/* Subhead */}
          <p className="mt-8 text-[#787671] text-[18px] md:text-[20px] max-w-[560px] leading-[1.5]">
            Somewhere in your U.S. expansion plan, there are gaps you haven&apos;t
            found yet. Atlas tells you exactly where, before you land.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-[16px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all active:scale-[0.98]"
            >
              Start your assessment
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <span className="text-[#9B9A97] text-[13px]">
              No commitment. No consultant. No cost.
            </span>
          </div>

          {/* Domain pills */}
          <div className="mt-14 flex flex-wrap gap-2">
            {DOMAIN_PILLS.map((pill) => (
              <span
                key={pill.name}
                className={`px-3 py-1.5 ${pill.bg} ${pill.text} text-[12px] font-semibold rounded-full`}
              >
                {pill.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="bg-[#F5F4EF] py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="max-w-[800px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-6">
              The problem
            </p>
            <h2 className="text-[36px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05]">
              Going in without a clear picture of your readiness isn&apos;t bold.
              It&apos;s just expensive.
            </h2>
            <p className="mt-6 text-[#787671] text-[18px] leading-[1.6] max-w-[600px]">
              The questions that matter: whether your product fits, whether your
              GTM holds, whether your runway covers the gap. Those questions have answers. Getting
              to them through consultants or proper research takes months and costs
              more than most early-stage companies can justify. So teams move
              anyway. And find out in the market, when the cost of being wrong is
              highest.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid md:grid-cols-3 gap-px bg-[#E8E6E1]">
            <StatBlock value="$50K+" label="what a consultant-led expansion readiness engagement typically costs" />
            <StatBlock value="6–12 months" label="before most founders get real market feedback after committing to the U.S." />
            <StatBlock value="Free" label="what Atlas costs. No consultant, no agency, no wait." />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-24 md:py-32 px-6 border-t border-[#E8E6E1]">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
            How it works
          </p>
          <h2 className="text-[36px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.0] mb-16 max-w-[600px]">
            Conversation.<br />Evaluation.<br />Clarity.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <HowStep
              number="01"
              title="Have an honest conversation"
              description="Atlas asks the hard questions most founders haven't been asked. You answer in plain English. No scoring rubrics, no trick questions, no forms."
            />
            <HowStep
              number="02"
              title="Get an honest evaluation"
              description="Your answers are assessed against what U.S. expansion actually requires. Atlas tells you where you're genuinely prepared, where you're working from assumption, and where the gaps are real enough to change your outcome."
            />
            <HowStep
              number="03"
              title="Leave with a position, not a score"
              description="Your Readiness Report names what you're ready to move on, what to address before you land, and where to focus your first 90 days. Specific gaps. Concrete next steps. Not a number."
            />
          </div>
        </div>
      </section>

      {/* ─── 5 DOMAINS ─── */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
                Coverage
              </p>
              <h2 className="text-[36px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05]">
                5 domains.<br />25 topics.
              </h2>
            </div>
            <p className="text-[#787671] text-[16px] max-w-[380px] leading-[1.5]">
              Most expansion mistakes happen in one of these five areas. Atlas
              helps you understand exactly where you sit across all of them,
              before you discover the gaps in market.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DomainCard
              number="01"
              name="Market"
              topics={['Why expand to the U.S.?', 'Target customer profile', 'Market size estimate', 'Competitive landscape', 'Existing U.S. presence']}
              color={DOMAIN_COLORS[0]}
            />
            <DomainCard
              number="02"
              name="Product"
              topics={['What you\'re selling', 'Fit for U.S. market', 'Localisation needs', 'Competitive advantage', 'Product-market fit evidence']}
              color={DOMAIN_COLORS[1]}
            />
            <DomainCard
              number="03"
              name="Go-to-Market"
              topics={['Go-to-market approach', 'U.S. sales presence', 'Pricing strategy', 'Marketing channels', 'Sales cycle expectations']}
              color={DOMAIN_COLORS[2]}
            />
            <DomainCard
              number="04"
              name="Operations"
              topics={['Customer support coverage', 'U.S. legal entity', 'Compliance & security', 'Technical infrastructure', 'U.S. partnerships']}
              color={DOMAIN_COLORS[3]}
            />
            <DomainCard
              number="05"
              name="Financials"
              topics={['Expansion budget', 'Runway impact', 'Funding status', 'Revenue expectations', 'Break-even timeline']}
              color={DOMAIN_COLORS[4]}
            />
            <div className="hidden lg:flex flex-col items-start justify-end p-6 bg-[#F5F4EF]">
              <p className="text-[#9B9A97] text-[14px] leading-[1.6]">
                Atlas evaluates your responses across all five domains and
                produces a personalised assessment of where you&apos;re ready
                to move and where you need to build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU GET ─── */}
      <section className="bg-[#2563EB] py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#93BBFF] mb-4">
            Your output
          </p>
          <h2 className="text-[36px] md:text-[52px] font-black text-white tracking-[-0.03em] leading-[1.05] mb-16 max-w-[600px]">
            A clear picture of where you stand, and what to do next.
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <OutputCard
              icon={<StarIcon />}
              title="What you know vs. what you're assuming"
              description="Every topic across all five domains, assessed. You'll see exactly where your confidence is grounded in evidence, and where you're making assumptions that still need to be tested."
            />
            <OutputCard
              icon={<CircleIcon />}
              title="Your readiness across every dimension"
              description="A structured view of where you're ready to move and where you need to build, across market, product, GTM, operations, and financials."
            />
            <OutputCard
              icon={<ArrowRightIcon className="w-5 h-5" />}
              title="A 90-day focus plan"
              description="Your biggest gaps, ranked by urgency. Each one comes with a concrete next step. Not generic advice, but actions specific to what your assessment revealed."
            />
            <OutputCard
              icon={<UploadIcon />}
              title="Shareable PDF report"
              description="A structured document to share with your team, advisors, or board. Your current position and the gaps you're working to close, clearly laid out."
            />
          </div>
        </div>
      </section>

      {/* ─── VS ALTERNATIVES ─── */}
      <section className="bg-[#F5F4EF] py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
            Why Atlas
          </p>
          <h2 className="text-[36px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05] mb-12">
            Not another readiness checklist.
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Bad column */}
            <div className="p-8 bg-[#F5F4EF]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9B9A97] mb-6">
                Generic alternatives
              </p>
              <ul className="space-y-5">
                {[
                  'Same checklist for every company',
                  'Scores that don\'t explain the why',
                  'No distinction between fact and assumption',
                  'One-time snapshot with no actionable guidance',
                  'Consultants that cost $50K+ for the same output',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#787671] text-[15px]">
                    <span className="text-[#D4D1CB] text-[20px] leading-[1] shrink-0">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Good column */}
            <div className="p-8 bg-[#2563EB]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#93BBFF] mb-6">
                Atlas
              </p>
              <ul className="space-y-5">
                {[
                  'A conversation that adapts to your actual situation',
                  'A clear evaluation of where you stand, not an arbitrary score',
                  'Every gap named, with a concrete path forward',
                  'A 90-day plan built around your specific readiness profile',
                  'Free to start. No consultant required.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white text-[15px]">
                    <span className="text-[#93BBFF] text-[20px] leading-[1] shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="bg-white py-24 md:py-28 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
            Built for
          </p>
          <h2 className="text-[36px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05] mb-12">
            Australian founders<br />going global.
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <AudienceCard
              title="Founders"
              description="Evaluating U.S. entry timing and want clarity on what is validated vs. assumed before committing capital."
            />
            <AudienceCard
              title="CEOs"
              description="Preparing for board and investor discussions. Need a defensible, well-structured readiness narrative."
            />
            <AudienceCard
              title="Expansion leads"
              description="Building the GTM case and identifying gaps early. Wants evidence, not intuition."
            />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-[#2563EB] py-32 md:py-40 px-6">
        <div className="max-w-[1140px] mx-auto">
          <h2 className="text-[52px] md:text-[72px] lg:text-[88px] font-black text-white tracking-[-0.04em] leading-[0.9] max-w-[720px] mb-10">
            Your competition is already moving.
          </h2>
          <p className="text-white/70 text-[18px] max-w-[480px] leading-[1.5] mb-10">
            Find out where you stand before the market does. No account needed.
            Always free.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2.5 px-10 py-5 bg-white text-[#2563EB] text-[18px] font-semibold rounded-xl hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            Start your assessment
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-[#E8E6E1] py-10 px-6">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <AtlasLogo variant="dark" size={22} />
            <span className="text-[#9B9A97] text-[13px] font-medium">Atlas by STX Labs</span>
          </Link>
          <div className="flex items-center gap-6 text-[13px] text-[#9B9A97]">
            <Link href="/how-it-works" className="hover:text-[#0A0A0A] transition-colors">
              How it works
            </Link>
            <Link href="/privacy" className="hover:text-[#0A0A0A] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#0A0A0A] transition-colors">
              Terms
            </Link>
            <span>&copy; {new Date().getFullYear()} STX Labs</span>
          </div>
        </div>
      </footer>

    </main>
  );
}

// ─── Section components ───────────────────────────────────────────────────────

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#F5F4EF] px-8 py-10">
      <p className="text-[40px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1]">
        {value}
      </p>
      <p className="mt-2 text-[#787671] text-[14px] leading-[1.4]">{label}</p>
    </div>
  );
}

function HowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[64px] font-black text-[#0A0A0A]/[0.10] tracking-[-0.04em] leading-[1] mb-4 select-none">
        {number}
      </p>
      <h3 className="text-[20px] font-bold text-[#0A0A0A] tracking-[-0.02em] leading-[1.2] mb-3">
        {title}
      </h3>
      <p className="text-[#787671] text-[15px] leading-[1.6]">{description}</p>
    </div>
  );
}

function DomainCard({
  number,
  name,
  topics,
  color,
}: {
  number: string;
  name: string;
  topics: string[];
  color: string;
}) {
  return (
    <div className="bg-[#F5F4EF] p-6 border-l-4" style={{ borderLeftColor: color }}>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color }}>
        {number}
      </span>
      <h3 className="text-[22px] font-black text-[#0A0A0A] tracking-[-0.02em] mt-2 mb-3">
        {name}
      </h3>
      <ul className="space-y-1">
        {topics.map((topic) => (
          <li key={topic} className="flex items-start gap-2 text-[#787671] text-[13px] leading-[1.4]">
            <span className="text-[#9B9A97] shrink-0 mt-[2px]">·</span>
            <span>{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OutputCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-7 bg-white/10 border border-white/20">
      <span className="text-[#93BBFF] mb-5 block">{icon}</span>
      <h3 className="text-[18px] font-bold text-white tracking-[-0.02em] mb-2">{title}</h3>
      <p className="text-white/70 text-[14px] leading-[1.6]">{description}</p>
    </div>
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
    <div className="p-6 bg-[#F5F4EF]">
      <h3 className="text-[22px] font-black text-[#0A0A0A] tracking-[-0.02em] mb-3">{title}</h3>
      <p className="text-[#787671] text-[15px] leading-[1.5]">{description}</p>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}
