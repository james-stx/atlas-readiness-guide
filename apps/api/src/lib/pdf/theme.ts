import { StyleSheet } from '@react-pdf/renderer';
import { COLORS } from '@atlas/config';

// Brand colors
export const pdfColors = {
  primary: COLORS.primary,
  cyan: COLORS.cyan,
  orange: COLORS.orange,
  slate900: '#0f172a',
  slate700: '#334155',
  slate500: '#64748b',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  green600: '#16a34a',
  green100: '#dcfce7',
  red600: '#dc2626',
  red100: '#fee2e2',
  amber600: '#d97706',
  amber100: '#fef3c7',
};

// Font sizes
export const fontSizes = {
  xs: 8,
  sm: 9,
  base: 10,
  lg: 12,
  xl: 14,
  '2xl': 18,
  '3xl': 24,
};

// Common styles
export const commonStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: fontSizes.base,
    color: pdfColors.slate700,
    backgroundColor: pdfColors.white,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: pdfColors.primary,
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: pdfColors.primary,
    borderRadius: 8,
    marginBottom: 12,
  },
  logoText: {
    color: pdfColors.white,
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.8,
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: 'bold',
    color: pdfColors.slate900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: pdfColors.slate500,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: pdfColors.slate900,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.slate200,
  },
  sectionDescription: {
    fontSize: fontSizes.sm,
    color: pdfColors.slate500,
    marginBottom: 12,
  },
  card: {
    backgroundColor: pdfColors.slate50,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  text: {
    fontSize: fontSizes.base,
    color: pdfColors.slate700,
    lineHeight: 1.5,
  },
  textSm: {
    fontSize: fontSizes.sm,
    color: pdfColors.slate500,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: pdfColors.slate500,
    borderTopWidth: 1,
    borderTopColor: pdfColors.slate200,
    paddingTop: 12,
  },
});

// Confidence-specific styles
export const confidenceStyles = {
  high: {
    backgroundColor: pdfColors.green100,
    color: pdfColors.green600,
  },
  medium: {
    backgroundColor: pdfColors.amber100,
    color: pdfColors.amber600,
  },
  low: {
    backgroundColor: pdfColors.red100,
    color: pdfColors.red600,
  },
};

// Importance-specific styles
export const importanceStyles = {
  critical: {
    backgroundColor: pdfColors.red100,
    borderColor: pdfColors.red600,
    badgeColor: pdfColors.red600,
  },
  important: {
    backgroundColor: pdfColors.amber100,
    borderColor: pdfColors.amber600,
    badgeColor: pdfColors.amber600,
  },
  'nice-to-have': {
    backgroundColor: pdfColors.slate100,
    borderColor: pdfColors.slate500,
    badgeColor: pdfColors.slate500,
  },
};
