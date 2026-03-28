import type { DomainType } from '@atlas/types';

export interface DomainColorScheme {
  primary: string;
  light: string;
  medium: string;
  dark: string;
  textOnPrimary: string;
  headerBg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textDark: string;
  progressBar: string;
  buttonBg: string;
  buttonHover: string;
  dotBg: string;
  selectedBg: string;
  selectedBorder: string;
  ringColor: string;
  whyBg: string;
  whyHeader: string;
}

/**
 * Per-domain blend factors for topic accordion rows.
 * Each row blends the domain primary toward #0A0A0A (brand black).
 * factor=1.0 → pure domain color, factor=0 → #0A0A0A.
 *
 * Regular domains: rich color at top, deepens to near-black at bottom.
 * Financials: starts darker to avoid bright-yellow low-contrast at full opacity.
 * All resulting backgrounds maintain WCAG AA contrast with white text.
 */
export const TOPIC_ROW_BLEND_FACTORS: Record<DomainType, readonly [number, number, number, number, number]> = {
  market:     [0.82, 0.62, 0.44, 0.30, 0.18],
  product:    [0.82, 0.62, 0.44, 0.30, 0.18],
  gtm:        [0.82, 0.62, 0.44, 0.30, 0.18],
  operations: [0.82, 0.62, 0.44, 0.30, 0.18],
  financials: [0.48, 0.36, 0.26, 0.17, 0.11],
};

/** Blend a domain hex color toward #0A0A0A by factor. */
export function blendTopicRowColor(hex: string, factor: number): string {
  const dark = 10; // 0x0A
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(dark + (r - dark) * factor)}, ${Math.round(dark + (g - dark) * factor)}, ${Math.round(dark + (b - dark) * factor)})`;
}

export const DOMAIN_COLORS: Record<DomainType, DomainColorScheme> = {
  market: {
    primary: '#2563EB',
    light: '#EEF5FF',
    medium: '#BFDBFE',
    dark: '#1D4ED8',
    textOnPrimary: 'text-white',
    headerBg: 'bg-[#2563EB]',
    cardBg: 'bg-[#EEF5FF]',
    cardBorder: 'border-[#BFDBFE]',
    textPrimary: 'text-[#2563EB]',
    textDark: 'text-[#1D4ED8]',
    progressBar: 'bg-[#2563EB]',
    buttonBg: 'bg-[#2563EB]',
    buttonHover: 'hover:bg-[#1D4ED8]',
    dotBg: 'bg-[#2563EB]',
    selectedBg: 'bg-[#2563EB]/[0.10]',
    selectedBorder: 'border-[#2563EB]',
    ringColor: 'ring-[#2563EB]',
    whyBg: 'bg-[#EEF5FF]',
    whyHeader: 'bg-[#BFDBFE]/50',
  },
  product: {
    primary: '#00C48C',
    light: '#E6FFF8',
    medium: '#A3EFDA',
    dark: '#007A58',
    textOnPrimary: 'text-white',
    headerBg: 'bg-[#00C48C]',
    cardBg: 'bg-[#E6FFF8]',
    cardBorder: 'border-[#A3EFDA]',
    textPrimary: 'text-[#00C48C]',
    textDark: 'text-[#007A58]',
    progressBar: 'bg-[#00C48C]',
    buttonBg: 'bg-[#00C48C]',
    buttonHover: 'hover:bg-[#007A58]',
    dotBg: 'bg-[#00C48C]',
    selectedBg: 'bg-[#00C48C]/[0.10]',
    selectedBorder: 'border-[#00C48C]',
    ringColor: 'ring-[#00C48C]',
    whyBg: 'bg-[#E6FFF8]',
    whyHeader: 'bg-[#A3EFDA]/50',
  },
  gtm: {
    primary: '#FF4E28',
    light: '#FFF2EE',
    medium: '#FFCCC0',
    dark: '#CC2500',
    textOnPrimary: 'text-white',
    headerBg: 'bg-[#FF4E28]',
    cardBg: 'bg-[#FFF2EE]',
    cardBorder: 'border-[#FFCCC0]',
    textPrimary: 'text-[#FF4E28]',
    textDark: 'text-[#CC2500]',
    progressBar: 'bg-[#FF4E28]',
    buttonBg: 'bg-[#FF4E28]',
    buttonHover: 'hover:bg-[#CC2500]',
    dotBg: 'bg-[#FF4E28]',
    selectedBg: 'bg-[#FF4E28]/[0.10]',
    selectedBorder: 'border-[#FF4E28]',
    ringColor: 'ring-[#FF4E28]',
    whyBg: 'bg-[#FFF2EE]',
    whyHeader: 'bg-[#FFCCC0]/50',
  },
  operations: {
    primary: '#7B2FFF',
    light: '#F3EEFF',
    medium: '#D6B8FF',
    dark: '#5100CC',
    textOnPrimary: 'text-white',
    headerBg: 'bg-[#7B2FFF]',
    cardBg: 'bg-[#F3EEFF]',
    cardBorder: 'border-[#D6B8FF]',
    textPrimary: 'text-[#7B2FFF]',
    textDark: 'text-[#5100CC]',
    progressBar: 'bg-[#7B2FFF]',
    buttonBg: 'bg-[#7B2FFF]',
    buttonHover: 'hover:bg-[#5100CC]',
    dotBg: 'bg-[#7B2FFF]',
    selectedBg: 'bg-[#7B2FFF]/[0.10]',
    selectedBorder: 'border-[#7B2FFF]',
    ringColor: 'ring-[#7B2FFF]',
    whyBg: 'bg-[#F3EEFF]',
    whyHeader: 'bg-[#D6B8FF]/50',
  },
  financials: {
    primary: '#F5C400',
    light: '#FFFAE0',
    medium: '#FFE980',
    dark: '#B89200',
    textOnPrimary: 'text-[#0A0A0A]',
    headerBg: 'bg-[#F5C400]',
    cardBg: 'bg-[#FFFAE0]',
    cardBorder: 'border-[#FFE980]',
    textPrimary: 'text-[#B89200]',
    textDark: 'text-[#B89200]',
    progressBar: 'bg-[#F5C400]',
    buttonBg: 'bg-[#F5C400]',
    buttonHover: 'hover:bg-[#B89200]',
    dotBg: 'bg-[#F5C400]',
    selectedBg: 'bg-[#F5C400]/[0.10]',
    selectedBorder: 'border-[#F5C400]',
    ringColor: 'ring-[#F5C400]',
    whyBg: 'bg-[#FFFAE0]',
    whyHeader: 'bg-[#FFE980]/50',
  },
};
