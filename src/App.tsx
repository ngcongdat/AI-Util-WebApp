import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarouselCustomPage from './pages/CarouselCustomPage';
import CarouselGenerator from './components/CarouselGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/carousel-ai-content" element={<CarouselGenerator />} />
          <Route path="/carousel-custom-content" element={<CarouselCustomPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
