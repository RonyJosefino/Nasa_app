// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./HomePage.css";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
	const viewerRef = useRef<HTMLDivElement>(null);
	const viewerInstance = useRef<OpenSeadragon.Viewer | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const getImagemByIndex = (index: number) => {
		const imagens = {
			data: [
				{
					diretorio: "tiles/night-sky_files/14/7_2.jpeg",
					coordenadas_quadrado: [0.14, -0.015, 0.15, 0.15],
				},
				{
					diretorio: "tiles/night-sky_files/14/6_8.jpeg",
					coordenadas_quadrado: [0.10, 0.10, 0.15, 0.15],
				},
				{
					diretorio: "tiles/night-sky_files/14/26_0.jpeg",
					coordenadas_quadrado: [0.60, -0.025, 0.15, 0.15],
				},
			],
		};
		return imagens.data[index];
	};

	// 🧠 Função para desenhar o quadrado
	const desenharQuadrado = (index: number) => {
		const viewer = viewerInstance.current;
		if (!viewer) return;

		// Remove quadrados anteriores
		viewer.clearOverlays();

		// Adiciona o novo quadrado
		const pos = new OpenSeadragon.Rect(...getImagemByIndex(index).coordenadas_quadrado);
		const square = document.createElement("div");
		square.style.border = "3px solid red";
		square.style.width = "100px";
		square.style.height = "100px";
		square.style.background = "transparent";
		square.style.position = "absolute";
		square.style.pointerEvents = "none";
		square.style.zIndex = "10";

		viewer.addOverlay({
			element: square,
			location: pos,
			placement: OpenSeadragon.OverlayPlacement.CENTER,
		});
	};

	useEffect(() => {
		if (!viewerRef.current) return;

		const viewer = OpenSeadragon({
			element: viewerRef.current,
			prefixUrl: "/openseadragon-images/",
			tileSources: "/tiles/night-sky.dzi",
			showNavigator: true,
			navigatorPosition: "BOTTOM_RIGHT",
			maxZoomPixelRatio: 2,
			visibilityRatio: 1,
			constrainDuringPan: true,
			minZoomLevel: 0,
			zoomPerScroll: 1.3,
			showZoomControl: false,
			showFullPageControl: false,
			showHomeControl: false,
		});

		viewerInstance.current = viewer;

		viewer.addHandler("open", () => {
			desenharQuadrado(currentIndex);
		});

		return () => viewer.destroy();
	}, []);

	// 🔁 Atualiza o quadrado quando currentIndex muda
	useEffect(() => {
		if (viewerInstance.current) {
			desenharQuadrado(currentIndex);
		}
	}, [currentIndex]);

	// 🔘 Navegação
	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
	};

	return (
		<div>
			<div className="home-container">
				<Sidebar />

				<div
					ref={viewerRef}
					className="viewer-container"
					style={{
						width: "100%",
						height: "100vh",
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 0,
					}}
				/>
			</div>

			{/* Imagem no canto superior direito */}
			<div className="overlay-top-right" style={{ position: "absolute", top: 20, right: 20 }}>
				<img
					src={getImagemByIndex(currentIndex).diretorio}
					alt="preview"
					style={{ width: "150px", borderRadius: "10px", border: "2px solid white" }}
				/>
				<div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
					<button onClick={handlePrev} style={{ marginRight: "10px" }}>
						⬅️
					</button>
					<button onClick={handleNext}>➡️</button>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
