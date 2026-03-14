import Link from 'next/link';
import { AtlasLogo } from '@/components/AtlasLogo';

export default function HowItWorksPage() {
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
              className="text-[#0A0A0A] text-[14px] font-medium hidden sm:inline"
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
      <section className="bg-white pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-6">
            How it works
          </p>
          <h1 className="text-[56px] md:text-[72px] lg:text-[88px] font-black text-[#0A0A0A] tracking-[-0.04em] leading-[0.9] max-w-[800px]">
            25 minutes.<br />
            <span className="text-[#2563EB]">Complete clarity.</span>
          </h1>
          <p className="mt-8 text-[#787671] text-[18px] md:text-[20px] max-w-[540px] leading-[1.5]">
            A structured conversation that separates what you know from what you assume.
            No forms. No checklists. No consultants.
          </p>
        </div>
      </section>

      {/* ─── THREE STEPS OVERVIEW ─── */}
      <section className="bg-[#F5F4EF] py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
            The process
          </p>
          <h2 className="text-[36px] md:text-[48px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05] mb-16 max-w-[560px]">
            Three steps. One clear picture.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <HowStep
              number="01"
              title="Have an honest conversation"
              description="Atlas asks the hard questions across 5 critical expansion domains. You answer in plain English. There are no right or wrong answers."
            />
            <HowStep
              number="02"
              title="See facts vs. assumptions"
              description="Every response is classified as High, Medium, or Low confidence. You see exactly what is validated and what still needs work."
            />
            <HowStep
              number="03"
              title="Walk away with a position"
              description="Your Readiness Report maps your strengths, your gaps, and a 90-day action plan. Built to hold up in investor conversations."
            />
          </div>
        </div>
      </section>

      {/* ─── STEP 1 DETAIL: THE CONVERSATION ─── */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
                Step 01
              </p>
              <h2 className="text-[36px] md:text-[48px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05] mb-6">
                A conversation, not a form.
              </h2>
              <p className="text-[#787671] text-[17px] leading-[1.6] mb-8">
                Atlas guides you through a natural conversation about your business. No
                preparation needed. Just answer honestly about what you know, what you have
                researched, and what you are still figuring out.
              </p>
              <ul className="space-y-4">
                {[
                  'Enter your email to start. No password, no account.',
                  'Your session saves automatically as you go.',
                  'Return within 30 days to pick up where you left off.',
                  'It is fine to say you do not know. That is valuable information too.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#787671] text-[15px]">
                    <span className="text-[#2563EB] shrink-0 mt-0.5">
                      <CheckIcon className="w-4 h-4" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-6">
                The 5 domains covered
              </p>
              {[
                { n: '01', name: 'Market', desc: 'Target customers, market size, competition, buying behaviour, timing.', color: '#2563EB' },
                { n: '02', name: 'Product', desc: 'U.S. fit, localisation, regulatory requirements, pricing strategy.', color: '#00C48C' },
                { n: '03', name: 'Go-to-Market', desc: 'Sales motion, channels, partnerships, demand generation.', color: '#FF4E28' },
                { n: '04', name: 'Operations', desc: 'U.S. legal structure, hiring, infrastructure, team readiness.', color: '#7B2FFF' },
                { n: '05', name: 'Financials', desc: 'Runway, unit economics, U.S. cost structures, risk exposure.', color: '#F5C400' },
              ].map((d) => (
                <div key={d.name} className="flex items-start gap-4 bg-[#F5F4EF] p-4 border-l-4" style={{ borderLeftColor: d.color }}>
                  <span className="text-[11px] font-bold shrink-0 pt-0.5" style={{ color: d.color }}>{d.n}</span>
                  <div>
                    <p className="text-[15px] font-bold text-[#0A0A0A] tracking-[-0.01em]">{d.name}</p>
                    <p className="text-[13px] text-[#787671] mt-0.5 leading-[1.4]">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STEP 2 DETAIL: CONFIDENCE CLASSIFICATION ─── */}
      <section className="bg-[#F5F4EF] py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

            <div className="space-y-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-6">
                Every response, classified
              </p>

              <ConfidenceCard
                level="High confidence"
                icon="★"
                color="#0F7B6C"
                bg="#DDEDEA"
                description="You have validated this with data, direct market research, or hands-on U.S. experience. This is a genuine strength."
                example="We have three signed U.S. LOIs from enterprise customers in the HR tech space."
              />
              <ConfidenceCard
                level="Medium confidence"
                icon="◑"
                color="#D9730D"
                bg="#FAEBDD"
                description="You have researched this but have not yet validated it in the U.S. market. Solid foundation, but needs proving."
                example="Our Australian pricing model should transfer, based on comparable SaaS benchmarks."
              />
              <ConfidenceCard
                level="Low confidence"
                icon="○"
                color="#787671"
                bg="#F1F0EC"
                description="This is an assumption or an unknown. Not a failure. Every company has these. The value is in seeing them clearly."
                example="We think U.S. enterprise buyers will respond to our self-serve motion."
              />
            </div>

            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
                Step 02
              </p>
              <h2 className="text-[36px] md:text-[48px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05] mb-6">
                Facts vs. assumptions. Made visible.
              </h2>
              <p className="text-[#787671] text-[17px] leading-[1.6] mb-6">
                Most tools give you a score. Atlas gives you something more useful: a clear
                view of what your readiness position is actually built on.
              </p>
              <p className="text-[#787671] text-[17px] leading-[1.6]">
                Every single response is classified by confidence level. You see where you
                are on solid ground and where you are working with assumptions that still
                need to be tested.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STEP 3 DETAIL: THE REPORT ─── */}
      <section className="bg-[#2563EB] py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#93BBFF] mb-4">
            Step 03
          </p>
          <h2 className="text-[36px] md:text-[48px] font-black text-white tracking-[-0.03em] leading-[1.05] mb-6 max-w-[600px]">
            Your Readiness Report. Investor-grade.
          </h2>
          <p className="text-white/70 text-[17px] leading-[1.6] max-w-[560px] mb-16">
            Once you reach sufficient coverage, Atlas synthesises everything into a
            Readiness Report: a structured document built to answer the hard questions
            before they are asked.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: '★',
                title: 'Confidence profile',
                desc: 'A breakdown of High, Medium, and Low confidence inputs across all 5 domains.',
              },
              {
                icon: '◎',
                title: 'Domain readiness',
                desc: 'Your standing in each domain. Strengths called out, gaps named directly.',
              },
              {
                icon: '→',
                title: '90-day action plan',
                desc: 'Prioritised steps mapped to your specific gaps. Not generic. Not vague.',
              },
              {
                icon: '↗',
                title: 'Exportable PDF',
                desc: 'Download or email a professional report to share with your board or investors.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-white/10 border border-white/20">
                <span className="text-[#93BBFF] text-[20px] mb-4 block">{item.icon}</span>
                <h3 className="text-[16px] font-bold text-white tracking-[-0.01em] mb-2">{item.title}</h3>
                <p className="text-white/70 text-[14px] leading-[1.5]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
            FAQ
          </p>
          <h2 className="text-[36px] md:text-[48px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05] mb-16 max-w-[560px]">
            Common questions, straight answers.
          </h2>

          <div className="max-w-[720px] divide-y divide-[#F1F0EC]">
            {[
              {
                q: 'How long does it take?',
                a: 'Most founders complete the assessment in 20 to 30 minutes. You can pause and return within 30 days without losing your progress.',
              },
              {
                q: 'Is this a score or a ranking?',
                a: 'Neither. This is not about passing or failing. It is about seeing clearly what your readiness position is built on. Every company has gaps. The goal is to name them before they cost you.',
              },
              {
                q: 'What happens to my data?',
                a: 'Your responses are stored securely and used only to generate your Readiness Report. We do not share your individual data with third parties.',
              },
              {
                q: 'Do I need to prepare anything?',
                a: 'Nothing. Just show up and answer honestly. If you do not know something, say so. Not knowing is useful information.',
              },
              {
                q: 'Who is this built for?',
                a: 'Australian founders, CEOs, and expansion leads who are evaluating or actively preparing for U.S. market entry.',
              },
              {
                q: 'Can I come back and add more context?',
                a: 'Yes. You can continue the conversation and add context as your thinking evolves. Your report updates to reflect the latest state of your responses.',
              },
            ].map((faq) => (
              <FAQ key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-[#2563EB] py-32 md:py-40 px-6">
        <div className="max-w-[1140px] mx-auto">
          <h2 className="text-[52px] md:text-[72px] font-black text-white tracking-[-0.04em] leading-[0.9] max-w-[640px] mb-10">
            Ready to see where you actually stand?
          </h2>
          <p className="text-white/70 text-[18px] max-w-[440px] leading-[1.5] mb-10">
            25 minutes. No account needed. No preparation required.
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
            <Link href="/how-it-works" className="hover:text-[#0A0A0A] transition-colors">How it works</Link>
            <Link href="/privacy" className="hover:text-[#0A0A0A] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#0A0A0A] transition-colors">Terms</Link>
            <span>&copy; {new Date().getFullYear()} STX Labs</span>
          </div>
        </div>
      </footer>

    </main>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

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

function ConfidenceCard({
  level,
  icon,
  color,
  bg,
  description,
  example,
}: {
  level: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
  example: string;
}) {
  return (
    <div className="p-5 bg-white border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[16px] font-bold"
          style={{ backgroundColor: bg, color }}
        >
          {icon}
        </span>
        <span className="text-[14px] font-bold tracking-[-0.01em]" style={{ color }}>
          {level}
        </span>
      </div>
      <p className="text-[#0A0A0A] text-[14px] leading-[1.5] mb-3">{description}</p>
      <div className="border-t border-[#F1F0EC] pt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#9B9A97] mb-1">Example</p>
        <p className="text-[13px] text-[#787671] italic leading-[1.4]">&ldquo;{example}&rdquo;</p>
      </div>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="py-7">
      <h3 className="text-[18px] font-bold text-[#0A0A0A] tracking-[-0.01em] mb-3">{question}</h3>
      <p className="text-[#787671] text-[15px] leading-[1.6]">{answer}</p>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
