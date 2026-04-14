import { useState } from 'react';
import type { LogoPosition, QuotePosition } from '../utils/canvas';

export interface CarouselSettings {
  textColor: string;
  setTextColor: (v: string) => void;
  highlightColor: string;
  setHighlightColor: (v: string) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  logoPosition: LogoPosition;
  setLogoPosition: (v: LogoPosition) => void;
  logoSize: number;
  setLogoSize: (v: number) => void;
  quotePosition: QuotePosition;
  setQuotePosition: (v: QuotePosition) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
}

export function useCarouselSettings(): CarouselSettings {
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#10b981');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('top-right');
  const [logoSize, setLogoSize] = useState(120);
  const [quotePosition, setQuotePosition] = useState<QuotePosition>('center');
  const [fontSize, setFontSize] = useState(64);

  return {
    textColor, setTextColor,
    highlightColor, setHighlightColor,
    fontFamily, setFontFamily,
    logoPosition, setLogoPosition,
    logoSize, setLogoSize,
    quotePosition, setQuotePosition,
    fontSize, setFontSize,
  };
}
