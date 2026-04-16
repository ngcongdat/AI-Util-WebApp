import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import CarouselCustomPage from './pages/CarouselCustomPage';
import CarouselGenerator from './components/CarouselGenerator';
import FnbShortScriptPage from './pages/FnbShortScriptPage';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/carousel-ai-content" element={<CarouselGenerator />} />
            <Route path="/carousel-custom-content" element={<CarouselCustomPage />} />
            <Route path="/fnb-short-script" element={<FnbShortScriptPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}
