import React from "react";
import "../styles/Box.css";
import Ball from "./Ball";

function Box({ color, isSelected, onClick }) {
	return (
		<div
			className={`box ${isSelected ? "selected" : ""}`}
			onClick={onClick}
			style={{
				border: isSelected ? "2px solid black" : "1px solid #999",
			}}
		>
			<Ball color={color} />
		</div>
	);
}

export default Box;
