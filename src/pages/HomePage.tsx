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
					coordenadas_quadrado: [0.14, -0.0, 0.15, 0.15],
					coordenadas_pino_gabarito: [0.1739653969924779, 0.0593560143486153],
				},
				{
					diretorio: "tiles/night-sky_files/14/6_8.jpeg",
					coordenadas_quadrado: [0.1, 0.1, 0.15, 0.15],
					coordenadas_pino_gabarito: [0.15690454395618236, 0.21051408682326955],
				},
				{
					diretorio: "tiles/night-sky_files/14/26_0.jpeg",
					coordenadas_quadrado: [0.6, -0.025, 0.15, 0.15],
					coordenadas_pino_gabarito: [0.6419981297168088, 0.012578777486416545],
				},
			],
		};
		return imagens.data[index];
	};

	// 🔧 Função segura para desenhar overlays
	const desenharOverlays = () => {
		const viewer = viewerInstance.current;
		if (!viewer || viewer.isOpen() === false || !viewer.drawer) return;

		try {
			if (viewer.world.getItemCount() === 0) return;
			viewer.clearOverlays();
		} catch {
			return; // evita crash se viewer estiver reiniciando
		}

		// Quadrado vermelho
		const pos = new OpenSeadragon.Rect(...getImagemByIndex(currentIndex).coordenadas_quadrado);
		const square = document.createElement("div");
		square.style.border = "3px solid red";
		square.style.width = "100px";
		square.style.height = "100px";
		square.style.background = "transparent";
		square.style.position = "absolute";
		square.style.pointerEvents = "none";

		viewer.addOverlay({
			element: square,
			location: pos,
			placement: OpenSeadragon.OverlayPlacement.CENTER,
		});

		// Pino do gabarito
		if (gabaritoVisivel) {
			const [x, y] = getImagemByIndex(currentIndex).coordenadas_pino_gabarito;
			const gabaritoCircle = document.createElement("div");
			gabaritoCircle.style.width = "10px";
			gabaritoCircle.style.height = "10px";
			gabaritoCircle.style.borderRadius = "50%";
			gabaritoCircle.style.background = "blue";
			gabaritoCircle.style.border = "2px solid white";
			gabaritoCircle.style.pointerEvents = "none";
			viewer.addOverlay({
				element: gabaritoCircle,
				location: new OpenSeadragon.Point(x, y),
				placement: OpenSeadragon.OverlayPlacement.CENTER,
			});
		}

		// Marcadores adicionados pelo jogador
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
		});
	};

	// Inicializa viewer uma vez
	useEffect(() => {
		if (!viewerRef.current || viewerInstance.current) return;

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

		viewer.addHandler("canvas-click", (event) => {
			if ((event.originalEvent.target as HTMLElement).closest(".overlay-top-right")) return;

			// Só adiciona marcador se Ctrl estiver pressionado
			if (!event.originalEvent.ctrlKey) return;

			event.preventDefaultAction = true;
			const webPoint = event.position;
			const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
			setMarkers((prev) => [...prev, viewportPoint]);
		});

		return () => {
			viewer.destroy();
			viewerInstance.current = null;
		};
	}, []);

	// Redesenha sem crashar
	useEffect(() => {
		const id = setTimeout(() => desenharOverlays(), 50);
		return () => clearTimeout(id);
	}, [markers, currentIndex, gabaritoVisivel]);

	// Navegação
	const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
	const handleNext = () => setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
	const toggleGabarito = () => setGabaritoVisivel((prev) => !prev);
	const limparMarkers = () => setMarkers([]);

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

			{/* Overlay fixo de controles */}
			<div
				className="overlay-top-right"
				style={{
					position: "fixed",
					top: 20,
					right: 20,
					zIndex: 100,
					userSelect: "none",
				}}
			>
				<img
					src={getImagemByIndex(currentIndex).diretorio}
					alt="preview"
					style={{ width: "150px", borderRadius: "10px", border: "2px solid white" }}
				/>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						marginTop: "10px",
					}}
				>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<button type="button" onClick={handlePrev} style={{ marginRight: "10px" }}>
							⬅️
						</button>
						<button type="button" onClick={handleNext}>
							➡️
						</button>
					</div>
					<button
						type="button"
						onClick={toggleGabarito}
						style={{ marginTop: "10px", padding: "5px 10px", borderRadius: "5px" }}
					>
						{gabaritoVisivel ? "Hide markers" : "Show markers"}
					</button>
					<button
						type="button"
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
