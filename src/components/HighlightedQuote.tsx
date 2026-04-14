import React from 'react';
import { isKeyword } from '../utils/keywords';

interface Props {
  quote: string;
  keywords: string[];
  textColor: string;
  highlightColor: string;
  fontFamily: string;
  fontSize: number;
  className?: string;
}

export default function HighlightedQuote({
  quote,
  keywords,
  textColor,
  highlightColor,
  fontFamily,
  fontSize,
  className = '',
}: Props) {
  return (
    <p
      style={{ color: textColor, fontFamily, fontSize, lineHeight: '1.5' }}
      className={`font-bold ${className}`}
    >
      {quote.split(' ').map((word, i) => (
        <span key={i} className="inline-block mr-1">
          {isKeyword(word, keywords) ? (
            <span style={{ backgroundColor: highlightColor }} className="px-1 rounded-sm">
              {word}
            </span>
          ) : (
            word
          )}
        </span>
      ))}
    </p>
  );
}
