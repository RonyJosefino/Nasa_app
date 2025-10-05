import React, { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";
import "./HomePage.css";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
	const viewerRef = useRef<HTMLDivElement>(null);

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

		// 🔧 Quando a imagem abrir, adiciona os 3 quadrados
		viewer.addHandler("open", () => {
			const positions = [
				// Posições relativas (x, y, largura, altura)
				new OpenSeadragon.Rect(0.0, 0.05, 0.15, 0.15), // esquerda
				// new OpenSeadragon.Rect(0.38, 0.0, 0.15, 0.2), // esquerda
				// new OpenSeadragon.Rect(0.08, 0.0, 0.2, 0.1), // esquerda
			];

			positions.forEach((pos, i) => {
				const square = document.createElement("div");
				square.id = `red-square-${i}`;
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
			});
		});

		return () => viewer.destroy();
	}, []);

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
			<div>
				<div className="overlay-top-right">
					<img src="public/tiles/night-sky_files/16/19_21.jpeg" alt="logo" />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
