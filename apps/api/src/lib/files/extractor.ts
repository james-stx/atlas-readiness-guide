import mammoth from 'mammoth';
import AdmZip from 'adm-zip';

const MAX_TEXT_LENGTH = 40_000;

const SUPPORTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'text/plain': 'TXT',
  'text/markdown': 'MD',
  'text/x-markdown': 'MD',
  'text/csv': 'CSV',
  'text/html': 'HTML',
  'application/json': 'JSON',
};

/**
 * Extract plain text from a PPTX buffer.
 * PPTX is a ZIP archive — slides live at ppt/slides/slideN.xml.
 */
function extractPptxText(buffer: Buffer): string {
  const zip = new AdmZip(buffer);
  const slideEntries = zip.getEntries()
    .filter(e => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
    .sort((a, b) => a.entryName.localeCompare(b.entryName));

  const texts: string[] = [];
  for (const entry of slideEntries) {
    const xml = entry.getData().toString('utf-8');
    const matches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) ?? [];
    for (const match of matches) {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text) texts.push(text);
    }
  }
  return texts.join(' ');
}

/**
 * Extract plain text from a PDF buffer using pdf-parse.
 * Uses require() at call-time to bypass webpack's ESM/CJS interop issue
 * (static import of pdf-parse resolves to a non-function via webpack's module transform).
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;
  const result = await pdfParse(buffer);
  return result.text;
}

/**
 * Extract plain text from an uploaded document buffer.
 * Truncates to MAX_TEXT_LENGTH to stay within Claude context limits.
 */
export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  const normalizedType = mimeType.split(';')[0].trim().toLowerCase();

  if (!SUPPORTED_TYPES[normalizedType]) {
    throw new Error(`Unsupported file type: ${mimeType}. Supported: PDF, DOCX, PPTX, TXT, MD, CSV, HTML, JSON`);
  }

  let text: string;

  if (normalizedType === 'application/pdf') {
    text = await extractPdfText(buffer);
  } else if (normalizedType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (normalizedType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    text = extractPptxText(buffer);
  } else {
    // Plain text formats (txt, md, csv, html, json) — decode directly
    text = buffer.toString('utf-8');
  }

  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > MAX_TEXT_LENGTH
    ? cleaned.slice(0, MAX_TEXT_LENGTH) + '\n\n[Document truncated for analysis]'
    : cleaned;
}

export function getSupportedMimeTypes(): string[] {
  return Object.keys(SUPPORTED_TYPES);
}
