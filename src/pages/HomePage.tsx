// src/pages/HomePage.tsx
import React from 'react';
import './HomePage.css';
import homeBackground from '../assets/home-background.jpg';
import Sidebar from '../components/Sidebar'; // <-- 1. Importe o Sidebar

const HomePage: React.FC = () => {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${homeBackground})` }}
    >
      <Sidebar /> {/* <-- 2. Adicione o componente aqui */}
      
      {/* O resto da sua página pode vir aqui no futuro */}
    </div>
  );
};

export default HomePage;