// src/pages/HomePage.tsx
import React, { useState } from 'react';
import './HomePage.css';
import homeBackground from '../assets/home-background.jpg';
import Sidebar from '../components/Sidebar';

type Marker = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string; // <- alterado de 'text' para 'label' para compatibilidade com a Sidebar
};

const HomePage: React.FC = () => {
  const [isMarkingMode, setMarkingMode] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number } | null>(null);
  const [previewRect, setPreviewRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Ativa o modo de marcação
  const handleAddMarkerClick = () => {
    setMarkingMode(true);
    setAnchorPoint(null);
    setPreviewRect(null);
  };

  // Captura o ponto inicial
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMarkingMode || (event.target as HTMLElement).closest('.sidebar')) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setAnchorPoint({ x, y });
    setPreviewRect({ x, y, width: 0, height: 0 });
  };

  // Atualiza a pré-visualização
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!anchorPoint || !isMarkingMode) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPreviewRect({
      x: Math.min(anchorPoint.x, x),
      y: Math.min(anchorPoint.y, y),
      width: Math.abs(anchorPoint.x - x),
      height: Math.abs(anchorPoint.y - y),
    });
  };

  // Finaliza o marcador
  const handleMouseUp = () => {
    if (!previewRect || !anchorPoint) return;

    const markerLabel = window.prompt('Digite a identificação para este marcador:');
    if (markerLabel) {
      const newMarker: Marker = {
        id: Date.now(),
        ...previewRect,
        label: markerLabel,
      };
      setMarkers([...markers, newMarker]);
    }

    setAnchorPoint(null);
    setPreviewRect(null);
    setMarkingMode(false);
  };

  // Deleta um marcador pelo ID
  const handleDeleteMarker = (id: number) => {
    setMarkers(markers.filter(marker => marker.id !== id));
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${homeBackground})`,
        cursor: isMarkingMode ? 'crosshair' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Sidebar recebe marcadores e função de deletar */}
      <Sidebar
        onAddMarkerClick={handleAddMarkerClick}
        markers={markers.map(m => ({ id: m.id, label: m.label }))}
        onDeleteMarker={handleDeleteMarker}
      />

      {/* Marcadores fixos */}
      {markers.map(marker => (
        <div
          key={marker.id}
          className="marker"
          style={{
            left: marker.x,
            top: marker.y,
            width: marker.width,
            height: marker.height,
          }}
        >
          <span className="marker-text">{marker.label}</span>
        </div>
      ))}

      {/* Pré-visualização */}
      {previewRect && (
        <div
          className="marker-preview"
          style={{
            left: previewRect.x,
            top: previewRect.y,
            width: previewRect.width,
            height: previewRect.height,
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
