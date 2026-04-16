import React from 'react';
import { isKeyword } from '../utils/keywords';
import type { TextAlign } from '../utils/canvas';

interface Props {
  quote: string;
  keywords: string[];
  selectedIndices?: number[];
  textColor: string;
  highlightColor: string;
  fontFamily: string;
  fontSize: number;
  className?: string;
  quoteBgColor?: string | null;
  quoteBgOpacity?: number;
  textAlign?: TextAlign;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export default function HighlightedQuote({
  quote,
  keywords,
  selectedIndices,
  textColor,
  highlightColor,
  fontFamily,
  fontSize,
  className = '',
  quoteBgColor,
  quoteBgOpacity = 70,
  textAlign = 'center',
}: Props) {
  const shouldHighlight = (word: string, i: number): boolean => {
    if (selectedIndices !== undefined) return selectedIndices.includes(i);
    return isKeyword(word, keywords);
  };

  type Run = { highlighted: boolean; words: string[] };

  function buildRuns(lineWords: string[], offset: number): Run[] {
    const runs: Run[] = [];
    lineWords.forEach((word, i) => {
      const highlighted = shouldHighlight(word, offset + i);
      const last = runs[runs.length - 1];
      if (last && last.highlighted === highlighted) {
        last.words.push(word);
      } else {
        runs.push({ highlighted, words: [word] });
      }
    });
    return runs;
  }

  function renderRuns(runs: Run[]) {
    return runs.map((run, i) => {
      const text = run.words.join(' ');
      const isLast = i === runs.length - 1;
      if (run.highlighted) {
        return (
          <React.Fragment key={i}>
            <span style={{ backgroundColor: highlightColor }} className="px-1 rounded-sm">{text}</span>
            {!isLast && ' '}
          </React.Fragment>
        );
      }
      return <React.Fragment key={i}>{text}{!isLast && ' '}</React.Fragment>;
    });
  }

  let wordOffset = 0;
  const textLines = quote.split('\n').map(line => {
    const lineWords = line.split(' ').filter(w => w.length > 0);
    const runs = buildRuns(lineWords, wordOffset);
    wordOffset += lineWords.length;
    return { runs, empty: lineWords.length === 0 };
  });

  const paragraph = (
    <div
      style={{ color: textColor, fontFamily, fontSize, lineHeight: '1.5' }}
      className={`font-bold ${className}`}
    >
      {textLines.map((line, lineIdx) => (
        <div key={lineIdx} style={{ minHeight: '1.5em', textAlign }}>
          {line.empty ? '\u00A0' : renderRuns(line.runs)}
        </div>
      ))}
    </div>
  );

  if (quoteBgColor) {
    return (
      <div
        style={{ backgroundColor: hexToRgba(quoteBgColor, quoteBgOpacity) }}
        className="px-3 py-2 rounded w-full"
      >
        {paragraph}
      </div>
    );
  }

  return paragraph;
}
