// src/components/Sidebar.tsx
import React, { useState } from 'react';
import './Sidebar.css';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

type Marker = {
  id: number;
  label: string;
  color: string;
};

type SidebarProps = {
  onAddMarkerClick: () => void;
  markers: Marker[];
  onDeleteMarker: (id: number) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onAddMarkerClick, markers, onDeleteMarker }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinOptionsOpen, setPinOptionsOpen] = useState(false);
  const [isMarkersOpen, setIsMarkersOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handlePinOptionsToggle = () => setPinOptionsOpen(!isPinOptionsOpen);
  const handleMarkersToggle = () => setIsMarkersOpen(!isMarkersOpen);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={handleToggle}>
        {isOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>

      {isOpen && (
        <div className="sidebar-content">
          <h2>Menu</h2>
          <ul>
            {/* --- PIN OPTIONS --- */}
            <li className="menu-item-toggle" onClick={handlePinOptionsToggle}>
              + Pin options
            </li>
            <ul className={`submenu ${isPinOptionsOpen ? 'open' : ''}`}>
              <li>Sub Opção 1</li>
              <li>Sub Opção 2</li>
            </ul>

            {/* --- MARCADORES --- */}
            <li className="menu-item-toggle" onClick={handleMarkersToggle}>
              📍 Marcadores 
            </li>
            <ul className={`submenu ${isMarkersOpen ? 'open' : ''}`}>
              {/* --- ADICIONAR MARCADOR DENTRO DO SUBMENU --- */}
              <li className="menu-item" onClick={onAddMarkerClick}>
                + Adicionar Marcador
              </li>
              
              {/* --- TÍTULO PARA A LISTA DE SENSORES ADICIONADO AQUI --- */}
              <li className="submenu-title">Sensores Listados:</li>

              {/* --- LISTA DE MARCADORES --- */}
              {markers.length === 0 ? (
                <li style={{ opacity: 0.7 }}>Nenhum marcador</li>
              ) : (
                markers.map(marker => (
                  <li key={marker.id} className="marker-item">
                    <span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          backgroundColor: marker.color,
                          marginRight: '6px',
                          borderRadius: '2px',
                        }}
                      />
                      {marker.label}
                    </span>
                    <button className="delete-button" onClick={() => onDeleteMarker(marker.id)}>✖</button>
                  </li>
                ))
              )}
            </ul>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;