import React, { useState, useEffect } from "react";
import Box from "./Box";
import "../styles/Container.css";
import Modal from "react-modal";

const gridSize = 100;
const initialBallColors = [
	"red",
	"green",
	"blue",
	"yellow",
	"purple",
	"orange",
	"gray",
	"brown",
	"darkgrey",
];

function Container() {
	const [grid, setGrid] = useState(Array(gridSize).fill(null));
	const [selectedBall, setSelectedBall] = useState(null);
	const [history, setHistory] = useState([]);
	const [score, setScore] = useState(0);
	const [modalContent, setModalContent] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Postavljanje lopti prilikom inicijalizacije
	useEffect(() => {
		addRandomBalls(3);
	}, []);

	const openModal = (content) => {
		setModalContent(content);
		setIsModalOpen(true);
	};

	const closeModal = () => setIsModalOpen(false);

	const addRandomBalls = (numBalls) => {
		let newGrid = [...grid];
		let count = 0;

		while (count < numBalls) {
			const randIndex = Math.floor(Math.random() * gridSize);
			if (!newGrid[randIndex]) {
				const color =
					initialBallColors[
						Math.floor(Math.random() * initialBallColors.length)
					];
				newGrid[randIndex] = color;
				count++;
			}
		}
		setGrid(newGrid);
	};

	const checkWinnings = (grid) => {
		let points = 0;
		const lines = [
			[1, 2, 3, 4], // horizontal
			[-1, -2, -3, -4],
			[10, 20, 30, 40], // vertical
			[-10, -20, -30, -40],
			[11, 22, 33, 44], // diagonal (top-left to bottom-right)
			[-11, -22, -33, -44],
			[9, 18, 27, 36], // diagonal (top-right to bottom-left)
			[-9, -18, -27, -36],
		];

		const newGrid = [...grid];
		let hasWinnings = false;

		grid.forEach((ball, index) => {
			if (!ball) return;

			lines.forEach((line) => {
				const winningBalls = line
					.map((offset) => newGrid[index + offset])
					.every((nextBall) => nextBall === ball);

				if (winningBalls) {
					hasWinnings = true;
					line.forEach((offset) => {
						const winningIndex = index + offset;
						if (newGrid[winningIndex]) newGrid[winningIndex] = null; // Ukloni loptu
					});
				}
			});
		});

		if (hasWinnings) {
			openModal("You scored!");
			setGrid(newGrid);
			points += 10; // Dodaj poene za svaku liniju
			setScore(score + points);
		}
	};

	const handleBoxClick = (index) => {
		if (selectedBall !== null) {
			if (!grid[index]) {
				const newGrid = [...grid];
				setHistory([...history, grid]);
				newGrid[selectedBall] = null;
				newGrid[index] = grid[selectedBall];
				setSelectedBall(null);
				setGrid(newGrid);
				addRandomBalls(3); // Dodavanje novih lopti nakon poteza
				checkWinnings(newGrid);
			} else {
				openModal("There is a ball in this box!");
			}
		} else if (grid[index]) {
			setSelectedBall(index);
		} else {
			openModal("Select a ball first!");
		}
	};

	const undo = () => {
		if (history.length === 0) {
			openModal("No moves to undo!");
		} else {
			const previousGrid = history[history.length - 1];
			setGrid(previousGrid);
			setHistory(history.slice(0, -1));
		}
	};

	return (
		<div className="container">
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				contentLabel="Game Message"
				style={{
					content: {
						top: "50%",
						left: "50%",
						right: "auto",
						bottom: "auto",
						marginRight: "-50%",
						transform: "translate(-50%, -50%)",
						padding: "20px",
						borderRadius: "10px",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
					},
				}}
			>
				<h2>{modalContent}</h2>
				<button className="button" onClick={closeModal}>
					Close
				</button>
			</Modal>

			{grid.map((ball, index) => (
				<Box
					key={index}
					color={ball}
					isSelected={selectedBall === index}
					onClick={() => handleBoxClick(index)}
				/>
			))}
			<button className="button" onClick={undo}>
				Undo
			</button>
		</div>
	);
}

export default Container;
