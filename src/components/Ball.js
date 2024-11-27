import React from "react";
import "../styles/Ball.css";

function Ball({ color }) {
	if (!color) return null; // Ako nema boje, ne prikazuj ništa.

	return (
		<div
			className="ball"
			style={{
				backgroundColor: color,
			}}
		></div>
	);
}

export default Ball;
