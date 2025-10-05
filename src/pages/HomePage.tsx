// src/pages/HomePage.tsx
import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import './HomePage.css';
import Sidebar from '../components/Sidebar';

const HomePage: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: '/openseadragon-images/', // ícones padrão
      tileSources: '/tiles/night-sky.dzi', // arquivo gerado pelo script de tiles
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      maxZoomPixelRatio: 2,
      visibilityRatio: 1,
      constrainDuringPan: true,
      minZoomLevel: 0,
      zoomPerScroll: 1.3,
      showZoomControl: true,
      showFullPageControl: true,
    });

    return () => viewer.destroy();
  }, []);

  return (
    <div className="home-container">
      <Sidebar />

      <div
        ref={viewerRef}
        className="viewer-container"
        style={{
          width: '100%',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default HomePage;
