import { createElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';

const FG: Record<number, string> = {
  30: '#2d2d2d', 31: '#cc0000', 32: '#4e9a06', 33: '#c4a000',
  34: '#3465a4', 35: '#75507b', 36: '#06989a', 37: '#d3d7cf',
  90: '#555753', 91: '#ef2929', 92: '#8ae234', 93: '#fce94f',
  94: '#729fcf', 95: '#ad7fa8', 96: '#34e2e2', 97: '#eeeeec',
};

const BG: Record<number, string> = {
  40: '#000000', 41: '#cc0000', 42: '#4e9a06', 43: '#c4a000',
  44: '#3465a4', 45: '#75507b', 46: '#06989a', 47: '#d3d7cf',
};

export type AnsiStyle = {
  color?: string;
  backgroundColor?: string;
  fontWeight?: 'bold';
  textDecoration?: 'underline';
  opacity?: number;
};

export type AnsiSegment = { text: string; style: AnsiStyle };

function applyParams(params: number[], style: AnsiStyle): AnsiStyle {
  const next = { ...style };
  let i = 0;
  while (i < params.length) {
    const p = params[i];
    if (p === 0) return {};
    else if (p === 1) next.fontWeight = 'bold';
    else if (p === 2) next.opacity = 0.5;
    else if (p === 4) next.textDecoration = 'underline';
    else if (FG[p] !== undefined) next.color = FG[p];
    else if (BG[p] !== undefined) next.backgroundColor = BG[p];
    else if (p === 38 && params[i + 1] === 2) {
      next.color = `rgb(${params[i + 2] ?? 0},${params[i + 3] ?? 0},${params[i + 4] ?? 0})`;
      i += 4;
    } else if (p === 48 && params[i + 1] === 2) {
      next.backgroundColor = `rgb(${params[i + 2] ?? 0},${params[i + 3] ?? 0},${params[i + 4] ?? 0})`;
      i += 4;
    }
    i++;
  }
  return next;
}

export function parseAnsi(text: string): AnsiSegment[] {
  if (!text.includes('\x1b')) return [{ text, style: {} }];

  const re = /\x1b\[([0-9;]*)m/g;
  const segments: AnsiSegment[] = [];
  let style: AnsiStyle = {};
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const chunk = text.slice(lastIndex, match.index);
    if (chunk) segments.push({ text: chunk, style: { ...style } });
    const params = match[1] ? match[1].split(';').map(Number) : [0];
    style = applyParams(params, style);
    lastIndex = match.index + match[0].length;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) segments.push({ text: remaining, style: { ...style } });

  return segments;
}

export function ansiToSpans(text: string): ReactNode {
  const segments = parseAnsi(text);

  if (segments.length === 1 && Object.keys(segments[0].style).length === 0) {
    return segments[0].text;
  }

  return segments.map((seg, i) =>
    createElement('span', { key: i, style: seg.style as CSSProperties }, seg.text)
  );
}
