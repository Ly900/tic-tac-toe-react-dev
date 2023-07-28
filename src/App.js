import { useState } from 'react';

function Square({ value, onSquareClick }) {
	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i) {
		if (squares[i] || calculateWinner(squares)) {
			return;
		}

		const nextSquares = squares.slice();

		if (xIsNext) {
			nextSquares[i] = 'X';
		} else {
			nextSquares[i] = 'O';
		}
		onPlay(nextSquares);
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = 'Winner: ' + winner;
	} else {
		status = 'Next player: ' + (xIsNext ? 'X' : 'O');
	}

	const boardArray = [];
	let startIndex;
	for (let i = 0; i <= 2; i++) {
		let squareRows = [];
		let squareStartingIndex = i * 3;
		startIndex = i * 0;
		for (let j = 0; j <= 2; j++) {
			squareRows.push(
				<Square
					key={squareStartingIndex + j}
					value={squares[squareStartingIndex + j]}
					onSquareClick={() => handleClick(squareStartingIndex + j)}
				/>
			);
		}
		boardArray.push(
			<div className="board-row" key={i}>
				{squareRows}
			</div>
		);
	}

	return (
		<>
			<div className="status">{status}</div>
			{boardArray}
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	const moves = history.map((squares, move) => {
		let description;
		let movesHTML;

		const beginningOfGame = move === 0;

		if (beginningOfGame) {
			movesHTML = (
				<li key={move}>
					<button onClick={() => jumpTo(move)}>Go to game start</button>
				</li>
			);
		} else if (move === history.length - 1) {
			movesHTML = (
				<li key={move}>
					<span className="current-move">You are on move # {move}</span>
				</li>
			);
		} else {
			movesHTML = (
				<li key={move}>
					<button onClick={() => jumpTo(move)}>Go to move # {move}</button>
				</li>
			);
		}

		return movesHTML;
	});

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
