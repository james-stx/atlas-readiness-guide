import Link from 'next/link';
import type { ReactNode } from 'react';
import { AtlasLogo } from '@/components/AtlasLogo';
import { TOPIC_ROW_BLEND_FACTORS, blendTopicRowColor } from '@/lib/domain-colors';

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-[#F5F4EF] font-sans">

      {/* ─── Page header ─── */}
      <header className="bg-[#0A0A0A] px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AtlasLogo variant="blue" size={28} />
          <div>
            <p className="text-white font-bold text-[15px] tracking-[-0.01em]">Atlas</p>
            <p className="text-white/40 text-[11px] font-medium uppercase tracking-[0.08em]">Brand Style Guide</p>
          </div>
        </div>
        <Link href="/" className="text-white/40 text-[13px] hover:text-white/70 transition-colors">
          ← Back to site
        </Link>
      </header>

      <div className="max-w-[1100px] mx-auto px-8 py-16 space-y-20">

        {/* ─── COLORS ─── */}
        <Section label="01" title="Color System">

          <SubSection title="Marketing palette — dark">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Swatch bg="#0A0A0A" name="Ink" hex="#0A0A0A" textColor="text-white" note="Hero / CTA sections" />
              <Swatch bg="#111111" name="Ink 2" hex="#111111" textColor="text-white" note="Secondary dark sections" />
              <Swatch bg="#2563EB" name="Electric Blue" hex="#2563EB" textColor="text-white" note="Primary CTA / buttons" />
              <Swatch bg="#60A5FA" name="Sky Blue" hex="#60A5FA" textColor="text-[#0A0A0A]" note="Accent on dark bg" />
            </div>
          </SubSection>

          <SubSection title="Marketing palette — light">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Swatch bg="#F5F4EF" name="Off-White" hex="#F5F4EF" textColor="text-[#0A0A0A]" note="Light sections" border />
              <Swatch bg="#FFFFFF" name="White" hex="#FFFFFF" textColor="text-[#0A0A0A]" note="Content sections" border />
              <Swatch bg="#E8E6E1" name="Border" hex="#E8E6E1" textColor="text-[#0A0A0A]" note="Card borders" border />
              <Swatch bg="#787671" name="Secondary text" hex="#787671" textColor="text-white" note="Body copy" />
            </div>
          </SubSection>

          <SubSection title="Workspace semantic palette">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Swatch bg="#0F7B6C" name="Teal" hex="#0F7B6C" textColor="text-white" note="High confidence" />
              <Swatch bg="#D9730D" name="Orange" hex="#D9730D" textColor="text-white" note="Medium confidence" />
              <Swatch bg="#E03E3E" name="Red" hex="#E03E3E" textColor="text-white" note="Low confidence" />
              <Swatch bg="#2383E2" name="Legacy Blue" hex="#2383E2" textColor="text-white" note="DEPRECATED — use #2563EB" />
            </div>
          </SubSection>

          <SubSection title="Section sequence — dark / light alternation">
            <div className="flex flex-col rounded-xl overflow-hidden border border-[#E8E6E1]">
              {[
                { label: 'Header', bg: '#0A0A0A', text: 'text-white' },
                { label: 'Hero', bg: '#0A0A0A', text: 'text-white' },
                { label: 'Problem', bg: '#F5F4EF', text: 'text-[#0A0A0A]' },
                { label: 'How it works', bg: '#111111', text: 'text-white' },
                { label: 'Domains', bg: '#FFFFFF', text: 'text-[#0A0A0A]' },
                { label: 'What you get', bg: '#0A0A0A', text: 'text-white' },
                { label: 'VS Alternatives', bg: '#F5F4EF', text: 'text-[#0A0A0A]' },
                { label: 'Who it\'s for', bg: '#FFFFFF', text: 'text-[#0A0A0A]' },
                { label: 'Final CTA', bg: '#0A0A0A', text: 'text-white' },
                { label: 'Footer', bg: '#0A0A0A', text: 'text-white' },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{ backgroundColor: row.bg }}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <span className={`text-[13px] font-medium ${row.text}`}>{row.label}</span>
                  <span className={`text-[11px] font-mono ${row.text} opacity-50`}>{row.bg}</span>
                </div>
              ))}
            </div>
          </SubSection>
        </Section>

        {/* ─── TYPOGRAPHY ─── */}
        <Section label="02" title="Typography">

          <SubSection title="Font: Inter — weights 400 / 700 / 900">
            <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 space-y-8">

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Hero display — 100px / black / -0.04em / leading 0.9</p>
                <p className="text-[60px] sm:text-[80px] font-black text-[#0A0A0A] tracking-[-0.04em] leading-[0.9]">
                  The quick<br />brown fox.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Section headline — 52px / black / -0.03em / leading 1.05</p>
                <p className="text-[40px] sm:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.05]">
                  Most founders go<br />to the U.S. on<br />assumptions.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Card title — 22px / bold / -0.02em</p>
                <p className="text-[22px] font-bold text-[#0A0A0A] tracking-[-0.02em]">
                  Confidence classification
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Body large — 20px / regular / leading 1.5</p>
                <p className="text-[20px] text-[#787671] leading-[1.5] max-w-[560px]">
                  Atlas surfaces your validated knowledge from your assumptions — across every critical dimension of U.S. market entry.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Body — 15px / regular / leading 1.6</p>
                <p className="text-[15px] text-[#787671] leading-[1.6] max-w-[480px]">
                  Every response is classified: High confidence (validated with data), Medium (researched but unproven), Low (assumed). The first tool that makes this distinction explicit.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Section label — 12px / bold / uppercase / tracking 0.1em</p>
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">
                  How it works
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-3">Step number — 64px / black / ghosted (7% opacity)</p>
                <p className="text-[64px] font-black text-[#0A0A0A] opacity-[0.07] tracking-[-0.04em] leading-[1]">
                  01
                </p>
              </div>

            </div>
          </SubSection>

          {/* Type on dark */}
          <SubSection title="Type on dark backgrounds">
            <div className="bg-[#0A0A0A] rounded-xl p-8 space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-3">Primary — white</p>
                <p className="text-[32px] font-black text-white tracking-[-0.03em] leading-[1.05]">Your competition is already moving.</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-3">Accent — sky blue #60A5FA</p>
                <p className="text-[32px] font-black text-[#60A5FA] tracking-[-0.03em] leading-[1.05]">not knowing what they don&apos;t know.</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-3">Body — white/60</p>
                <p className="text-[16px] text-white/60 leading-[1.5]">Know if you are ready. 25 minutes. No account needed. Completely free.</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-3">Caption — white/30</p>
                <p className="text-[13px] text-white/30">No account needed · Takes 25 minutes</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-3">Section label on dark — sky blue</p>
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#60A5FA]">How it works</p>
              </div>
            </div>
          </SubSection>
        </Section>

        {/* ─── LOGO ─── */}
        <Section label="03" title="Logo">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#0A0A0A] rounded-xl p-8 flex flex-col items-start gap-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30">On dark — use &quot;blue&quot; variant</p>
              <div className="flex items-center gap-3">
                <AtlasLogo variant="blue" size={48} />
                <div>
                  <p className="text-white font-bold text-[20px] tracking-[-0.02em]">Atlas</p>
                  <p className="text-white/30 text-[13px]">by STX Labs</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <AtlasLogo variant="blue" size={32} />
                  <span className="text-white font-semibold text-[15px]">Atlas</span>
                </div>
                <div className="flex items-center gap-2">
                  <AtlasLogo variant="blue" size={22} />
                  <span className="text-white/50 text-[13px]">Atlas by STX Labs</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 flex flex-col items-start gap-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97]">On light — use &quot;dark&quot; variant</p>
              <div className="flex items-center gap-3">
                <AtlasLogo variant="dark" size={48} />
                <div>
                  <p className="text-[#0A0A0A] font-bold text-[20px] tracking-[-0.02em]">Atlas</p>
                  <p className="text-[#9B9A97] text-[13px]">by STX Labs</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <AtlasLogo variant="dark" size={32} />
                  <span className="text-[#37352F] font-semibold text-[15px]">Atlas</span>
                </div>
                <div className="flex items-center gap-2">
                  <AtlasLogo variant="dark" size={22} />
                  <span className="text-[#9B9A97] text-[13px]">Atlas by STX Labs</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── BUTTONS ─── */}
        <Section label="04" title="Buttons">
          <div className="grid sm:grid-cols-2 gap-4">

            <div className="bg-[#0A0A0A] rounded-xl p-8 space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30">On dark backgrounds</p>

              <div className="space-y-3">
                <p className="text-white/30 text-[11px]">Primary CTA — large</p>
                <button className="inline-flex items-center gap-2.5 px-10 py-5 bg-[#2563EB] text-white text-[18px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all active:scale-[0.98]">
                  Start your assessment
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-white/30 text-[11px]">Primary CTA — default</p>
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-[16px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all active:scale-[0.98]">
                  Start your assessment
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-white/30 text-[11px]">Ghost / nav</p>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-white/20 text-white text-[14px] font-medium rounded-lg hover:bg-white/[0.08] hover:border-white/30 transition-all">
                  Start assessment
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97]">On light backgrounds</p>

              <div className="space-y-3">
                <p className="text-[#9B9A97] text-[11px]">Primary CTA</p>
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-[16px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all active:scale-[0.98]">
                  Start your assessment
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-[#9B9A97] text-[11px]">Secondary / ghost</p>
                <button className="inline-flex items-center gap-2 px-8 py-3 border border-[#E8E6E1] text-[#0A0A0A] text-[15px] font-medium rounded-xl hover:border-[#D4D1CB] hover:bg-[#F5F4EF] transition-all">
                  See how it works
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-[#9B9A97] text-[11px]">Badge / pill</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
                  <span className="text-[#60A5FA] text-[12px] font-medium tracking-wide">AI-powered expansion readiness</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── CARDS ─── */}
        <Section label="05" title="Cards">
          <div className="space-y-6">

            <SubSection title="Domain card (light sections)">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { n: '01', name: 'Market', desc: 'Target customer definition, addressable market size, competitive positioning, buying behaviour.' },
                  { n: '02', name: 'Product', desc: 'U.S. product-market fit, localisation requirements, regulatory compliance, feature differentiation.' },
                  { n: '03', name: 'Go-to-Market', desc: 'Sales motion, channel strategy, partnership landscape, demand generation.' },
                ].map((c) => (
                  <div key={c.name} className="p-6 border border-[#E8E6E1] rounded-xl bg-white hover:border-[#D4D1CB] hover:shadow-sm transition-all">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97]">{c.n}</span>
                    <h3 className="text-[22px] font-bold text-[#0A0A0A] tracking-[-0.02em] mt-2 mb-3">{c.name}</h3>
                    <p className="text-[#787671] text-[14px] leading-[1.5]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Output card (dark sections)">
              <div className="bg-[#0A0A0A] rounded-xl p-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: '★', title: 'Confidence classification', desc: 'Every input categorised as High, Medium, or Low confidence.' },
                    { icon: '→', title: '90-day action plan', desc: 'Prioritised actions mapped to your specific gaps.' },
                  ].map((c) => (
                    <div key={c.title} className="p-7 border border-white/10 rounded-xl">
                      <span className="text-[#60A5FA] text-[20px] mb-5 block">{c.icon}</span>
                      <h3 className="text-[18px] font-bold text-white tracking-[-0.02em] mb-2">{c.title}</h3>
                      <p className="text-white/50 text-[14px] leading-[1.6]">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SubSection>

            <SubSection title="Comparison cards">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="p-8 bg-white rounded-2xl border border-[#E8E6E1]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9B9A97] mb-6">Generic alternatives</p>
                  <ul className="space-y-4">
                    {['Same checklist for every company', 'Scores without explanation', 'No fact vs. assumption layer'].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[#787671] text-[15px]">
                        <span className="text-[#D4D1CB] text-[20px] leading-[1] shrink-0">×</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-[#0A0A0A] rounded-2xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#60A5FA] mb-6">Atlas</p>
                  <ul className="space-y-4">
                    {['Conversation shaped by your answers', 'Confidence classification, not a score', 'Separates validated facts from assumptions'].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-white text-[15px]">
                        <span className="text-[#60A5FA] text-[20px] leading-[1] shrink-0">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SubSection>

            <SubSection title="Audience card (light sections)">
              <div className="grid sm:grid-cols-3 gap-4">
                {['Founders', 'CEOs', 'Expansion leads'].map((a) => (
                  <div key={a} className="p-6 border border-[#E8E6E1] rounded-xl hover:border-[#D4D1CB] transition-all bg-white">
                    <h3 className="text-[22px] font-bold text-[#0A0A0A] tracking-[-0.02em] mb-3">{a}</h3>
                    <p className="text-[#787671] text-[15px] leading-[1.5]">Evaluating U.S. entry timing and want clarity before committing capital.</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </div>
        </Section>

        {/* ─── HOW IT WORKS STEPS ─── */}
        <Section label="06" title="How it works steps">
          <div className="bg-[#111111] rounded-xl p-10">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { n: '01', t: 'Have an honest conversation', d: 'Atlas asks the hard questions. You answer in plain English. No forms. No checklists.' },
                { n: '02', t: 'See facts vs. assumptions', d: 'Every response is classified: High, Medium, or Low confidence. The first tool that makes this explicit.' },
                { n: '03', t: 'Walk away with a position', d: 'Your Readiness Report summarises strengths, gaps, and a 90-day action plan.' },
              ].map((s) => (
                <div key={s.n}>
                  <p className="text-[64px] font-black text-white/[0.07] tracking-[-0.04em] leading-[1] mb-4 select-none">{s.n}</p>
                  <h3 className="text-[20px] font-bold text-white tracking-[-0.02em] leading-[1.2] mb-3">{s.t}</h3>
                  <p className="text-white/50 text-[15px] leading-[1.6]">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── STATS BLOCK ─── */}
        <Section label="07" title="Stats / divider block">
          <div className="rounded-xl overflow-hidden border border-[#E8E6E1]">
            <div className="grid md:grid-cols-3 gap-px bg-[#E8E6E1]">
              {[
                { v: '25 min', l: 'to complete a full expansion readiness assessment' },
                { v: '5 domains', l: 'of market entry mapped across 25 critical topics' },
                { v: '3 levels', l: 'confidence classification on every single input' },
              ].map((s) => (
                <div key={s.v} className="bg-[#F5F4EF] px-8 py-10">
                  <p className="text-[40px] md:text-[52px] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1]">{s.v}</p>
                  <p className="mt-2 text-[#787671] text-[14px] leading-[1.4]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── SECTION LABELS ─── */}
        <Section label="08" title="Section labels">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B9A97] mb-2">On light backgrounds — Electric Blue</p>
              {['The problem', 'Coverage', 'Why Atlas', 'Built for', 'How it works'].map((l) => (
                <p key={l} className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">{l}</p>
              ))}
            </div>
            <div className="bg-[#0A0A0A] rounded-xl p-8 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/30 mb-2">On dark backgrounds — Sky Blue</p>
              {['How it works', 'Your output', 'Coverage'].map((l) => (
                <p key={l} className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#60A5FA]">{l}</p>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── WORKSPACE DESIGN SYSTEM ─── */}
        <Section label="09" title="Workspace Design System">

          <SubSection title="Topic accordion rows — dark-blend toward #0A0A0A. White text readable on every row of every domain.">
            <div className="space-y-3">
              {([
                { domain: 'Market',     key: 'market'     as const, primary: '#2563EB' },
                { domain: 'Product',    key: 'product'    as const, primary: '#00C48C' },
                { domain: 'GTM',        key: 'gtm'        as const, primary: '#FF4E28' },
                { domain: 'Operations', key: 'operations' as const, primary: '#7B2FFF' },
                { domain: 'Financials', key: 'financials' as const, primary: '#F5C400' },
              ]).map((d) => (
                <div key={d.domain}>
                  <p className="text-[11px] font-bold text-[#9B9A97] mb-1">{d.domain}</p>
                  <div className="rounded-xl overflow-hidden">
                    {TOPIC_ROW_BLEND_FACTORS[d.key].map((factor, i) => {
                      const bg = blendTopicRowColor(d.primary, factor);
                      return (
                        <div
                          key={i}
                          style={{ backgroundColor: bg }}
                          className="flex items-center justify-between px-10 py-4"
                        >
                          <span className="text-[15px] font-bold text-white tracking-[-0.02em]">
                            Topic {i + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-white/40 font-mono">factor {factor}</span>
                            <span className="inline-flex items-center bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#787671]">
                              Not Started
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection title="Status pills — solid bg-white, semantic text color. Always readable on any dark row background.">
            <div className="flex flex-wrap gap-3 p-6 rounded-xl" style={{ backgroundColor: blendTopicRowColor('#2563EB', 0.44) }}>
              <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#787671]">
                Not Started
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#D9730D]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9730D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9730D]" />
                </span>
                In Progress
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#0F7B6C]">
                ★ High
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#D9730D]">
                ◑ Medium
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#E03E3E]">
                ○ Low
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9B9A97]">
                Skipped
              </span>
            </div>
          </SubSection>

          <SubSection title="Confidence badges — solid flat">
            <div className="flex flex-wrap gap-3 bg-white border border-[#E8E6E1] p-6 rounded-xl">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] bg-[#0F7B6C] text-white">High</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] bg-[#D9730D] text-white">Medium</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] bg-[#E03E3E] text-white">Low</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] bg-[#E8E6E1] text-[#787671]">Not Started</span>
            </div>
          </SubSection>

          <SubSection title="Confidence dots — brand hex fill, empty bg-[#E8E6E1]">
            <div className="flex items-center gap-8 bg-white border border-[#E8E6E1] p-6 rounded-xl">
              <div className="flex flex-col items-start gap-2">
                <span className="text-[11px] text-[#9B9A97]">High</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: '#0F7B6C' }} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-[11px] text-[#9B9A97]">Medium</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: i <= 2 ? '#D9730D' : '#E8E6E1' }} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-[11px] text-[#9B9A97]">Low</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: i <= 1 ? '#E03E3E' : '#E8E6E1' }} />
                  ))}
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection title="Sidebar domain items — domains only, selected left border">
            <div className="bg-white border border-[#E8E6E1] rounded-xl overflow-hidden">
              {[
                { domain: 'Market', color: '#2563EB', count: '3/5', selected: true, status: 'in_progress' },
                { domain: 'Product', color: '#00C48C', count: '5/5', selected: false, status: 'adequate' },
                { domain: 'GTM', color: '#FF4E28', count: '0/5', selected: false, status: 'not_started' },
              ].map((d) => (
                <div
                  key={d.domain}
                  className="flex items-center h-[40px] mx-1 px-2 rounded-[3px]"
                  style={d.selected ? { backgroundColor: `${d.color}0F`, borderLeft: `2px solid ${d.color}` } : undefined}
                >
                  <span
                    className="h-2 w-2 rounded-full mr-2 shrink-0"
                    style={{
                      backgroundColor: d.status === 'adequate' ? '#35A552' : d.status === 'in_progress' ? '#CB7B3E' : '#91918E',
                    }}
                  />
                  <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.08em] truncate" style={{ color: d.color }}>
                    {d.domain}
                  </span>
                  <span className="text-[11px] tabular-nums text-[#C1BFBC]">{d.count}</span>
                </div>
              ))}
            </div>
          </SubSection>

        </Section>

        {/* ─── VOICE & TONE ─── */}
        <Section label="10" title="Voice &amp; Tone">
          <div className="bg-white rounded-xl border border-[#E8E6E1] divide-y divide-[#F1F0EC] overflow-hidden">
            {[
              { label: 'Headline style', do: '"Most founders go to the U.S. on assumptions."', dont: '"Discover your readiness potential."' },
              { label: 'Body style', do: '"See exactly what is validated and what is assumed."', dont: '"Atlas leverages AI to help you harness your readiness."' },
              { label: 'CTA style', do: '"Start your assessment"', dont: '"Begin your journey"' },
              { label: 'Problem framing', do: 'State the uncomfortable truth bluntly', dont: 'Soften with qualifiers ("potentially", "can help")' },
              { label: 'Punctuation', do: 'Short sentences. Active voice. Second person.', dont: 'Em dashes — like this. Passive constructions.' },
            ].map((row) => (
              <div key={row.label} className="grid sm:grid-cols-3 gap-4 px-6 py-5">
                <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#9B9A97]">{row.label}</p>
                <div className="flex items-start gap-2">
                  <span className="text-[#0F7B6C] text-[16px] leading-[1.3] shrink-0">✓</span>
                  <p className="text-[14px] text-[#0A0A0A] leading-[1.5]">{row.do}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#E03E3E] text-[16px] leading-[1.3] shrink-0">×</span>
                  <p className="text-[14px] text-[#787671] leading-[1.5]">{row.dont}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </main>
  );
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-8 pb-4 border-b border-[#E8E6E1]">
        <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB]">{label}</span>
        <h2 className="text-[28px] font-black text-[#0A0A0A] tracking-[-0.03em]">{title}</h2>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[12px] font-bold text-[#9B9A97] mb-4">{title}</p>
      {children}
    </div>
  );
}

function Swatch({
  bg,
  name,
  hex,
  textColor,
  note,
  border,
}: {
  bg: string;
  name: string;
  hex: string;
  textColor: string;
  note?: string;
  border?: boolean;
}) {
  return (
    <div className={`rounded-xl overflow-hidden ${border ? 'border border-[#E8E6E1]' : ''}`}>
      <div
        className="h-20"
        style={{ backgroundColor: bg }}
      />
      <div className="bg-white border-t border-[#F1F0EC] px-3 py-2.5">
        <p className="text-[13px] font-semibold text-[#0A0A0A]">{name}</p>
        <p className="text-[11px] font-mono text-[#9B9A97]">{hex}</p>
        {note && <p className="text-[10px] text-[#9B9A97] mt-0.5">{note}</p>}
      </div>
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
