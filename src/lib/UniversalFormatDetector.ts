// UniversalFormatDetector.ts
export type SupportedFormat = 'html' | 'csv' | 'txt' | 'json' | 'xml' | 'unknown';

export function detectFileFormat(content: string, filename?: string): SupportedFormat {
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    if (["csv", "json", "xml", "html", "htm", "txt"].includes(ext!)) {
      if (ext === 'htm') return 'html';
      return ext as SupportedFormat;
    }
  }
  if (content.trim().startsWith('<') || content.includes('<!DOCTYPE')) return 'html';
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) return 'json';
  if (content.includes('<?xml') || content.includes('<root>')) return 'xml';
  if (content.includes(',') && content.includes('\n') && content.split('\n')[0].includes(',')) return 'csv';
  if (content.includes('Commande:') || content.includes('Acheteur:')) return 'txt';
  return 'unknown';
} 