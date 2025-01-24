import React, { useState } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const playerSymbol = 'X';
  const botSymbol = 'O';

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    const newWinner = checkWinner(newBoard, playerSymbol);
    if (newWinner) return; 

    setIsPlayerTurn(false);

   
    setTimeout(() => {
      if (!winner) {
        botMove(newBoard);
      }
    }, 500);
  };

  const botMove = (currentBoard) => {
    const newBoard = [...currentBoard];
    const winningMove = findWinningMove(botSymbol, newBoard);
    const blockingMove = findWinningMove(playerSymbol, newBoard);

    let move = winningMove !== null ? winningMove : blockingMove;

    if (move === null || move === -1) {
      move = newBoard.findIndex((cell) => cell === null);
    }

    if (move !== -1 && move !== null) {
      newBoard[move] = botSymbol;
      setBoard(newBoard);
      const newWinner = checkWinner(newBoard, botSymbol);
      if (!newWinner) {
        setIsPlayerTurn(true);
      }
    }
  };

  const findWinningMove = (symbol, currentBoard) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      const values = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (values.filter((v) => v === symbol).length === 2 && values.includes(null)) {
        return combination[values.indexOf(null)];
      }
    }
    return null;
  };

  const checkWinner = (currentBoard, currentPlayer) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        setWinner(currentPlayer);
        if (currentPlayer === playerSymbol) {
          setPlayerScore((prevScore) => prevScore + 1);
        } else {
          setBotScore((prevScore) => prevScore + 1);
        }
        return currentPlayer; // Возвращаем победителя
      }
    }

  
    if (!currentBoard.includes(null)) {
      setWinner('Draw');
      return 'Draw';
    }

    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (playerName.trim() !== '') {
      resetGame(); 
    }
  };

  return (
    <div className="tic-tac-toe">
      <h1>Крестики-Нолики</h1>
      {!playerName ? (
        <div className="tic-tac-toe-form">
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              className="tic-tac-toe-input"
              placeholder="Введите одну букву"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </form>
        </div>
      ) : (
        <div>
          <div className="tic-tac-toe-scores">
            <p>
              {playerName}: {playerScore}
            </p>
            <p>Бот: {botScore}</p>
          </div>

          <div className="tic-tac-toe-board">
            {board.map((cell, index) => (
              <div
                key={index}
                className={`tic-tac-toe-cell ${cell ? 'taken' : ''}`}
                onClick={() => handleClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
          {winner && (
            <div className="tic-tac-toe-message">
              {winner === 'Draw'
                ? 'Ничья!'
                : `${winner === playerSymbol ? playerName : 'Бот'} Победил!`}
            </div>
          )}
          <button className="tic-tac-toe-button" onClick={resetGame}>
            Сбросить игру
          </button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
