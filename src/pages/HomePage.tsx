// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./HomePage.css";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
	const viewerRef = useRef<HTMLDivElement>(null);
	const viewerInstance = useRef<OpenSeadragon.Viewer | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [markers, setMarkers] = useState<OpenSeadragon.Point[]>([]);
	const [gabaritoVisivel, setGabaritoVisivel] = useState(true);

	const getImagemByIndex = (index: number) => {
		const imagens = {
			data: [
				{
					diretorio: "tiles/night-sky_files/14/7_2.jpeg",
					coordenadas_quadrado: [0.14, -0.00, 0.15, 0.15],
					coordenadas_pino_gabarito: [0.1739653969924779, 0.0593560143486153],
				},
				{
					diretorio: "tiles/night-sky_files/14/6_8.jpeg",
					coordenadas_quadrado: [0.10, 0.10, 0.15, 0.15],
					coordenadas_pino_gabarito: [0.15690454395618236, 0.21051408682326955],
				},
				{
					diretorio: "tiles/night-sky_files/14/26_0.jpeg",
					coordenadas_quadrado: [0.60, -0.025, 0.15, 0.15],
					coordenadas_pino_gabarito: [0.6419981297168088, 0.012578777486416545],
				},
			],
		};
		return imagens.data[index];
	};


	// Função para desenhar quadrado e marcadores
	const desenharOverlays = () => {
		const viewer = viewerInstance.current;
		if (!viewer) return;

		viewer.clearOverlays();

		// Desenha o quadrado existente
		const pos = new OpenSeadragon.Rect(...getImagemByIndex(currentIndex).coordenadas_quadrado);
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

		// Desenha o marcador do gabarito se estiver visível
		if (gabaritoVisivel) {
			const pinos = getImagemByIndex(currentIndex).coordenadas_pino_gabarito;
			if (pinos) {
				const gabaritoCircle = document.createElement("div");
				gabaritoCircle.style.width = "10px";
				gabaritoCircle.style.height = "10px";
				gabaritoCircle.style.borderRadius = "50%";
				gabaritoCircle.style.background = "blue";
				gabaritoCircle.style.border = "2px solid white";
				gabaritoCircle.style.pointerEvents = "none";

				viewer.addOverlay({
					element: gabaritoCircle,
					location: new OpenSeadragon.Point(pinos[0], pinos[1]),
					placement: OpenSeadragon.OverlayPlacement.CENTER,
				});
			}
		}

		// Desenha todos os marcadores adicionados manualmente
		markers.forEach((point) => {
			const circle = document.createElement("div");
			circle.style.width = "10px";
			circle.style.height = "10px";
			circle.style.borderRadius = "50%";
			circle.style.background = "red";
			circle.style.border = "2px solid white";
			circle.style.pointerEvents = "none";

			viewer.addOverlay({
				element: circle,
				location: point,
				placement: OpenSeadragon.OverlayPlacement.CENTER,
			});
			console.log("Marker at:", point); // Ponto de referência global do viewer do OpenSeaDragon.    
			// preciso usar essa referencia como ponto de ancoragem do marcador na imagem, 
			// que está referente a localizaçao do click do mouse
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
			desenharOverlays();
		});

		// Clique para adicionar marcador manual
		viewer.addHandler("canvas-click", (event) => {
			event.preventDefaultAction = true;
			const webPoint = event.position;
			const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
			setMarkers((prev) => [...prev, viewportPoint]);
		});

		return () => viewer.destroy();
	}, [currentIndex, gabaritoVisivel]);

	// Redesenha overlays quando marcadores ou visibilidade mudam
	useEffect(() => {
		desenharOverlays();
	}, [markers, currentIndex, gabaritoVisivel]);

	// Navegação
	const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
	const handleNext = () => setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
	const toggleGabarito = () => setGabaritoVisivel((prev) => !prev);
	const limparMarkers = () => setMarkers([]); // Limpa os pinos vermelhos

	return (
		<div>
			<div className="home-container">
				<Sidebar />

				<div
					ref={viewerRef}
					className="viewer-container"
					style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 0 }}
				/>
			</div>

			<div className="overlay-top-right" style={{ position: "absolute", top: 20, right: 20 }}>
				<img
					src={getImagemByIndex(currentIndex).diretorio}
					alt="preview"
					style={{ width: "150px", borderRadius: "10px", border: "2px solid white" }}
				/>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<button onClick={handlePrev} style={{ marginRight: "10px" }}>
							⬅️
						</button>
						<button onClick={handleNext}>➡️</button>
					</div>
					<button
						onClick={toggleGabarito}
						style={{ marginTop: "10px", padding: "5px 10px", borderRadius: "5px" }}
					>
						{gabaritoVisivel ? "Hide markers" : "Show markers"}
					</button>
					<button
						onClick={limparMarkers}
						style={{ marginTop: "10px", padding: "5px 10px", borderRadius: "5px" }}
					>
						Clear player's markers
					</button>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
