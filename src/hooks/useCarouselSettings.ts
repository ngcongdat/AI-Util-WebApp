import { useState } from 'react';
import type { LogoPosition, QuotePosition, AspectRatio, TextAlign } from '../utils/canvas';

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
  quoteBgColor: string | null;
  setQuoteBgColor: (v: string | null) => void;
  quoteBgOpacity: number;
  setQuoteBgOpacity: (v: number) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  textAlign: TextAlign;
  setTextAlign: (v: TextAlign) => void;
}

export function useCarouselSettings(): CarouselSettings {
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#10b981');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('top-right');
  const [logoSize, setLogoSize] = useState(120);
  const [quotePosition, setQuotePosition] = useState<QuotePosition>('center');
  const [fontSize, setFontSize] = useState(64);
  const [quoteBgColor, setQuoteBgColor] = useState<string | null>(null);
  const [quoteBgOpacity, setQuoteBgOpacity] = useState(70);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [textAlign, setTextAlign] = useState<TextAlign>('center');

  return {
    textColor, setTextColor,
    highlightColor, setHighlightColor,
    fontFamily, setFontFamily,
    logoPosition, setLogoPosition,
    logoSize, setLogoSize,
    quotePosition, setQuotePosition,
    fontSize, setFontSize,
    quoteBgColor, setQuoteBgColor,
    quoteBgOpacity, setQuoteBgOpacity,
    aspectRatio, setAspectRatio,
    textAlign, setTextAlign,
  };
}
